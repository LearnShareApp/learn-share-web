"use client";

import styles from "./page.module.scss";

export default function ChatsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.chatLayout}>
        <section className="card">
          <h2 className={styles.sidebarTitle}>Messages</h2>
          <div className={styles.chatsList}>{/* Chat list will be here */}</div>
        </section>
        <section className="card">
          <div className={styles.chatHeader}>
            <h2>Select a chat to start conversation</h2>
          </div>
          <div className={styles.messagesList}>
            {/* Messages will be here */}
          </div>
          <div className={styles.messageInput}>
            {/* Message input form will be here */}
          </div>
        </section>
      </div>
    </div>
  );
}
