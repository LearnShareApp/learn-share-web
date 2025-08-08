import React from "react";
import styles from "./page.module.scss";
import { PageHeader, Card, SectionTitle } from "@/components";

export default function DownloadPage() {
  return (
    <div className={styles.container}>
      <PageHeader title="Загрузки" />
      <Card>
        <SectionTitle level={3}>
          Добро пожаловать на страницу загрузок
        </SectionTitle>
        <p>
          Скоро здесь появятся ссылки на мобильные приложения и полезные
          материалы.
        </p>
      </Card>
    </div>
  );
}
