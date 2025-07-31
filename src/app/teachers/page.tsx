"use client";

// import { apiService } from "../../utilities/api";
import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiService } from "../../utilities/api";
import { TeacherProfile, Category } from "../../types/types";
import styles from "./page.module.scss";
import TeacherItem from "@/features/teacher-item/TeacherItem";
import {
  Card,
  FilterBar,
  Loader,
  TeacherVideo,
  EmptyState,
} from "@/components";
import { Users } from "lucide-react";

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

function TeachersPageContent() {
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

  // Debounced search function for FilterBar
  const debouncedUpdateSearchURL = useMemo(() => {
    const fn = (newSearchTerm: string) => {
      updateURLParams(selectedCategory, newSearchTerm);
    };
    return debounce(fn, 500);
  }, [selectedCategory, updateURLParams]);

  const handleSearchChange = (newSearchTerm: string) => {
    setLocalSearchTerm(newSearchTerm);
    debouncedUpdateSearchURL(newSearchTerm);
  };

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
      <Card className={styles.filterSection}>
        <FilterBar
          searchValue={localSearchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={() =>
            updateURLParams(selectedCategory, localSearchTerm)
          }
          filterValue={selectedCategory}
          onFilterChange={(value) => updateURLParams(value, currentSearchTerm)}
          filterOptions={categories.map((cat) => ({
            value: cat.name,
            label: cat.name,
          }))}
          filterLabel="Все категории"
          onReset={handleResetFilters}
          showReset={!!(selectedCategory || currentSearchTerm)}
          searchPlaceholder="Поиск по имени, фамилии, навыкам..."
        />
      </Card>
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
            <EmptyState
              icon={<Users size={48} />}
              title="Учителя не найдены"
              description="Учителя по выбранным критериям не найдены. Попробуйте изменить фильтры или поисковый запрос."
            />
          )}
        </div>
        <div className={styles.info}>
          <TeacherVideo teacher={hoveredTeacher} />
        </div>
      </section>
    </div>
  );
}

export default function TeachersPage() {
  return (
    <Suspense fallback={<Loader />}>
      <TeachersPageContent />
    </Suspense>
  );
}
