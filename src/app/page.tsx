"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Info,
  CalendarDays,
  Shield,
  Users,
  User,
  Presentation,
  CheckCircle2,
  MessageSquare,
  CreditCard,
  LayoutPanelLeft,
  Palette,
  Languages,
  Star,
  Code,
  Music,
} from "lucide-react";
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
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/auth?role=teacher"
                className={styles.secondaryButton}
              >
                <span>Хочу преподавать</span>
                <ArrowRight size={18} />
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
              <Info size={24} />
              <span>Свыше 100 навыков</span>
            </div>

            <div className={styles.keyFeature}>
              <CalendarDays size={24} />
              <span>Гибкое расписание</span>
            </div>

            <div className={styles.keyFeature}>
              <Shield size={24} />
              <span>Безопасное обучение</span>
            </div>

            <div className={styles.keyFeature}>
              <Users size={24} />
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
                <User size={32} />
              </div>
              <h3>Индивидуальные занятия</h3>
              <p>
                Забронируйте персональные сессии с наставниками и экспертами в
                различных областях
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Users size={32} />
              </div>
              <h3>Групповые классы</h3>
              <p>
                Организуйте или присоединяйтесь к доступным и совместным учебным
                занятиям
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Presentation size={32} />
              </div>
              <h3>События и вебинары</h3>
              <p>
                Участвуйте в публичных лекциях, вебинарах и мастер-классах от
                сообщества
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <CheckCircle2 size={32} />
              </div>
              <h3>Отзывы и рейтинги</h3>
              <p>
                Создавайте доверие и прозрачность через проверенные отзывы
                пользователей
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <MessageSquare size={32} />
              </div>
              <h3>Система чата</h3>
              <p>
                Удобное общение с учителями и учениками до и после занятий для
                максимальной эффективности
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <CreditCard size={32} />
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
                <LayoutPanelLeft size={24} />
              </div>
              <h3>Digital Skills</h3>
              <p>200+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <Palette size={24} />
              </div>
              <h3>Creative Arts</h3>
              <p>150+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <Languages size={24} />
              </div>
              <h3>Languages</h3>
              <p>100+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <Star size={24} />
              </div>
              <h3>Life Skills</h3>
              <p>180+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <Code size={24} />
              </div>
              <h3>Tech & Coding</h3>
              <p>250+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <Music size={24} />
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
