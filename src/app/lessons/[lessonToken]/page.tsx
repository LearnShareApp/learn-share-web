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
          console.warn("Ошибка при проверке медиа-устройств:", err);
          setError("Ошибка при проверке медиа-устройств");
          setErrorDetails(
            "Произошла ошибка при проверке наличия камеры и микрофона. " +
              "Возможно, ваш браузер блокирует доступ к ним или они используются другим приложением."
          );
          return;
        }
      } else {
        // На сервере просто устанавливаем флаг в true
        setMediaDevicesAvailable(true);
      }
    } catch (err) {
      console.error("Ошибка при инициализации урока:", err);
      setError(
        "Не удалось инициализировать урок. Пожалуйста, обновите страницу."
      );
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
          Для работы видеозвонка необходимо разрешить доступ к камере и
          микрофону:
        </p>
        <ol style={{ textAlign: "left", marginBottom: "20px" }}>
          <li>
            Нажмите на значок <strong>🔒</strong> в адресной строке
          </li>
          <li>
            В появившемся меню выберите <strong>Разрешить</strong> для камеры и
            микрофона
          </li>
          <li>
            Перезагрузите страницу или нажмите кнопку &quot;Повторить
            подключение&quot;
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
    const isPermissionError = error.includes("Доступ к камере или микрофону");

    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{error}</div>

        {/* Показываем визуальные инструкции для ошибок с разрешениями */}
        {isPermissionError && <PermissionInstructions />}

        {errorDetails && (
          <div className={styles.errorDetails}>
            <details>
              <summary>Технические детали</summary>
              <p>{errorDetails}</p>
            </details>
          </div>
        )}
        <div className={styles.errorActions}>
          <button
            onClick={handleRetry}
            className={`${styles.backButton} ${styles.retryButton}`}
          >
            Повторить подключение
          </button>
          <button
            onClick={() => router.push("/lessons")}
            className={styles.backButton}
          >
            Вернуться к урокам
          </button>
        </div>
      </div>
    );
  }

  if (!token || !mediaDevicesAvailable) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <div>Подключение к уроку...</div>
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
          Ошибка конфигурации: URL сервера LiveKit не найден. Пожалуйста,
          сообщите администратору.
        </div>
        <button
          onClick={() => router.push("/lessons")}
          className={styles.backButton}
        >
          Вернуться к урокам
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
          console.error("Ошибка при подключении к LiveKit:", err);

          // Определяем понятное сообщение об ошибке на русском языке
          let errorMessage = "Ошибка подключения к уроку";
          let detailMessage = err.message || "Неизвестная ошибка";

          if (err.message.includes("getUserMedia")) {
            errorMessage = "Не удалось получить доступ к камере или микрофону";
            detailMessage =
              "Возможные причины: вы не дали разрешение на использование камеры/микрофона, устройства заняты другим приложением или отсутствуют в системе.\n\n" +
              "Попробуйте: перезагрузить страницу, проверить разрешения браузера или подключить камеру/микрофон.";
          } else if (err.message.includes("permission")) {
            errorMessage = "Отсутствуют необходимые разрешения";
            detailMessage =
              "Пожалуйста, разрешите доступ к камере и микрофону в настройках браузера.";
          } else if (
            err.message.includes("connect") ||
            err.message.includes("connection")
          ) {
            errorMessage = "Ошибка подключения к серверу";
            detailMessage =
              "Проверьте ваше интернет-соединение или попробуйте позже.";
          } else if (
            err.message.includes("AudioContext") ||
            err.message.includes("audio")
          ) {
            errorMessage = "Проблема с аудио";
            detailMessage =
              "Возможные причины: аудио контекст закрыт или уже используется другим приложением.\n\n" +
              "Попробуйте: перезагрузить страницу или закрыть другие приложения, использующие микрофон.";
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

  // Состояния для кнопок управления
  const [isMicrophoneEnabled, setMicrophoneEnabled] = useState(true);
  const [isCameraEnabled, setCameraEnabled] = useState(true);
  const [isScreenShareEnabled, setScreenShareEnabled] = useState(false);
  const [connectionState, setConnectionState] =
    useState<ConnectionState | null>(null);

  useEffect(() => {
    // Получаем экземпляр комнаты из localParticipant
    if (localParticipant) {
      try {
        // @ts-expect-error - Игнорируем ошибку TS, так как мы знаем, что у localParticipant есть доступ к room
        const room = localParticipant._room;
        if (room) {
          setRoomInstance(room);

          // Мониторим состояние подключения
          const handleConnectionStateChange = (state: ConnectionState) => {
            console.log("Состояние подключения изменилось:", state);
            setConnectionState(state);
          };

          room.on(
            RoomEvent.ConnectionStateChanged,
            handleConnectionStateChange
          );

          // Проверяем текущее состояние устройств
          const mic = localParticipant.isMicrophoneEnabled;
          const camera = localParticipant.isCameraEnabled;

          setMicrophoneEnabled(mic);
          setCameraEnabled(camera);

          console.log("Начальное состояние устройств:", { mic, camera });

          return () => {
            // Очистка слушателей при размонтировании
            room.off(
              RoomEvent.ConnectionStateChanged,
              handleConnectionStateChange
            );
          };
        }
      } catch (e) {
        console.error("Ошибка при получении комнаты:", e);
      }
    }
  }, [localParticipant]);

  const toggleMicrophone = async () => {
    if (roomInstance) {
      try {
        await roomInstance.localParticipant.setMicrophoneEnabled(
          !isMicrophoneEnabled
        );
        setMicrophoneEnabled(!isMicrophoneEnabled);
        console.log("Микрофон:", !isMicrophoneEnabled ? "включен" : "выключен");
      } catch (e) {
        console.error("Ошибка переключения микрофона:", e);
        alert(
          "Не удалось включить микрофон. Проверьте, что у браузера есть доступ к микрофону."
        );
      }
    }
  };

  const toggleCamera = async () => {
    if (roomInstance) {
      try {
        await roomInstance.localParticipant.setCameraEnabled(!isCameraEnabled);
        setCameraEnabled(!isCameraEnabled);
        console.log("Камера:", !isCameraEnabled ? "включена" : "выключена");
      } catch (e) {
        console.error("Ошибка переключения камеры:", e);
        alert(
          "Не удалось включить камеру. Проверьте, что у браузера есть доступ к камере."
        );
      }
    }
  };

  const toggleScreenShare = async () => {
    if (roomInstance) {
      try {
        await roomInstance.localParticipant.setScreenShareEnabled(
          !isScreenShareEnabled
        );
        setScreenShareEnabled(!isScreenShareEnabled);
        console.log(
          "Демонстрация экрана:",
          !isScreenShareEnabled ? "включена" : "выключена"
        );
      } catch (e) {
        console.error("Ошибка переключения демонстрации экрана:", e);
        alert(
          "Не удалось начать демонстрацию экрана. Проверьте разрешения браузера."
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

  // Статус подключения
  let connectionLabel = "";
  if (connectionState === ConnectionState.Connected) {
    connectionLabel = "Подключено";
  } else if (connectionState === ConnectionState.Connecting) {
    connectionLabel = "Подключение...";
  } else if (connectionState === ConnectionState.Disconnected) {
    connectionLabel = "Отключено";
  } else if (connectionState === ConnectionState.Reconnecting) {
    connectionLabel = "Переподключение...";
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
      >
        {isMicrophoneEnabled ? "Выключить микрофон" : "Включить микрофон"}
      </button>
      <button
        className={`${styles.controlButton} ${
          isCameraEnabled ? styles.active : styles.inactive
        }`}
        onClick={toggleCamera}
      >
        {isCameraEnabled ? "Выключить камеру" : "Включить камеру"}
      </button>
      <button
        className={`${styles.controlButton} ${
          isScreenShareEnabled ? styles.active : styles.inactive
        }`}
        onClick={toggleScreenShare}
      >
        {isScreenShareEnabled
          ? "Остановить демонстрацию"
          : "Демонстрация экрана"}
      </button>
      <button
        className={`${styles.controlButton} ${styles.leaveButton}`}
        onClick={handleLeaveRoom}
      >
        Завершить звонок
      </button>
    </div>
  );
}
