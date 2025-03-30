import React, { useEffect, useRef, useState } from "react";
import { TeacherProfile } from "../../utilities/api";
import styles from "./TeacherVideo.module.scss";
import { useRouter } from "next/navigation";

interface TeacherVideoProps {
  teacher: TeacherProfile | null;
}

// Функция для извлечения ID видео из YouTube URL или прямого ID
const getYoutubeVideoId = (videoLink: string): string | null => {
  if (!videoLink) return null;

  // Проверяем, является ли строка напрямую ID видео (11 символов для YouTube ID)
  if (/^[a-zA-Z0-9_-]{11}$/.test(videoLink)) {
    return videoLink;
  }

  // Проверяем, является ли строка URL YouTube
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = videoLink.match(youtubeRegex);

  return youtubeMatch ? youtubeMatch[1] : null;
};

const TeacherVideo: React.FC<TeacherVideoProps> = ({ teacher }) => {
  const router = useRouter();
  const videoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);

  // Константа для высоты шапки (64px согласно variables.scss)
  const HEADER_HEIGHT = 64;

  // Инициализация ссылки на родительский контейнер
  useEffect(() => {
    if (videoRef.current) {
      containerRef.current = videoRef.current.parentElement;

      // Получаем высоты элементов
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight);
      }
      setVideoHeight(videoRef.current.offsetHeight);
    }
  }, [teacher]); // Пересчитываем при смене учителя, так как высота может измениться

  // Отслеживание скролла
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Обновление позиции видео
  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    // Получаем координаты контейнера и окна
    const containerRect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Отступ от верха окна с учетом шапки
    const windowTop = 20 + HEADER_HEIGHT;

    // Если контейнер виден на экране
    if (containerRect.top < windowHeight && containerRect.bottom > 0) {
      // Если верх контейнера выше верха экрана + отступ
      if (containerRect.top < windowTop) {
        // Рассчитываем максимальный сдвиг (не выходя за нижнюю границу контейнера)
        const maxShift = containerHeight - videoHeight;

        // Рассчитываем текущий сдвиг относительно верха контейнера
        const currentShift = Math.min(
          maxShift,
          Math.abs(containerRect.top) + windowTop
        );

        // Применяем трансформацию
        videoRef.current.style.transform = `translateY(${currentShift}px)`;
      } else {
        // Если контейнер целиком виден и его верх ниже верха окна + отступ,
        // то видео должно быть в начальной позиции
        videoRef.current.style.transform = "translateY(0)";
      }
    }
  }, [scrollY, containerHeight, videoHeight]);

  // Обработчик для кнопки "Профиль учителя"
  const handleSeeProfile = () => {
    if (teacher) {
      router.push(`/teachers/${teacher.teacher_id}`);
    }
  };

  // Обработчик для кнопки "Связаться с учителем"
  const handleContactTeacher = () => {
    // Можно было бы добавить здесь логику контакта, но пока просто перенаправим на профиль учителя
    if (teacher) {
      router.push(`/teachers/${teacher.teacher_id}`);
    }
  };

  if (
    !teacher ||
    !teacher.skills ||
    teacher.skills.length === 0 ||
    !teacher.skills[0].video_card_link
  ) {
    return (
      <div ref={videoRef} className={styles.placeholder}>
        <p>Наведите на карточку учителя для просмотра видео</p>
      </div>
    );
  }

  // Получаем ссылку на видео из первого навыка учителя
  const videoLink = teacher.skills[0].video_card_link;
  const videoId = getYoutubeVideoId(videoLink);

  if (!videoId) {
    return (
      <div ref={videoRef} className={styles.placeholder}>
        <p>Некорректная ссылка на видео</p>
      </div>
    );
  }

  return (
    <div ref={videoRef} className={styles.videoContainer}>
      <div className={styles.teacherInfo}>
        <h3>
          {teacher.name} {teacher.surname}
        </h3>
        <p>{teacher.skills[0].category_name}</p>
      </div>

      <div className={styles.videoWrapper}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className={styles.buttons}>
        <button className={styles.bookButton} onClick={handleSeeProfile}>
          Профиль учителя
        </button>
        <button className={styles.contactButton} onClick={handleContactTeacher}>
          Связаться с учителем
        </button>
      </div>
    </div>
  );
};

export default TeacherVideo;
