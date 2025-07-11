"use client";

import React, { useState, useEffect, useRef } from "react";
import { apiService } from "../../../utilities/api";
import { AddSkillData, Category } from "../../../types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { Lightbulb, Video, CheckCircle, UserCheck } from "lucide-react";

// Компонент для встраивания видео
const VideoPreview = ({ url }: { url: string }) => {
  // Функция для извлечения ID видео из URL
  const getVideoId = (url: string): string | null => {
    // YouTube
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) return youtubeMatch[1];

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) return vimeoMatch[1];

    return null;
  };

  // Функция для определения типа видео и генерации соответствующего embed URL
  const getEmbedUrl = (url: string): string | null => {
    const videoId = getVideoId(url);
    if (!videoId) return null;

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("vimeo.com")) {
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return null;
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) return null;

  return (
    <div className={styles.videoPreview}>
      <iframe
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded video"
        className={styles.videoFrame}
      />
    </div>
  );
};

export default function AddSkillPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTeacher, setIsTeacher] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Refs для неконтролируемых инпутов
  const aboutRef = useRef<HTMLTextAreaElement>(null);
  const videoLinkRef = useRef<HTMLInputElement>(null);
  const categoryIdRef = useRef<HTMLSelectElement>(null);

  // Функция для проверки валидности URL видео
  const validateVideoUrl = (url: string): boolean => {
    // Если URL пустой, считаем невалидным
    if (!url) return false;

    // Проверка для YouTube
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

    // Проверка для Vimeo
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;

    return youtubeRegex.test(url) || vimeoRegex.test(url);
  };

  // Отдельная функция для обновления предпросмотра по кнопке
  const handlePreviewClick = () => {
    if (videoLinkRef.current && videoLinkRef.current.value) {
      const url = videoLinkRef.current.value;
      if (validateVideoUrl(url)) {
        setVideoPreview(url);
      } else {
        setVideoPreview(null);
        setError("Please enter a valid video link (YouTube or Vimeo)");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Загрузка категорий и проверка статуса учителя
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загрузка категорий
        const categoriesData = await apiService.getCategories();
        setCategories(categoriesData);

        // Проверка, является ли пользователь учителем
        const userProfile = await apiService.getUserProfile();
        setIsTeacher(userProfile.is_teacher);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load necessary data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Получаем значения из refs
    const about = aboutRef.current?.value || "";
    const videoLink = videoLinkRef.current?.value || "";
    const categoryIdStr = categoryIdRef.current?.value;
    const categoryId = categoryIdStr ? parseInt(categoryIdStr) : "";

    // Валидация формы
    if (!about || !videoLink || categoryId === "") {
      setError("Please fill in all fields");
      return;
    }

    // Дополнительная проверка валидности URL видео
    if (!validateVideoUrl(videoLink)) {
      setError("Please enter a valid video link (YouTube or Vimeo)");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const skillData: AddSkillData = {
        about,
        video_card_link: videoLink,
        category_id: categoryId as number,
      };

      await apiService.addSkill(skillData);

      // Если пользователь не был учителем, обновляем статус
      if (!isTeacher) {
        setIsTeacher(true);
      }

      setSuccess("Skill successfully added!");

      // Перенаправление на страницу for-teachers после успешного добавления
      setTimeout(() => {
        router.push("/for-teachers");
      }, 1500);

      // Очистка формы (на случай, если перенаправление не сработает)
      if (aboutRef.current) aboutRef.current.value = "";
      if (videoLinkRef.current) videoLinkRef.current.value = "";
      if (categoryIdRef.current) categoryIdRef.current.value = "";
      setVideoPreview(null);

      // Удаляем таймаут очистки сообщения, так как будет редирект
    } catch (err) {
      console.error("Error adding skill:", err);
      setError("Failed to add skill. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Компонент с инструкциями
  const InstructionsComponent = React.memo(() => (
    <div className={styles.card}>
      <div className={styles.instructions}>
        <h2>
          {isTeacher ? "How to Add a New Skill" : "How to Become a Teacher"}
        </h2>
        <p>
          {isTeacher
            ? "Add information about a new skill you can teach. After adding a skill, you'll be able to conduct lessons on this topic."
            : "To become a teacher, add your first skill. After that, you'll be able to post your available time slots for lessons and receive requests from students."}
        </p>
        <ul className={styles.steps}>
          <li>Select the category in which you want to teach</li>
          <li>Write about your experience and teaching approach</li>
          <li>
            Add a link to your introduction video so students can get to know
            you
          </li>
          <li>
            {isTeacher
              ? "Wait for students to book your time"
              : "Add available time for conducting lessons"}
          </li>
        </ul>
      </div>
    </div>
  ));

  // Добавляем displayName для мемоизированного компонента
  InstructionsComponent.displayName = "InstructionsComponent";

  // Компонент с советами
  const TipsComponent = React.memo(() => (
    <div className={styles.card}>
      <h2>Tips for Teachers</h2>
      <div className={styles.tips}>
        <div className={styles.tip}>
          <div className={styles.tipIcon}>
            <Lightbulb width={24} height={24} />
          </div>
          <h3>Be Clear and Concise</h3>
          <p>Make your skill description and video easy to understand.</p>
        </div>
        <div className={styles.tip}>
          <div className={styles.tipIcon}>
            <Video width={24} height={24} />
          </div>
          <h3>High-Quality Video</h3>
          <p>Ensure your video has good lighting and clear audio.</p>
        </div>
        <div className={styles.tip}>
          <div className={styles.tipIcon}>
            <CheckCircle width={24} height={24} />
          </div>
          <h3>Showcase Your Expertise</h3>
          <p>Demonstrate your knowledge and teaching style effectively.</p>
        </div>
        <div className={styles.tip}>
          <div className={styles.tipIcon}>
            <UserCheck width={24} height={24} />
          </div>
          <h3>Engage with Students</h3>
          <p>Be responsive and create a positive learning environment.</p>
        </div>
      </div>
    </div>
  ));

  // Добавляем displayName для мемоизированного компонента
  TipsComponent.displayName = "TipsComponent";

  // Компонент с формой
  const FormComponent = React.memo(() => (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Fill in Skill Information</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            className={styles.input}
            ref={categoryIdRef}
            defaultValue=""
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="about">About the skill and your experience</label>
          <textarea
            id="about"
            name="about"
            className={`${styles.input} ${styles.textarea}`}
            ref={aboutRef}
            placeholder="Tell us about your experience, teaching approach, and what students will gain from your lessons"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="videoLink">Introduction Video Link</label>
          <div className={styles.videoInputContainer}>
            <input
              type="url"
              id="videoLink"
              name="videoLink"
              className={styles.input}
              ref={videoLinkRef}
              placeholder="https://youtu.be/example"
              required
            />
            <button
              type="button"
              onClick={handlePreviewClick}
              className={styles.previewButton}
            >
              Preview
            </button>
          </div>

          <small className={styles.helperText}>
            Add a link to a video where you talk about yourself and your
            experience. This will help students get to know you better.
          </small>

          {/* Предпросмотр видео, если ссылка валидна */}
          {videoPreview && (
            <div className={styles.videoPreviewContainer}>
              <h4>Video Preview</h4>
              <VideoPreview url={videoPreview} />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading
            ? "Adding..."
            : isTeacher
            ? "Add Skill"
            : "Become a Teacher"}
        </button>
      </form>
    </div>
  ));

  // Добавляем displayName для мемоизированного компонента
  FormComponent.displayName = "FormComponent";

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isTeacher ? "Add New Skill" : "Become a Teacher"}
        </h1>
        <Link href="/for-teachers" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.mainContent}>
          <FormComponent />
        </div>
        <div className={styles.sideContent}>
          <InstructionsComponent />
          <TipsComponent />
        </div>
      </div>
    </div>
  );
}
