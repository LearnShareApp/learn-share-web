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
import {
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Loader2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  MessageSquare,
  XSquare,
  PhoneOff,
} from "lucide-react";

// Определяем тип для params с типизацией
type PageParams = {
  lessonToken: string;
};

// Определяем тип для ошибок медиа
interface MediaError extends Error {
  name: string;
  message: string;
}

export default function LessonRoomPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const router = useRouter();

  // Используем React.use() для получения params, как требуется в новой версии Next.js
  const resolvedParams = use(params);
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
              <summary>
                <AlertTriangle
                  size={16}
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Technical details
              </summary>
              <p>{errorDetails}</p>
            </details>
          </div>
        )}
        <div className={styles.errorActions}>
          <button
            onClick={handleRetry}
            className={`${styles.backButton} ${styles.retryButton}`}
          >
            <RefreshCw size={16} style={{ marginRight: "8px" }} />
            Retry connection
          </button>
          <button
            onClick={() => router.push("/lessons")}
            className={styles.backButton}
          >
            <ArrowLeft size={16} style={{ marginRight: "8px" }} />
            Back to lessons
          </button>
        </div>
      </div>
    );
  }

  if (!token || !mediaDevicesAvailable) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.loadingSpinner} size={48} />
        <div>Connecting to the lesson...</div>
      </div>
    );
  }

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

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
          <ArrowLeft size={16} style={{ marginRight: "8px" }} />
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
            {isMicrophoneEnabled ? <Mic size={24} /> : <MicOff size={24} />}
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
            {isCameraEnabled ? <Video size={24} /> : <VideoOff size={24} />}
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
            {isScreenShareEnabled ? (
              <ScreenShareOff size={24} />
            ) : (
              <ScreenShare size={24} />
            )}
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
            {isChatOpen ? <XSquare size={24} /> : <MessageSquare size={24} />}
          </span>
        </button>

        <button
          className={`${styles.controlButton} ${styles.leaveButton}`}
          onClick={handleLeaveRoom}
          title="Leave room"
        >
          <span className={styles.buttonIcon}>
            <PhoneOff size={24} />
          </span>
        </button>
      </div>

      <div className={styles.rightControls}>
        {/* Пустой div для сохранения расположения */}
      </div>
    </div>
  );
}
