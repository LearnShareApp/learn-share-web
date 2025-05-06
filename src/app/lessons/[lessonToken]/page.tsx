"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LiveKitRoom,
  useLocalParticipant,
  RoomAudioRenderer,
  useTracks,
  ParticipantTile,
} from "@livekit/components-react";
import { Track, Room, ConnectionState, RoomEvent } from "livekit-client";
import "@livekit/components-styles";
import styles from "./page.module.scss";
import { use } from "react";
import ChatPanel from "@/features/ChatPanel";

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
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Добавим useEffect для создания чата только при необходимости
  const [isChatMounted, setIsChatMounted] = useState(false);

  useEffect(() => {
    if (isChatOpen) {
      setIsChatMounted(true);
    } else {
      // Задержка для анимации выхода
      const timer = setTimeout(() => {
        setIsChatMounted(false);
      }, 300); // Должно соответствовать времени анимации CSS

      return () => clearTimeout(timer);
    }
  }, [isChatOpen]);

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
        <div
          className={`${styles.videoContainer} ${
            isChatOpen ? styles.withChat : ""
          }`}
        >
          <ImprovedVideoGrid />
        </div>

        <div
          className={`${styles.chatContainer} ${
            isChatOpen ? styles.visible : ""
          }`}
        >
          {isChatMounted && <ChatPanel setIsChatOpen={setIsChatOpen} />}
        </div>

        <div className={styles.controlsContainer}>
          <CustomControlBar
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
          />
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

  // Создаем свою сетку вместо использования GridLayout
  return (
    <div className={styles.videoGrid}>
      {tracks.map((track) => {
        // Определяем ключ для стабильного рендеринга
        const trackKey =
          track.participant.identity + (track.publication?.trackSid || "");

        // Определяем тип устройства пользователя
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            typeof navigator !== "undefined" ? navigator.userAgent : ""
          );

        return (
          <div
            key={trackKey}
            className={styles.participantTile}
            data-is-mobile={isMobile ? "true" : "false"}
          >
            <ParticipantTile
              trackRef={track}
              disableSpeakingIndicator={false}
              style={{ width: "100%", height: "100%", position: "relative" }}
            />
          </div>
        );
      })}
    </div>
  );
}

function CustomControlBar({
  isChatOpen,
  setIsChatOpen,
}: {
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleLeaveRoom = () => {
    if (roomInstance) {
      roomInstance.disconnect();
    }
    router.push("/lessons");
  };

  // Connection status indicator
  let connectionLabel = "";
  let connectionColor = "";
  if (connectionState === ConnectionState.Connected) {
    connectionLabel = "Connected";
    connectionColor = "#4caf50"; // зеленый
  } else if (connectionState === ConnectionState.Connecting) {
    connectionLabel = "Connecting...";
    connectionColor = "#ff9800"; // оранжевый
  } else if (connectionState === ConnectionState.Disconnected) {
    connectionLabel = "Disconnected";
    connectionColor = "#f44336"; // красный
  } else if (connectionState === ConnectionState.Reconnecting) {
    connectionLabel = "Reconnecting...";
    connectionColor = "#ff9800"; // оранжевый
  }

  return (
    <div className={styles.customControlBar}>
      <div className={styles.leftControls}>
        {connectionLabel && (
          <div
            className={styles.connectionStatus}
            style={
              {
                "--indicator-color": connectionColor,
              } as React.CSSProperties
            }
          >
            {connectionLabel}
          </div>
        )}
      </div>

      <div className={styles.centerControls}>
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
                  d="M12 14C13.66 14 15 12.66 15 11V8.34L11.66 11.68C11.78 11.88 11.92 12 12 12V14Z"
                  fill="currentColor"
                />
                <path
                  d="M14 3.41L11.66 5.75L9 8.41L9 11C9 12.66 10.34 14 12 14C12.5 14 12.95 13.87 13.33 13.65L14 14.32C13.38 14.75 12.72 15 12 15C10.34 15 9 13.66 9 12H7C7 14.76 9.24 17 12 17C13.51 17 14.84 16.36 15.73 15.33L16.25 15.85C16.64 16.24 17.27 16.24 17.66 15.85C18.05 15.46 18.05 14.83 17.66 14.44L14 10.78L5.56 2.34C5.17 1.95 4.54 1.95 4.15 2.34C3.76 2.73 3.76 3.36 4.15 3.75L7.31 6.91L7.76 7.36C7.3 8.33 7 9.4 7 10.5V10.78L4.41 13.37C4.02 13.76 4.02 14.39 4.41 14.78C4.8 15.17 5.43 15.17 5.82 14.78L8.2 12.4C8.3 12.99 8.5 13.55 8.77 14.07L4.15 18.69C3.76 19.08 3.76 19.71 4.15 20.1C4.54 20.49 5.17 20.49 5.56 20.1L10.57 15.09C11.46 16.16 12.84 16.85 14.42 16.97L13.04 18.35C12.65 18.74 12.65 19.37 13.04 19.76C13.43 20.15 14.06 20.15 14.45 19.76L19.78 14.43C20.17 14.04 20.17 13.41 19.78 13.02C19.39 12.63 18.76 12.63 18.37 13.02L16.8 14.59C16.36 14.22 16 13.77 15.73 13.22L16.25 12.7C16.64 12.31 16.64 11.68 16.25 11.29C15.86 10.9 15.23 10.9 14.84 11.29L13.35 12.78C12.6 12.45 12.03 11.85 11.76 11.09L14 8.85V5C14 4.45 13.8 4 13.48 3.68L14 3.16C14.39 2.77 14.39 2.14 14 1.75C13.61 1.36 12.98 1.36 12.59 1.75L9.14 5.2L8.2 6.14C8.07 5.92 7.94 5.71 7.84 5.48L9 4.32V5C9 5.55 8.55 6 8 6C7.45 6 7 5.55 7 5V3.41C7 2.52 8.08 2.07 8.68 2.68L14 8L14.5 7.5L14 3.41Z"
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
                  d="M23 9.5V14.5C23 14.78 22.84 15.04 22.57 15.15C22.5 15.18 22.42 15.19 22.35 15.19C22.14 15.19 21.94 15.09 21.82 14.91L19 10.91V13.08L21.82 9.08C21.98 8.86 22.23 8.74 22.5 8.77C22.77 8.79 23 9.07 23 9.35V9.5Z"
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
                  d="M15 17H14.2L4.2 7H3C2.4 7 2 7.4 2 8V16C2 16.6 2.4 17 3 17H15Z"
                  fill="currentColor"
                />
                <path
                  d="M21.8 14.9L20.1 12.8L19 13.1V10.9L20.3 11.3L22.6 8.2C22.7 8 22.8 7.7 22.7 7.4C22.5 7.2 22.3 7 22 7H18.8L15.9 4.1C15.7 3.9 15.4 3.9 15.1 4.1C14.9 4.3 14.9 4.6 15.1 4.9L19.2 9H15.9L4.4 2.3C4.1 2.1 3.8 2.2 3.6 2.4C3.4 2.7 3.5 3 3.8 3.2L5.7 4.3L4.4 3.2C4 2.9 3.8 2.6 3.2 2.2L2.8 1.8C2.6 1.6 2.3 1.6 2 1.8C1.8 2 1.8 2.3 2 2.6L4.8 5.4L6.5 6.5L17.5 17.5L21 21C21.2 21.2 21.5 21.2 21.8 21C22 20.8 22 20.5 21.8 20.2L21.4 19.8C21 19.4 20.7 19.2 20.4 18.8L18.9 17.3L19.7 17H22C22.3 17 22.5 16.8 22.7 16.6C22.8 16.3 22.7 16 22.5 15.8L21.8 14.9ZM6.3 10.9V13.08L8.6 11.76L6.3 10.9Z"
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
          title={
            isScreenShareEnabled
              ? "Stop screen sharing"
              : "Start screen sharing"
          }
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
                d="M20 18C21.1 18 21.99 17.1 21.99 16L22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V16C2 17.1 2.9 18 4 18H0V20H24V18H20ZM4 6H20V16H4V6Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>

        <button
          className={`${styles.controlButton} ${
            isChatOpen ? styles.active : styles.inactive
          }`}
          onClick={toggleChat}
          title={isChatOpen ? "Закрыть чат" : "Открыть чат"}
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
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>

        <button
          className={`${styles.controlButton} ${styles.leaveButton}`}
          onClick={handleLeaveRoom}
          title="Leave room"
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
                d="M10.09 15.59L11.5 17L16.5 12L11.5 7L10.09 8.41L12.67 11H3V13H12.67L10.09 15.59ZM19 3H5C3.89 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>
      </div>

      <div className={styles.rightControls}>
        {/* Пустой div для сохранения расположения */}
      </div>
    </div>
  );
}
