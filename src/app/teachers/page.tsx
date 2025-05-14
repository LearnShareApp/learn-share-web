"use client";

// import { apiService } from "../../utilities/api";
import { useEffect, useState } from "react";
import { apiService } from "../../utilities/api";
import { TeacherProfile, Category } from "../../types/types";
import styles from "./page.module.scss";
import TeacherItem from "@/features/teacher-item/TeacherItem";
import TeacherVideo from "@/components/teacher-video/TeacherVideo";
import { Search, ListFilter, Globe, MapPin, Users } from "lucide-react";
import Loader from "@/components/loader/Loader";

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

  if (loading) {
    return <Loader />;
  }

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
              <Search className={styles.navIcon} />
            </button>
          </div>
          <div className={styles.filtersContainer}>
            <div className={styles.filterWrapper}>
              <ListFilter className={styles.filterIcon} />
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
              <Globe className={styles.filterIcon} />
              <select className={styles.filter}>
                <option value="">Язык</option>
                <option value="ru">Русский</option>
                <option value="en">Английский</option>
                <option value="es">Испанский</option>
              </select>
            </div>
            <div className={styles.filterWrapper}>
              <MapPin className={styles.filterIcon} />
              <select className={styles.filter}>
                <option value="">Откуда учителя</option>
                <option value="local">Местные</option>
                <option value="foreign">Иностранные</option>
              </select>
            </div>
            <div className={styles.filterWrapper}>
              <Users className={styles.filterIcon} />
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
