"use client";

// import { apiService } from "../../utilities/api";
import { useEffect, useState } from "react";
import { apiService } from "../../utilities/api";
import { TeacherProfile, Category } from "../../types/types";
import styles from "./page.module.scss";
import TeacherItem from "@/components/teacher-item/TeacherItem";
import TeacherVideo from "@/components/teacher-video/TeacherVideo";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [allTeachers, setAllTeachers] = useState<TeacherProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [hoveredTeacher, setHoveredTeacher] = useState<TeacherProfile | null>(
    null
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Загружаем категории
        const categoriesData = await apiService.getCategories();
        setCategories(categoriesData);

        // Загружаем учителей
        const teachersData = await apiService.getTeachers();
        setAllTeachers(teachersData);
        setTeachers(teachersData);
      } catch (err) {
        console.error("Ошибка при получении данных:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Фильтрация учителей по выбранной категории
  useEffect(() => {
    if (!selectedCategory || selectedCategory === "") {
      setTeachers(allTeachers);
      return;
    }

    const categoryId = parseInt(selectedCategory);
    const filteredTeachers = allTeachers.filter(
      (teacher) =>
        teacher.skills &&
        teacher.skills.some((skill) => skill.category_id === categoryId)
    );

    setTeachers(filteredTeachers);
  }, [selectedCategory, allTeachers]);

  // Обработчик наведения мыши на карточку учителя
  const handleTeacherHover = (teacher: TeacherProfile) => {
    setHoveredTeacher(teacher);
  };

  // Обработчик изменения категории
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Сброс всех фильтров
  const handleResetFilters = () => {
    setSelectedCategory("");
    setTeachers(allTeachers);
  };

  return (
    <div className={styles.content}>
      <section className="card">
        <form className={styles.searchForm}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search for Teachers..."
            />
            <button
              type="submit"
              className={styles.searchButton}
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.navIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          <div className={styles.filtersContainer}>
            <div className={styles.filterWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.filterIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h.01M4 10h.01M4 14h.01M4 18h.01M8 6h.01M8 10h.01M8 14h.01M8 18h.01M12 6h.01M12 10h.01M12 14h.01M12 18h.01M16 6h.01M16 10h.01M16 14h.01M16 18h.01M20 6h.01M20 10h.01M20 14h.01M20 18h.01"
                />
              </svg>
              <select
                className={styles.filter}
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">Все категории</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.filterIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2 12h20"
                />
              </svg>
              <select className={styles.filter}>
                <option value="">Язык</option>
                <option value="ru">Русский</option>
                <option value="en">Английский</option>
                <option value="es">Испанский</option>
              </select>
            </div>
            <div className={styles.filterWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.filterIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 2c4.418 0 8 3.582 8 8 0 7-8 12-8 12S4 17 4 10c0-4.418 3.582-8 8-8z"
                />
              </svg>
              <select className={styles.filter}>
                <option value="">Откуда учителя</option>
                <option value="local">Местные</option>
                <option value="foreign">Иностранные</option>
              </select>
            </div>
            <div className={styles.filterWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.filterIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-5-3.74M9 20H4v-2a4 4 0 015-3.74M12 4a4 4 0 110 8 4 4 0 010-8z"
                />
              </svg>
              <select className={styles.filter}>
                <option value="">Все учителя</option>
                <option value="professional">Профессиональные</option>
                <option value="non-professional">Непрофессиональные</option>
              </select>
            </div>
            <button
              type="button"
              className={styles.resetButton}
              onClick={handleResetFilters}
            >
              Сбросить фильтры
            </button>
          </div>
        </form>
      </section>
      <section className={styles.resultsSection}>
        <div className={`${styles.teachersList}`}>
          {loading ? (
            <p>Загрузка...</p>
          ) : teachers.length > 0 ? (
            teachers.map((teacher) => (
              <div
                key={teacher.teacher_id}
                onMouseEnter={() => handleTeacherHover(teacher)}
              >
                <TeacherItem teacher={teacher} category={selectedCategory} />
              </div>
            ))
          ) : (
            <p className={styles.noResults}>
              Учителя по выбранным критериям не найдены
            </p>
          )}
        </div>
        <div className={styles.info}>
          <TeacherVideo teacher={hoveredTeacher} />
        </div>
      </section>
    </div>
  );
}
