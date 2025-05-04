"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroHeadline}>
            <h1>
              <span className={styles.highlight}>Learn&Share</span>
              <span>P2P обучение по-новому</span>
            </h1>

            <p>
              Децентрализованная платформа для обмена знаниями, где каждый может
              учить и учиться напрямую от других людей — через индивидуальные
              занятия, групповые классы и масштабные события.
            </p>

            <div className={styles.heroButtons}>
              <Link href="/auth?role=student" className={styles.primaryButton}>
                <span>Хочу учиться</span>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z"
                  />
                </svg>
              </Link>
              <Link
                href="/auth?role=teacher"
                className={styles.secondaryButton}
              >
                <span>Хочу преподавать</span>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <Image
              src="/images/hero-image.jpg"
              alt="Learn&Share Platform"
              className={styles.heroImage}
              width={500}
              height={400}
              priority
            />
          </div>
        </div>

        <div className={styles.keyFeatures}>
          <div className={styles.keyFeatureContent}>
            <div className={styles.keyFeature}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                />
              </svg>
              <span>Свыше 100 навыков</span>
            </div>

            <div className={styles.keyFeature}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                />
              </svg>
              <span>Гибкое расписание</span>
            </div>

            <div className={styles.keyFeature}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                />
              </svg>
              <span>Безопасное обучение</span>
            </div>

            <div className={styles.keyFeature}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
                />
              </svg>
              <span>Развитие сообщества</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.howItWorks}>
          <h2>Как это работает</h2>

          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Регистрация</h3>
                <p>
                  Создайте аккаунт, заполните профиль и укажите свои интересы и
                  навыки
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Выберите роль</h3>
                <p>
                  Решите, кем вы хотите быть сегодня: учеником или
                  преподавателем
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Начните обучение</h3>
                <p>
                  Найдите идеального учителя или учеников для обмена знаниями
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.benefits}>
          <h2>Ключевые особенности</h2>

          <div className={styles.benefitCards}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path
                    fill="currentColor"
                    d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </div>
              <h3>Индивидуальные занятия</h3>
              <p>
                Забронируйте персональные сессии с наставниками и экспертами в
                различных областях
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path
                    fill="currentColor"
                    d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"
                  />
                </svg>
              </div>
              <h3>Групповые классы</h3>
              <p>
                Организуйте или присоединяйтесь к доступным и совместным учебным
                занятиям
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path
                    fill="currentColor"
                    d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-2 0H3V6h14v8zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm13 0v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"
                  />
                </svg>
              </div>
              <h3>События и вебинары</h3>
              <p>
                Участвуйте в публичных лекциях, вебинарах и мастер-классах от
                сообщества
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7c.39-.39.39-1.02 0-1.41-.39-.39-1.03-.39-1.42 0z"
                  />
                </svg>
              </div>
              <h3>Отзывы и рейтинги</h3>
              <p>
                Создавайте доверие и прозрачность через проверенные отзывы
                пользователей
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path
                    fill="currentColor"
                    d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
                  />
                </svg>
              </div>
              <h3>Система чата</h3>
              <p>
                Удобное общение с учителями и учениками до и после занятий для
                максимальной эффективности
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path
                    fill="currentColor"
                    d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                  />
                </svg>
              </div>
              <h3>Гибкая оплата</h3>
              <p>
                Удобная система платежей и кошелек для простого управления
                заработком и расходами
              </p>
            </div>
          </div>
        </section>

        <section className={styles.popularCategories}>
          <h2>Popular Categories</h2>

          <div className={styles.categoriesGrid}>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M14 18l-2 2V4l2 2v12zM4 6h8v2H4V6zm0 4h8v2H4v-2zm0 4h8v2H4v-2zM18 6h2v12h-2V6z"
                  />
                </svg>
              </div>
              <h3>Digital Skills</h3>
              <p>200+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"
                  />
                </svg>
              </div>
              <h3>Creative Arts</h3>
              <p>150+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
                  />
                </svg>
              </div>
              <h3>Languages</h3>
              <p>100+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              </div>
              <h3>Life Skills</h3>
              <p>180+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
                  />
                </svg>
              </div>
              <h3>Tech & Coding</h3>
              <p>250+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                  />
                </svg>
              </div>
              <h3>Music & Performance</h3>
              <p>120+ Skills</p>
            </div>
          </div>
        </section>

        <section className={styles.statistics}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Различных навыков</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>10,000+</span>
            <span className={styles.statLabel}>Активных пользователей</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>5,000+</span>
            <span className={styles.statLabel}>Проведённых занятий</span>
          </div>
        </section>

        <section className={styles.testimonials}>
          <h2>Что говорят наши пользователи</h2>
          <div className={styles.testimonialCards}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>
                  &ldquo;Платформа полностью изменила мой подход к обучению.
                  Теперь я могу не только получать знания, но и делиться своим
                  опытом с другими. Прекрасная возможность для профессионального
                  роста!&rdquo;
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <Image
                  src="/images/person1.jpg"
                  alt="Александр К."
                  width={80}
                  height={80}
                  className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <p className={styles.authorName}>Александр К.</p>
                  <p className={styles.authorRole}>Преподаватель JavaScript</p>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>
                  &ldquo;Благодаря Learn&Share, я нашла идеального преподавателя
                  по дизайну. Удобный интерфейс, гибкое расписание и
                  индивидуальный подход сделали обучение максимально
                  эффективным.&rdquo;
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <Image
                  src="/images/person1.jpg"
                  alt="Мария С."
                  width={80}
                  height={80}
                  className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <p className={styles.authorName}>Мария С.</p>
                  <p className={styles.authorRole}>Студентка, Веб-дизайнер</p>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>
                  &ldquo;Как преподаватель английского языка, я ценю возможность
                  работать с мотивированными студентами. Платформа предоставляет
                  все необходимые инструменты для эффективного обучения.&rdquo;
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <Image
                  src="/images/person1.jpg"
                  alt="Елена М."
                  width={80}
                  height={80}
                  className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <p className={styles.authorName}>Елена М.</p>
                  <p className={styles.authorRole}>Преподаватель английского</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.callToAction}>
          <h2>Присоединяйтесь к сообществу сегодня</h2>
          <p>
            Демократизируем доступ к образованию, делая его гибким, доступным и
            основанным на сообществе
          </p>

          <div className={styles.ctaButtons}>
            <Link href="/auth?role=student" className={styles.primaryButton}>
              Начать учиться
            </Link>
            <Link href="/auth?role=teacher" className={styles.secondaryButton}>
              Начать преподавать
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
