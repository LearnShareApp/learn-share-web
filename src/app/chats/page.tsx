"use client";

import { useState, useRef, useMemo } from "react";
import styles from "./page.module.scss";
import Avatar from "@/components/avatar/Avatar";
import { Calendar, Paperclip, Smile, Send, MessageSquare } from "lucide-react";

type Lesson = {
  title: string;
  info: string;
};

type Message =
  | {
      id: string;
      type: "other";
      avatarId: string | null;
      text: string;
      time: string;
    }
  | {
      id: string;
      type: "me";
      text: string;
      time: string;
    }
  | {
      id: string;
      type: "system";
      text: string;
      lesson?: Lesson;
      time: string;
    };

const chats: {
  id: string;
  name: string;
  avatarId: string | null;
  date: string;
  preview: string;
  unread: number;
  messages: Message[];
}[] = [
  {
    id: "1",
    name: "Learning Tools",
    avatarId: null,
    date: "May 14",
    preview: "Come and listen to o...",
    unread: 1,
    messages: [
      {
        id: "m1",
        type: "other",
        avatarId: null,
        text: "Welcome to Learning Tools!",
        time: "May 14 10:00",
      },
    ],
  },
  {
    id: "2",
    name: "Alex",
    avatarId: "alex-avatar-id",
    date: "May 12",
    preview: "lets looks at past, pr...",
    unread: 0,
    messages: [
      {
        id: "m2",
        type: "other",
        avatarId: "alex-avatar-id",
        text: "\u201cI wish it need not have happened in my time,\u201d<br />said Frodo.<br />\u201cSo do I,\u201d said Gandalf, \u201cand so do all who live to see such times. But that is not for them to decide. All we have to decide is what to do with the time that is given us.\u201d",
        time: "May 12 19:30",
      },
      {
        id: "m3",
        type: "system",
        text: "Lesson starts in 30 mins.",
        lesson: {
          title: "English Classes",
          info: "English · 60 minutes",
        },
        time: "May 12 21:00",
      },
      {
        id: "m4",
        type: "other",
        avatarId: "alex-avatar-id",
        text: "make perfect tense sentences",
        time: "May 12 21:00",
      },
      {
        id: "m5",
        type: "me",
        text: "lets looks at past, present and future perfect",
        time: "May 12 21:01",
      },
    ],
  },
];

export default function ChatsPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [chatList, setChatList] = useState(chats);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredChats = useMemo(
    () =>
      chatList.filter((chat) =>
        chat.name.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [chatList, search]
  );

  const selectedChat = selectedChatId
    ? chatList.find((c) => c.id === selectedChatId)
    : null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setChatList((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: `m${Date.now()}`,
                  type: "me",
                  text: input,
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ],
            }
          : chat
      )
    );
    setInput("");
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        alert(`Файл: ${target.files[0].name}`);
      }
    };
    input.click();
  };

  const handleSmile = () => {
    alert("Скоро появятся стикеры!");
  };

  const handleCalendar = () => {
    alert("Открыть расписание");
  };

  return (
    <div className={styles.chatsPage}>
      <aside className={styles.sidebar}>
        <input
          className={styles.search}
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className={styles.chatList}>
          {filteredChats.map((chat) => (
            <li
              key={chat.id}
              className={
                styles.chatItem +
                (chat.id === selectedChatId ? ` ${styles.selected}` : "") +
                (chat.unread ? ` ${styles.unread}` : "")
              }
              onClick={() => setSelectedChatId(chat.id)}
            >
              <div className={styles.avatar}>
                <Avatar size={44} avatarId={null} />
              </div>
              <div className={styles.chatInfo}>
                <div className={styles.topRow}>
                  <span className={styles.name}>{chat.name}</span>
                  <span className={styles.date}>{chat.date}</span>
                </div>
                <div className={styles.bottomRow}>
                  <span className={styles.preview}>{chat.preview}</span>
                  {chat.unread ? (
                    <span className={styles.unreadBadge}>{chat.unread}</span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <main className={styles.main}>
        {selectedChat ? (
          <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
              <span className={styles.chatTitle}>{selectedChat.name}</span>
              <span className={styles.headerActions}>
                <button className={styles.iconBtn} onClick={handleCalendar}>
                  <Calendar size={22} />
                </button>
              </span>
            </div>
            <div className={styles.messagesArea}>
              {selectedChat.messages.map((msg) => {
                if (msg.type === "system") {
                  return (
                    <div className={styles.systemMessage} key={msg.id}>
                      <div>{msg.text}</div>
                      {msg.lesson && (
                        <div className={styles.lessonCard}>
                          <div className={styles.lessonTitle}>
                            {msg.lesson.title}
                          </div>
                          <div className={styles.lessonInfo}>
                            {msg.lesson.info}
                          </div>
                        </div>
                      )}
                      <div className={styles.messageTime}>{msg.time}</div>
                    </div>
                  );
                }
                if (msg.type === "other") {
                  return (
                    <div
                      className={styles.message + " " + styles.messageOther}
                      key={msg.id}
                    >
                      <div className={styles.avatarSmall}>
                        <Avatar size={32} avatarId={null} />
                      </div>
                      <div className={styles.messageContent}>
                        <div
                          className={styles.messageText}
                          dangerouslySetInnerHTML={{ __html: msg.text }}
                        />
                        <div className={styles.messageTime}>{msg.time}</div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    className={styles.message + " " + styles.messageMe}
                    key={msg.id}
                  >
                    <div className={styles.messageContent}>
                      <div className={styles.messageText}>{msg.text}</div>
                      <div className={styles.messageTime}>{msg.time}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <form
              className={styles.inputArea}
              onSubmit={handleSend}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            >
              <button
                className={styles.iconBtn}
                type="button"
                onClick={handleAttach}
              >
                <Paperclip size={22} />
              </button>
              <input
                className={styles.input}
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className={styles.iconBtn}
                type="button"
                onClick={handleSmile}
              >
                <Smile size={22} />
              </button>
              <button
                className={styles.sendBtn}
                type="submit"
                disabled={!input.trim()}
              >
                <Send size={22} />
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <MessageSquare className={styles.emptyIcon} />
            <div className={styles.emptyText}>
              Выберите чат для начала общения
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
