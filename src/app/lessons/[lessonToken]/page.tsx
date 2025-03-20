"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LiveKitRoom,
  useLocalParticipant,
  GridLayout,
  RoomAudioRenderer,
  useTracks,
  ParticipantTile,
} from "@livekit/components-react";
import { Track, Room, ConnectionState, RoomEvent } from "livekit-client";
import "@livekit/components-styles";
import styles from "./page.module.scss";
import { use } from "react";

// Определяем тип для params с типизацией
type PageParams = {
  lessonToken: string;
};

// Определяем тип для ошибок медиа
interface MediaError extends Error {
  name: string;
  message: string;
}

export default function LessonRoomPage({ params }: { params: PageParams }) {
  const router = useRouter();

  // Используем React.use() для получения params, как требуется в новой версии Next.js
  // @ts-expect-error - игнорируем предупреждение TypeScript, так как это новая функциональность Next.js
  const resolvedParams = use(params) as PageParams;
  const lessonToken = resolvedParams.lessonToken;

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [mediaDevicesAvailable, setMediaDevicesAvailable] =
    useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(false);

  // Вынесем проверку медиа-устройств в отдельную функцию для возможности повторного вызова
  const checkMediaDevices = useCallback(async () => {
    try {
      // Установка токена из URL
      if (lessonToken) {
        setToken(lessonToken);
      } else {
        setError("Отсутствует идентификатор урока");
        return;
      }

      // Проверка доступа к медиа только если мы в браузере
      if (typeof window !== "undefined" && typeof navigator !== "undefined") {
        try {
          if ("mediaDevices" in navigator) {
            console.log("MediaDevices API обнаружен, запрашиваем разрешения");

            // Явно запрашиваем разрешения на доступ к камере и микрофону
            try {
              // Пробуем получить доступ к камере и микрофону
              const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
              });

              console.log("Разрешения на доступ к камере и микрофону получены");

              // Освобождаем ресурсы, так как LiveKit будет запрашивать их снова
              stream.getTracks().forEach((track) => track.stop());

              // Если мы здесь, значит разрешения получены
              setMediaDevicesAvailable(true);
            } catch (mediaError) {
              console.error("Ошибка при запросе разрешений:", mediaError);

              const err = mediaError as MediaError;

              if (
                err.name === "NotAllowedError" ||
                err.name === "PermissionDeniedError"
              ) {
                setError("Доступ к камере или микрофону запрещен");
                setErrorDetails(
                  "Вы запретили доступ к камере и/или микрофону. Чтобы разрешить доступ:\n\n" +
                    "1. Нажмите на значок 🔒 или 🔒️ (замок) в адресной строке браузера\n" +
                    "2. Найдите раздел 'Разрешения для этого сайта'\n" +
                    "3. Разрешите доступ к камере и микрофону\n" +
                    "4. Перезагрузите страницу или нажмите кнопку 'Повторить подключение'"
                );
              } else if (err.name === "NotFoundError") {
                setError("Камера или микрофон не найдены");
                setErrorDetails(
                  "Ваше устройство не обнаружило подключенных камеры или микрофона. Убедитесь, что они подключены и работают."
                );
              } else {
                setError("Проблема с доступом к камере или микрофону");
                setErrorDetails(
                  `Техническая ошибка: ${err.name || "Неизвестная ошибка"}. ${
                    err.message || ""
                  }\n\n` +
                    "Попробуйте перезагрузить страницу или использовать другой браузер."
                );
              }
              return;
            }
          } else {
            console.warn("MediaDevices API не обнаружен");
            setError("Браузер не поддерживает видеозвонки");
            setErrorDetails(
              "Ваш браузер не поддерживает API для доступа к камере и микрофону (MediaDevices). " +
                "Рекомендуется использовать последнюю версию Chrome, Firefox или Safari.\n\n" +
                "Если вы уже используете современный браузер, проверьте следующее:\n" +
                "1. Вы используете защищенное соединение (HTTPS)\n" +
                "2. У вас не включен режим инкогнито\n" +
                "3. В настройках браузера разрешен доступ к камере и микрофону для этого сайта"
            );
            return;
          }
        } catch (err) {
          console.error("Ошибка при проверке медиа-устройств:", err);
          setError("Error checking media devices");
          setErrorDetails(
            "An error occurred while checking for camera and microphone. " +
              "Your browser may be blocking access to them or they are being used by another application."
          );
          return;
        }
      } else {
        // На сервере просто устанавливаем флаг в true
        setMediaDevicesAvailable(true);
      }
    } catch (err) {
      console.error("Ошибка при инициализации урока:", err);
      setError("Failed to initialize the lesson. Please refresh the page.");
      setErrorDetails(err instanceof Error ? err.message : String(err));
    }
  }, [lessonToken]);

  // Обработчик для повторного подключения
  const handleRetry = useCallback(() => {
    setError(null);
    setErrorDetails(null);

    // Проверяем медиа-устройства заново
    checkMediaDevices();
  }, [checkMediaDevices]);

  // Компонент с инструкциями для разрешения камеры и микрофона
  function PermissionInstructions() {
    return (
      <div className={styles.permissionInstructions}>
        <p>
          To make the video call work, you need to allow access to camera and
          microphone:
        </p>
        <ol style={{ textAlign: "left", marginBottom: "20px" }}>
          <li>
            Click on the <strong>🔒</strong> icon in the address bar
          </li>
          <li>
            In the popup menu, select <strong>Allow</strong> for camera and
            microphone
          </li>
          <li>
            Reload the page or click the &quot;Retry connection&quot; button
          </li>
        </ol>
      </div>
    );
  }

  // Проверяем доступность медиа-устройств перед запуском LiveKit
  useEffect(() => {
    checkMediaDevices();
  }, [checkMediaDevices]);

  const handleDisconnect = () => {
    console.log("Отключение от комнаты");
    setIsConnected(false);
    router.push("/lessons");
  };

  if (error) {
    // Определяем, является ли ошибка связанной с разрешениями камеры/микрофона
    const isPermissionError =
      error.includes("camera") || error.includes("microphone");

    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{error}</div>

        {/* Показываем визуальные инструкции для ошибок с разрешениями */}
        {isPermissionError && <PermissionInstructions />}

        {errorDetails && (
          <div className={styles.errorDetails}>
            <details>
              <summary>Technical details</summary>
              <p>{errorDetails}</p>
            </details>
          </div>
        )}
        <div className={styles.errorActions}>
          <button
            onClick={handleRetry}
            className={`${styles.backButton} ${styles.retryButton}`}
          >
            Retry connection
          </button>
          <button
            onClick={() => router.push("/lessons")}
            className={styles.backButton}
          >
            Back to lessons
          </button>
        </div>
      </div>
    );
  }

  if (!token || !mediaDevicesAvailable) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <div>Connecting to the lesson...</div>
      </div>
    );
  }

  const serverUrl = process.env.NEXT_PUBLIC_LiveKit_URL;

  console.log("Подключение к LiveKit:", { serverUrl, tokenAvailable: !!token });

  // Проверка наличия serverUrl
  if (!serverUrl) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          Configuration error: LiveKit server URL not found. Please contact the
          administrator.
        </div>
        <button
          onClick={() => router.push("/lessons")}
          className={styles.backButton}
        >
          Back to lessons
        </button>
      </div>
    );
  }

  return (
    <div className={styles.roomContainer}>
      <LiveKitRoom
        key={`livekit-room-${token}`} // Создаем новый экземпляр при изменении токена
        data-lk-theme="default"
        serverUrl={serverUrl}
        token={token}
        onDisconnected={() => {
          console.log("Отключено от комнаты LiveKit");
          setIsConnected(false);
          // Если не было ошибки, перенаправляем на страницу уроков
          if (!error) {
            handleDisconnect();
          }
        }}
        onConnected={() => {
          console.log("Успешно подключились к комнате LiveKit");
          // Очищаем ошибки при успешном подключении
          setError(null);
          setErrorDetails(null);
          setIsConnected(true);
        }}
        onError={(err) => {
          console.error("Error connecting to LiveKit:", err);

          // Определяем понятное сообщение об ошибке на английском языке
          let errorMessage = "Error connecting to the lesson";
          let detailMessage = err.message || "Unknown error";

          if (err.message.includes("getUserMedia")) {
            errorMessage = "Failed to access camera or microphone";
            detailMessage =
              "Possible reasons: you didn't grant permission to use camera/microphone, devices are being used by another application, or they are not available in your system.\n\n" +
              "Try: refreshing the page, checking browser permissions, or connecting a camera/microphone.";
          } else if (err.message.includes("permission")) {
            errorMessage = "Missing required permissions";
            detailMessage =
              "Please allow access to camera and microphone in your browser settings.";
          } else if (
            err.message.includes("connect") ||
            err.message.includes("connection")
          ) {
            errorMessage = "Error connecting to server";
            detailMessage =
              "Check your internet connection or try again later.";
          } else if (
            err.message.includes("AudioContext") ||
            err.message.includes("audio")
          ) {
            errorMessage = "Audio problem";
            detailMessage =
              "Possible reasons: audio context is closed or already used by another application.\n\n" +
              "Try: refreshing the page or closing other applications using the microphone.";
          }

          setError(errorMessage);
          setErrorDetails(detailMessage);
          setIsConnected(false);
        }}
        // Опции медиа
        video={true}
        audio={true}
        connect={true}
        // Дополнительные опции для стабильности соединения
        options={{
          adaptiveStream: true, // Адаптивный поток для плохого соединения
          dynacast: true, // Динамическая трансляция для экономии ресурсов
        }}
      >
        <div className={styles.videoContainer}>
          <ImprovedVideoGrid />
        </div>
        <div className={styles.controlsContainer}>
          <CustomControlBar />
        </div>
        {/* Используем условный рендеринг для RoomAudioRenderer, чтобы избежать проблем с AudioContext */}
        {isConnected && <RoomAudioRenderer />}
      </LiveKitRoom>
    </div>
  );
}

function ImprovedVideoGrid() {
  // Получаем все видеотреки (камера + демонстрация экрана)
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    {
      onlySubscribed: false,
    }
  );

  console.log("Доступные треки:", tracks.length);

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "100%" }}
      className={styles.videoGrid}
    >
      <ParticipantTile
        className={styles.participantTile}
        disableSpeakingIndicator={false}
      />
    </GridLayout>
  );
}

function CustomControlBar() {
  const { localParticipant } = useLocalParticipant();
  const [roomInstance, setRoomInstance] = useState<Room | null>(null);
  const router = useRouter();

  // State for control buttons
  const [isMicrophoneEnabled, setMicrophoneEnabled] = useState(true);
  const [isCameraEnabled, setCameraEnabled] = useState(true);
  const [isScreenShareEnabled, setScreenShareEnabled] = useState(false);
  const [connectionState, setConnectionState] =
    useState<ConnectionState | null>(null);

  useEffect(() => {
    // Get room instance from localParticipant
    if (localParticipant) {
      try {
        // @ts-expect-error - Ignore TS error as we know localParticipant has access to room
        const room = localParticipant._room;
        if (room) {
          setRoomInstance(room);

          // Monitor connection state
          const handleConnectionStateChange = (state: ConnectionState) => {
            console.log("Connection state changed:", state);
            setConnectionState(state);
          };

          room.on(
            RoomEvent.ConnectionStateChanged,
            handleConnectionStateChange
          );

          // Check current device state
          const mic = localParticipant.isMicrophoneEnabled;
          const camera = localParticipant.isCameraEnabled;

          setMicrophoneEnabled(mic);
          setCameraEnabled(camera);

          console.log("Initial device state:", { mic, camera });

          return () => {
            // Clean up listeners when unmounting
            room.off(
              RoomEvent.ConnectionStateChanged,
              handleConnectionStateChange
            );
          };
        }
      } catch (e) {
        console.error("Error getting room:", e);
      }
    }
  }, [localParticipant]);

  const toggleMicrophone = async () => {
    if (localParticipant) {
      try {
        await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
        setMicrophoneEnabled(!isMicrophoneEnabled);
        console.log(
          "Microphone:",
          !isMicrophoneEnabled ? "enabled" : "disabled"
        );
      } catch (e) {
        console.error("Error toggling microphone:", e);
        alert(
          "Failed to enable microphone. Check that your browser has access to the microphone."
        );
      }
    }
  };

  const toggleCamera = async () => {
    if (localParticipant) {
      try {
        await localParticipant.setCameraEnabled(!isCameraEnabled);
        setCameraEnabled(!isCameraEnabled);
        console.log("Camera:", !isCameraEnabled ? "enabled" : "disabled");
      } catch (e) {
        console.error("Error toggling camera:", e);
        alert(
          "Failed to enable camera. Check that your browser has access to the camera."
        );
      }
    }
  };

  const toggleScreenShare = async () => {
    if (localParticipant) {
      try {
        await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
        setScreenShareEnabled(!isScreenShareEnabled);
        console.log(
          "Screen sharing:",
          !isScreenShareEnabled ? "enabled" : "disabled"
        );
      } catch (e) {
        console.error("Error toggling screen sharing:", e);
        alert(
          "Failed to start screen sharing. Check your browser permissions."
        );
      }
    }
  };

  const handleLeaveRoom = () => {
    if (roomInstance) {
      roomInstance.disconnect();
    }
    router.push("/lessons");
  };

  // Connection status
  let connectionLabel = "";
  if (connectionState === ConnectionState.Connected) {
    connectionLabel = "Connected";
  } else if (connectionState === ConnectionState.Connecting) {
    connectionLabel = "Connecting...";
  } else if (connectionState === ConnectionState.Disconnected) {
    connectionLabel = "Disconnected";
  } else if (connectionState === ConnectionState.Reconnecting) {
    connectionLabel = "Reconnecting...";
  }

  return (
    <div className={styles.customControlBar}>
      {connectionLabel && (
        <div className={styles.connectionStatus}>{connectionLabel}</div>
      )}
      <button
        className={`${styles.controlButton} ${
          isMicrophoneEnabled ? styles.active : styles.inactive
        }`}
        onClick={toggleMicrophone}
        title={
          isMicrophoneEnabled ? "Turn off microphone" : "Turn on microphone"
        }
      >
        <span className={styles.buttonIcon}>
          {isMicrophoneEnabled ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z"
                fill="currentColor"
              />
              <path
                d="M17.91 11C17.91 11.41 17.87 11.8 17.81 12.19C17.76 12.54 18.04 12.85 18.39 12.9C18.42 12.91 18.45 12.91 18.48 12.91C18.79 12.91 19.06 12.68 19.11 12.36C19.18 11.91 19.22 11.46 19.22 11C19.22 10.45 18.77 10 18.22 10C17.67 10 17.22 10.45 17.22 11C17.22 11.12 17.21 11.23 17.2 11.35C17.16 11.66 17.38 11.94 17.69 11.98C17.71 11.98 17.74 11.99 17.76 11.99C18.03 11.99 18.27 11.79 18.3 11.52C18.3 11.35 18.31 11.17 18.31 11C18.31 10.95 18.31 10.9 18.31 10.85C18.35 10.42 18.06 10.05 17.63 10.01C17.2 9.97 16.83 10.25 16.79 10.69C16.78 10.79 16.77 10.9 16.77 11C16.77 11.08 16.77 11.16 16.78 11.23C16.82 11.66 17.19 11.95 17.62 11.91C18.05 11.87 18.33 11.5 18.29 11.07C18.29 11.05 18.29 11.02 18.29 11C18.29 10.55 18.74 10.1 19.19 10.1C19.64 10.1 20.09 10.55 20.09 11C20.09 11.48 20.04 11.95 19.96 12.41C19.86 12.96 20.21 13.5 20.77 13.59C20.83 13.6 20.9 13.61 20.96 13.61C21.44 13.61 21.87 13.26 21.95 12.77C22.04 12.24 22.09 11.69 22.09 11.14C22.09 9.46 20.71 8.09 19.03 8.09C17.35 8.09 15.97 9.47 15.97 11.14C15.97 11.44 16 11.73 16.05 12.02C16.14 12.54 16.65 12.89 17.17 12.8C17.7 12.71 18.04 12.2 17.95 11.67C17.92 11.45 17.9 11.23 17.9 11H17.91Z"
                fill="currentColor"
              />
              <path
                d="M12 15.5C8.49 15.5 5.64 18.28 5.5 21.76C5.48 22.31 5.92 22.77 6.47 22.8C6.49 22.8 6.5 22.8 6.52 22.8C7.04 22.8 7.47 22.39 7.5 21.87C7.59 19.46 9.59 17.5 12 17.5C14.41 17.5 16.41 19.46 16.5 21.87C16.53 22.4 16.97 22.8 17.49 22.8C17.5 22.8 17.52 22.8 17.53 22.8C18.08 22.78 18.52 22.31 18.5 21.76C18.36 18.27 15.5 15.5 12 15.5Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.95 4.27L15.56 5.66C16.41 6.75 17 8.25 17 9.88V10H19V9.88C19 7.93 18.22 6.15 16.95 4.27Z"
                fill="currentColor"
              />
              <path
                d="M12 16C14.76 16 17 13.76 17 11V4H7V9.8L11.2 5.6V5C11.2 4.45 11.65 4 12.2 4C12.75 4 13.2 4.45 13.2 5V11.8L15.85 9.15C15.85 9.15 15.85 9.15 15.85 9.14C15.66 6.81 13.75 5 11.39 5C11.38 5 11.36 5 11.35 5H7.27L3.27 9H3V11C3 13.76 5.24 16 8 16H12ZM15 11C15 12.66 13.66 14 12 14V14V14C10.34 14 9 12.66 9 11V7.81L15 1.81V11Z"
                fill="currentColor"
              />
              <path
                d="M2.10001 2.1L0.900009 3.3L20.7 23.1L21.9 21.9L17.2 17.2C15.5 18.3 13.5 19 11.4 19C6.69999 19 2.89999 15.3 2.89999 10.6V4L2.10001 2.1Z"
                fill="currentColor"
              />
            </svg>
          )}
        </span>
      </button>
      <button
        className={`${styles.controlButton} ${
          isCameraEnabled ? styles.active : styles.inactive
        }`}
        onClick={toggleCamera}
        title={isCameraEnabled ? "Turn off camera" : "Turn on camera"}
      >
        <span className={styles.buttonIcon}>
          {isCameraEnabled ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 8V16C15 16.55 14.55 17 14 17H3C2.45 17 2 16.55 2 16V8C2 7.45 2.45 7 3 7H14C14.55 7 15 7.45 15 8Z"
                fill="currentColor"
              />
              <path
                d="M23 9.5V14.5C23 14.78 22.78 15 22.5 15C22.39 15 22.28 14.96 22.18 14.89L17.3 11.47C17.12 11.33 17.01 11.17 17.01 11C17.01 10.83 17.12 10.67 17.3 10.54L22.18 7.11C22.28 7.04 22.39 7 22.5 7C22.78 7 23 7.22 23 7.5V9.5Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 10.48V6C18 4.9 17.1 4 16 4H4.48L18 10.48Z"
                fill="currentColor"
              />
              <path
                d="M2.1 2.1L0.9 3.3L2 4.4V18C2 19.1 2.9 20 4 20H17.6L20.7 23.1L21.9 21.9L2.1 2.1ZM16 18H4V6.47L16 18Z"
                fill="currentColor"
              />
              <path
                d="M19.4 13.57L16 10.76V12.11L19.38 14.38C19.5 14.21 19.5 14.02 19.5 13.8V10.21C19.5 9.43 18.6 8.94 17.94 9.3L15.62 10.74L18 12.66C18.89 13.25 20 12.61 20 11.54V10.2C20 9.32 19.05 8.82 18.38 9.31L17.9 9.65L19.4 10.79V13.57Z"
                fill="currentColor"
              />
            </svg>
          )}
        </span>
      </button>
      <button
        className={`${styles.controlButton} ${
          isScreenShareEnabled ? styles.active : styles.inactive
        }`}
        onClick={toggleScreenShare}
        title={isScreenShareEnabled ? "Stop sharing" : "Screen sharing"}
      >
        <span className={styles.buttonIcon}>
          {isScreenShareEnabled ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 18C21.1 18 22 17.1 22 16V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V16C2 17.1 2.9 18 4 18H0V20H24V18H20ZM4 6H20V16H4V6Z"
                fill="currentColor"
              />
              <path d="M9 10H11V12H9V10Z" fill="currentColor" />
              <path d="M13 10H15V12H13V10Z" fill="currentColor" />
              <path d="M9 13H11V15H9V13Z" fill="currentColor" />
              <path d="M13 13H15V15H13V13Z" fill="currentColor" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 18C21.1 18 22 17.1 22 16V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V16C2 17.1 2.9 18 4 18H0V20H24V18H20ZM4 6H20V16H4V6Z"
                fill="currentColor"
              />
            </svg>
          )}
        </span>
      </button>
      <button
        className={`${styles.controlButton} ${styles.leaveButton}`}
        onClick={handleLeaveRoom}
        title="End call"
      >
        <span className={styles.buttonIcon}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM16.3 16.3C15.91 16.69 15.28 16.69 14.89 16.3L12 13.41L9.11 16.3C8.72 16.69 8.09 16.69 7.7 16.3C7.31 15.91 7.31 15.28 7.7 14.89L10.59 12L7.7 9.11C7.31 8.72 7.31 8.09 7.7 7.7C8.09 7.31 8.72 7.31 9.11 7.7L12 10.59L14.89 7.7C15.28 7.31 15.91 7.31 16.3 7.7C16.69 8.09 16.69 8.72 16.3 9.11L13.41 12L16.3 14.89C16.68 15.28 16.68 15.91 16.3 16.3Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
