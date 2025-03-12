"use client";

import styles from "./page.module.scss";

export default function ChatsPage() {
  return (
    <div className={`${styles.container} ${styles.chatPage}`}>
      <div className={styles.chatLayout}>
        <section className="card">
          <h2 className={styles.sidebarTitle}>Сообщения</h2>
          <div className={styles.chatsList}>
            {/* Здесь будет список чатов */}
          </div>
        </section>
        <section className="card">
          <div className={styles.chatHeader}>
            <h2>Выберите чат для начала общения</h2>
          </div>
          <div className={styles.messagesList}>
            {/* Здесь будут сообщения */}
          </div>
          <div className={styles.messageInput}>
            {/* Здесь будет форма отправки сообщений */}
          </div>
        </section>
      </div>
    </div>
  );
}
