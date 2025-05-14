"use client";

// import { apiService } from "../../utilities/api";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiService } from "../../utilities/api";
import { TeacherProfile, Category } from "../../types/types";
import styles from "./page.module.scss";
import TeacherItem from "@/features/teacher-item/TeacherItem";
import TeacherVideo from "@/components/teacher-video/TeacherVideo";
import { ListFilter, Search } from "lucide-react";
import Loader from "@/components/loader/Loader";

// Простая реализация debounce с улучшенной типизацией
function debounce<A extends unknown[], R>(
  func: (...args: A) => R,
  waitFor: number
): (...args: A) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: A): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export default function TeachersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [displayedTeachers, setDisplayedTeachers] = useState<TeacherProfile[]>(
    []
  );
  const [fetchedTeachers, setFetchedTeachers] = useState<TeacherProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredTeacher, setHoveredTeacher] = useState<TeacherProfile | null>(
    null
  );

  const selectedCategory = searchParams.get("category") || "";
  const currentSearchTerm = searchParams.get("q") || "";

  const [localSearchTerm, setLocalSearchTerm] = useState(currentSearchTerm);

  useEffect(() => {
    setLocalSearchTerm(currentSearchTerm);
  }, [currentSearchTerm]);

  const updateURLParams = useCallback(
    (newCategory: string, newSearchTerm: string) => {
      const params = new URLSearchParams();
      if (newCategory) params.set("category", newCategory);
      if (newSearchTerm) params.set("q", newSearchTerm);
      // Используем replace вместо push, чтобы не засорять историю при каждом изменении фильтра/поиска
      router.replace(`/teachers?${params.toString()}`);
    },
    [router]
  );

  // Используем нашу самописную debounce функцию
  const debouncedUpdateSearchURL = useMemo(() => {
    const fn = (newSearchTerm: string) => {
      updateURLParams(selectedCategory, newSearchTerm);
    };
    return debounce(fn, 500);
  }, [selectedCategory, updateURLParams]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await apiService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Ошибка при получении категорий:", err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function loadInitialTeachers() {
      try {
        setLoading(true);
        const teachersData = await apiService.getTeachers({
          category: selectedCategory,
        });
        setFetchedTeachers(teachersData);
      } catch (err) {
        console.error("Ошибка при получении учителей:", err);
        setFetchedTeachers([]);
      } finally {
        setLoading(false);
      }
    }
    loadInitialTeachers();
  }, [selectedCategory]);

  useEffect(() => {
    if (!currentSearchTerm) {
      setDisplayedTeachers(fetchedTeachers);
      return;
    }

    const searchTermLower = currentSearchTerm.toLowerCase();
    const filtered = fetchedTeachers.filter((teacher) => {
      const nameMatch = teacher.name.toLowerCase().includes(searchTermLower);
      const surnameMatch = teacher.surname
        .toLowerCase()
        .includes(searchTermLower);
      const skillsMatch = teacher.skills?.some(
        (skill) =>
          skill.category_name.toLowerCase().includes(searchTermLower) ||
          (skill.about && skill.about.toLowerCase().includes(searchTermLower))
      );
      return nameMatch || surnameMatch || skillsMatch;
    });
    setDisplayedTeachers(filtered);
  }, [currentSearchTerm, fetchedTeachers]);

  const handleTeacherHover = (teacher: TeacherProfile) => {
    setHoveredTeacher(teacher);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    updateURLParams(categoryId, currentSearchTerm);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setLocalSearchTerm(newSearchTerm);
    debouncedUpdateSearchURL(newSearchTerm);
  };

  const handleResetFilters = () => {
    setLocalSearchTerm("");
    updateURLParams("", "");
  };

  if (
    loading &&
    displayedTeachers.length === 0 &&
    fetchedTeachers.length === 0
  ) {
    return <Loader />;
  }

  return (
    <div className={styles.content}>
      <section className={`card ${styles.filterSection}`}>
        <div className={styles.searchAndFilterContainer}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск по имени, фамилии, навыкам..."
              value={localSearchTerm}
              onChange={handleSearchInputChange}
            />
            <button
              type="submit"
              className={styles.searchButton}
              aria-label="Search"
              onClick={() => updateURLParams(selectedCategory, localSearchTerm)}
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
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {(selectedCategory || currentSearchTerm) && (
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleResetFilters}
              >
                Сбросить все
              </button>
            )}
          </div>
        </div>
      </section>
      <section className={styles.resultsSection}>
        <div className={`${styles.teachersList}`}>
          {loading && displayedTeachers.length === 0 ? (
            <p>Загрузка учителей...</p>
          ) : displayedTeachers.length > 0 ? (
            displayedTeachers.map((teacher) => (
              <div
                key={teacher.teacher_id}
                onMouseEnter={() => handleTeacherHover(teacher)}
              >
                <TeacherItem teacher={teacher} category={selectedCategory} />
              </div>
            ))
          ) : (
            <p className={styles.noResults}>
              Учителя по выбранным критериям не найдены. Попробуйте изменить
              фильтры или поисковый запрос.
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
