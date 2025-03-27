import { useState, useEffect, useRef } from "react";
import { useParticipants } from "@livekit/components-react";
import styles from "../app/lessons/[lessonToken]/page.module.scss";

interface ChatPanelProps {
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatPanel({ setIsChatOpen }: ChatPanelProps) {
  const [messages, setMessages] = useState<
    { sender: string; text: string; time: Date }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const participants = useParticipants();

  // Для примера добавим несколько тестовых сообщений
  useEffect(() => {
    const exampleMessages = [
      {
        sender: "John",
        text: "Привет! Как дела?",
        time: new Date(Date.now() - 15 * 60000),
      },
      {
        sender: "Anna",
        text: "Всё хорошо, спасибо! Готовы начать урок?",
        time: new Date(Date.now() - 14 * 60000),
      },
      {
        sender: "John",
        text: "Да, конечно! У меня есть вопросы по прошлому материалу.",
        time: new Date(Date.now() - 10 * 60000),
      },
    ];
    setMessages(exampleMessages);
  }, []);

  // Автоматическая прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    // В реальном приложении здесь был бы код для отправки сообщения через API или WebSocket
    // Добавляем новое сообщение локально
    setMessages([
      ...messages,
      { sender: "You", text: newMessage, time: new Date() },
    ]);

    setNewMessage("");
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <h3>Чат</h3>
        <div className={styles.chatHeaderControls}>
          <div className={styles.participantsCount}>
            {participants.length} участников
          </div>
          <button
            className={styles.closeChatButton}
            onClick={() => setIsChatOpen(false)}
            title="Закрыть чат"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.sender === "You" ? styles.outgoing : styles.incoming
            }`}
          >
            <div className={styles.messageSender}>{msg.sender}</div>
            <div className={styles.messageText}>{msg.text}</div>
            <div className={styles.messageTime}>
              {msg.time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.chatForm} onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
          className={styles.chatInput}
        />
        <button type="submit" className={styles.sendButton}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
