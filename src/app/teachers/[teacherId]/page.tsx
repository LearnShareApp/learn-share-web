"use client";

import Loader from "@/components/loader/Loader";
import { apiService } from "@/utilities/api";
import { TeacherSkill, Review, ComplaintData } from "../../../types/types";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Avatar from "@/components/avatar/Avatar";
import styles from "./page.module.scss";
import SkillBadge from "@/features/skill-badge/SkillBadge";
import ReviewItem from "@/features/review-item/ReviewItem";
import { useTeacher } from "@/hooks/useTeacher";
import { DollarSign, Clock, MapPin, Globe, Languages } from "lucide-react";

export default function TeacherProfilePage() {
  const { teacherId } = useParams();
  const validTeacherId = Array.isArray(teacherId) ? teacherId[0] : teacherId;

  // Используем хук useTeacher вместо прямого вызова API
  const { teacher, loadingTeacher, errorTeacher } = useTeacher({
    teacherId: validTeacherId,
  });

  const [loading, setLoading] = useState(false);
  const [arrowPositioned, setArrowPositioned] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<TeacherSkill | null>(null);
  const skillBadgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skillDescriptionRef = useRef<HTMLDivElement | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Эффект для установки начального навыка
  useEffect(() => {
    if (teacher && teacher.skills.length > 0) {
      setSelectedSkill(teacher.skills[0]);
    }
  }, [teacher]);

  // Эффект для позиционирования стрелки
  useEffect(() => {
    if (!selectedSkill || !skillDescriptionRef.current) return;
    setArrowPositioned(true);
  }, [selectedSkill]);

  // Загружаем отзывы, когда данные преподавателя загружены
  useEffect(() => {
    async function fetchReviews() {
      if (!validTeacherId || !teacher) return;

      setLoading(true);
      try {
        const reviewsData = await apiService.getTeacherReviews(validTeacherId);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Ошибка при получении отзывов:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [validTeacherId, teacher]);

  // Эффект для расчета позиции стрелки
  useEffect(() => {
    // Функция для расчета и установки позиции стрелки
    const updateArrowPosition = () => {
      if (!selectedSkill || !skillDescriptionRef.current) return false;

      const description = skillDescriptionRef.current;

      const index = teacher?.skills.findIndex(
        (skill) => skill.category_name === selectedSkill.category_name
      );

      if (index === undefined || index < 0) return false;

      const badge = skillBadgeRefs.current[index];
      if (!badge) return false;

      // Проверяем, что элементы полностью отрендерены и имеют размеры
      const badgeRect = badge.getBoundingClientRect();
      const descriptionRect = description.getBoundingClientRect();

      if (badgeRect.width === 0 || descriptionRect.width === 0) return false;

      // Вычисляем положение стрелки
      const offset =
        badgeRect.left - descriptionRect.left + badgeRect.width / 2;

      // Устанавливаем положение стрелки
      description.style.setProperty("--arrow-position", `${offset}px`);
      // Отмечаем, что стрелка успешно позиционирована
      setArrowPositioned(true);
      return true;
    };

    // Если стрелка не была успешно позиционирована, пробуем еще несколько раз
    const tryPositioningMultipleTimes = () => {
      let attempts = 0;
      const maxAttempts = 10;
      const interval = 150; // Интервал между попытками (мс)

      // Функция для повторных попыток
      const attemptPositioning = () => {
        if (updateArrowPosition()) return; // Успех, выходим

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(attemptPositioning, interval);
        } else {
          // Если после всех попыток не удалось позиционировать, все равно скрываем лоадер
          setArrowPositioned(true);
        }
      };

      // Начинаем попытки
      attemptPositioning();
    };

    // Сбрасываем флаг позиционирования только при первой загрузке,
    // но не при переключении между навыками
    if (!arrowPositioned && (!selectedSkill || !teacher)) {
      setArrowPositioned(false);
    }

    // Всегда обновляем позицию стрелки при изменении навыка
    tryPositioningMultipleTimes();

    // Также обновляем позицию при изменении размера окна
    const handleResize = () => {
      updateArrowPosition();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedSkill, teacher, arrowPositioned]);

  // Специальный эффект для обработки загрузки страницы
  useEffect(() => {
    // Если флаг уже установлен или нет навыка, не продолжаем
    if (arrowPositioned || !selectedSkill) return;

    const handleLoad = () => {
      // Делаем отложенное обновление после полной загрузки страницы
      setTimeout(() => {
        const description = skillDescriptionRef.current;
        if (!description) return;

        const index = teacher?.skills.findIndex(
          (skill) => skill.category_name === selectedSkill.category_name
        );

        if (index === undefined || index < 0) return;

        const badge = skillBadgeRefs.current[index];
        if (!badge) return;

        const badgeRect = badge.getBoundingClientRect();
        const descriptionRect = description.getBoundingClientRect();
        const offset =
          badgeRect.left - descriptionRect.left + badgeRect.width / 2;
        description.style.setProperty("--arrow-position", `${offset}px`);
        setArrowPositioned(true);
      }, 300);
    };

    // Если страница уже загружена, выполняем сразу
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      // Иначе ждем загрузки страницы
      window.addEventListener("load", handleLoad);
      return () => {
        window.removeEventListener("load", handleLoad);
      };
    }
  }, [selectedSkill, teacher, arrowPositioned]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Обработчик для отправки жалобы
  const handleReport = async () => {
    const reason = prompt("Укажите причину жалобы:");
    if (!reason) {
      alert("Причина жалобы не указана.");
      return;
    }
    const description = prompt("Опишите подробнее (необязательно):") || "";

    if (teacher?.teacher_id && validTeacherId) {
      const complaintData: ComplaintData = {
        reported_id: teacher.teacher_id,
        reason: reason,
        description: description,
      };
      try {
        setLoading(true); // Показываем лоадер на время отправки
        await apiService.sendComplaint(complaintData);
        alert("Жалоба успешно отправлена.");
      } catch (error) {
        console.error("Ошибка при отправке жалобы:", error);
        alert("Не удалось отправить жалобу. Попробуйте позже.");
      } finally {
        setLoading(false); // Скрываем лоадер
      }
    } else {
      alert("Не удалось определить ID преподавателя для жалобы.");
    }
  };

  // Обновляем условие отображения лоадера, включая проверку loading
  if (loadingTeacher || loading) return <Loader />;

  // Обработка ошибок
  if (errorTeacher || !teacher) {
    return (
      <div className={styles.errorContainer}>
        <h1>Ошибка при загрузке профиля преподавателя</h1>
        <p>{errorTeacher || "Преподаватель не найден"}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.left}`}>
        <section className={`${styles.section} card`}>
          <div className={styles.avatar}>
            <Avatar size={100} avatarId={teacher.avatar} />
            <div className={styles.nameDate}>
              <h2>
                {teacher?.name} {teacher?.surname}
              </h2>
              <p>
                {teacher?.registration_date
                  ? `${Math.floor(
                      (new Date().getTime() -
                        new Date(teacher.registration_date).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )} days in the skill exchange world`
                  : "Registration date unknown"}
              </p>
            </div>
            <button onClick={handleReport} className={styles.reportButton}>
              Пожаловаться
            </button>
          </div>
          <div className={styles.profileDescription}>
            <h3>About me</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
              suscipit numquam esse ipsum voluptas laborum corrupti aperiam
              magnam, ipsa voluptates? Saepe quod earum accusantium illum
              perferendis ut quidem dolorem sint. Assumenda, magnam architecto?
              Accusamus officiis deleniti dicta magnam omnis reiciendis
              doloremque facilis libero, eos rem ipsa vel doloribus magni eum
              incidunt. Dolores odio aliquam quam impedit ratione veritatis
              minus consequatur fuga ea corporis sequi velit ullam nihil hic
              quas quo animi numquam, amet deserunt culpa esse voluptates
              necessitatibus inventore. Nam, molestiae. Perferendis autem
              ratione, enim aperiam nemo rerum iusto suscipit omnis laborum?
              Voluptatem assumenda cum quia tempora nemo voluptatum magnam.
            </p>
          </div>
          <h3>My skills</h3>
          <div className={styles.skills}>
            <div className={styles.skillsList}>
              {teacher?.skills.map((skill, index) => (
                <SkillBadge
                  category_name={skill.category_name}
                  key={index}
                  onClick={() => {
                    // Устанавливаем новый выбранный навык без сброса флага позиционирования
                    setSelectedSkill(skill);

                    // Функция для обновления позиции стрелки
                    const updatePosition = () => {
                      const description = skillDescriptionRef.current;
                      const badge = skillBadgeRefs.current[index];
                      if (!description || !badge) return false;

                      // Проверяем, что элементы имеют размеры
                      const badgeRect = badge.getBoundingClientRect();
                      const descriptionRect =
                        description.getBoundingClientRect();
                      if (badgeRect.width === 0 || descriptionRect.width === 0)
                        return false;

                      const offset =
                        badgeRect.left -
                        descriptionRect.left +
                        badgeRect.width / 2;
                      description.style.setProperty(
                        "--arrow-position",
                        `${offset}px`
                      );
                      return true;
                    };

                    // Пробуем несколько раз с увеличивающимися интервалами
                    let attempts = 0;
                    const tryUpdate = () => {
                      if (updatePosition()) return;

                      attempts++;
                      if (attempts < 5) {
                        setTimeout(tryUpdate, 50 * attempts); // Увеличиваем интервал с каждой попыткой
                      }
                    };

                    // Начинаем попытки сразу после изменения состояния
                    setTimeout(tryUpdate, 10);
                  }}
                  isActive={
                    selectedSkill?.category_name === skill.category_name
                  }
                  ref={(el) => {
                    skillBadgeRefs.current[index] = el as HTMLDivElement;
                  }}
                />
              ))}
            </div>
            {selectedSkill && (
              <div
                className={styles.skillDescription}
                ref={skillDescriptionRef}
              >
                <p>{selectedSkill.about}</p>
              </div>
            )}
          </div>
        </section>

        <section className={`${styles.stats} card`}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {selectedSkill?.rate.toFixed(1)}
            </span>
            <span className={styles.statLabel}>Rate</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {teacher?.count_of_students}
            </span>
            <span className={styles.statLabel}>Students</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {teacher?.finished_lessons}
            </span>
            <span className={styles.statLabel}>Classes</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {teacher?.common_reviews_count}
            </span>
            <span className={styles.statLabel}>Reviews</span>
          </div>
        </section>

        {/* Секция для бейджей */}
        <section className={`${styles.section} ${styles.badges} card`}>
          <h3>Achievements</h3>
          <div className={styles.badgesGrid}>
            <div className={styles.badge}>
              <div className={styles.badgeIcon}>🏆</div>
              <span className={styles.badgeName}>Top Teacher</span>
            </div>
            <div className={styles.badge}>
              <div className={styles.badgeIcon}>⭐</div>
              <span className={styles.badgeName}>100+ Lessons</span>
            </div>
            <div className={styles.badge}>
              <div className={styles.badgeIcon}>🔥</div>
              <span className={styles.badgeName}>Fast Responder</span>
            </div>
            <div className={styles.badge}>
              <div className={styles.badgeIcon}>📚</div>
              <span className={styles.badgeName}>Experienced Methodist</span>
            </div>
          </div>
        </section>

        <h3>Reviews</h3>
        <section
          className={`${styles.reviews} card ${
            isExpanded ? styles.reviewsExpanded : ""
          }`}
        >
          {reviews.length > 0 ? (
            <div className={styles.reviewsGrid}>
              {(isExpanded ? reviews : reviews.slice(0, 6)).map(
                (review, index) => (
                  <ReviewItem key={`${review.review_id}-${index}`} review={review} />
                )
              )}
            </div>
          ) : (
            <p className={styles.noReviews}>No reviews yet</p>
          )}
        </section>
        {reviews.length > 6 && (
          <button onClick={toggleExpand} className={styles.expandButton}>
            {isExpanded ? "Hide reviews" : "Show all reviews"}
          </button>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.videoContainer}>
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
            }}
          >
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              src={
                `https://www.youtube-nocookie.com/embed/` +
                selectedSkill?.video_card_link
              }
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className={styles.buttons}>
            <button
              onClick={() =>
                (window.location.href = `/book?teacherId=${teacherId}`)
              }
            >
              Book lesson
            </button>
            <button>Contact teacher</button>
          </div>
        </div>

        {/* Секция Quick Info */}
        <section className={`${styles.section} ${styles.quickInfo} card`}>
          <h3>Quick Info</h3>
          <div className={styles.quickInfoList}>
            <div className={styles.quickInfoItem}>
              <DollarSign width={20} height={20} />
              <span className={styles.quickInfoText}>$45 per hour</span>
            </div>
            <div className={styles.quickInfoItem}>
              <Clock width={20} height={20} />
              <span className={styles.quickInfoText}>
                Available Weekdays, Evenings
              </span>
            </div>
            <div className={styles.quickInfoItem}>
              <MapPin width={20} height={20} />
              <span className={styles.quickInfoText}>New York, USA</span>
            </div>
            <div className={styles.quickInfoItem}>
              <Globe width={20} height={20} />
              <span className={styles.quickInfoText}>
                1-on-1, Group Classes
              </span>
            </div>
            <div className={styles.quickInfoItem}>
              <Languages width={20} height={20} />
              <span className={styles.quickInfoText}>English, Spanish</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
