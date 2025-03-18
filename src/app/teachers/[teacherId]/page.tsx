"use client";

import Loader from "@/components/loader/Loader";
import { useAvatar } from "@/hooks/avatar-hook";
import {
  apiService,
  TeacherSkill,
  TeacherProfile,
  Review,
} from "@/utilities/api";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Avatar from "@/components/avatar/Avatar";
import styles from "./page.module.scss";
import SkillBadge from "@/components/skill-badge/SkillBadge";
import ReviewItem from "@/components/review-item/ReviewItem";

export default function TeacherProfilePage() {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState<TeacherProfile>();
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<TeacherSkill | null>(null);
  const skillBadgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skillDescriptionRef = useRef<HTMLDivElement | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const validTeacherId = Array.isArray(teacherId)
          ? teacherId[0]
          : teacherId;
        if (!validTeacherId) {
          console.error("teacherId не определён");
          setLoading(false);
          return;
        }
        const teachersData = await apiService.getTeacherById(validTeacherId);
        setTeacher(teachersData);
      } catch (err) {
        console.error("Ошибка при получении учителей:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, [teacherId]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const validTeacherId = Array.isArray(teacherId)
          ? teacherId[0]
          : teacherId;
        if (!validTeacherId) {
          console.error("teacherId не определён");
          return;
        }
        const reviewsData = await apiService.getTeacherReviews(validTeacherId);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Ошибка при получении отзывов:", err);
      }
    }
    fetchReviews();
  }, [teacherId]);

  const { avatarSource, loadingAvatar } = useAvatar(teacher?.avatar || null);

  useEffect(() => {
    if (selectedSkill && skillDescriptionRef.current) {
      const description = skillDescriptionRef.current;
      const index = teacher?.skills.findIndex(
        (skill) => skill.category_name === selectedSkill.category_name
      );
      if (index !== undefined && index >= 0) {
        const badge = skillBadgeRefs.current[index];
        if (badge) {
          const badgeRect = badge.getBoundingClientRect();
          const descriptionRect = description.getBoundingClientRect();
          const offset =
            badgeRect.left - descriptionRect.left + badgeRect.width / 2;
          description.style.setProperty("--arrow-position", `${offset}px`);
        }
      }
    }
  }, [selectedSkill, teacher]);

  useEffect(() => {
    if (teacher && teacher.skills.length > 0) {
      setSelectedSkill(teacher.skills[0]);
    }
  }, [teacher]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading || loadingAvatar) return <Loader />;
  if (!teacher) return <h1>error</h1>;

  return (
    <div className={styles.container}>
      <div className={`${styles.left}`}>
        <section className={`${styles.section} card`}>
          <div className={styles.avatar}>
            <Avatar size={100} src={avatarSource} />
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
                  onClick={() => setSelectedSkill(skill)}
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
                  <ReviewItem key={`${review.id}-${index}`} review={review} />
                )
              )}
            </div>
          ) : (
            <p className={styles.noReviews}>Пока нет отзывов</p>
          )}
        </section>
        {reviews.length > 6 && (
          <button onClick={toggleExpand} className={styles.expandButton}>
            {isExpanded ? "Скрыть отзывы" : "Показать все отзывы"}
          </button>
        )}
      </div>

      <div className={styles.video}>
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
    </div>
  );
}
