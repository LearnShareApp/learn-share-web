"use client";

import styles from "./page.module.scss";

export default function TeachersPage() {
  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <section className={styles.searchSection}>
          <form className={styles.searchForm}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Поиск учителей..."
              />
              <button
                type="submit"
                className={styles.searchButton}
                aria-label="Найти"
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
              <select className={styles.filter}>
                <option value="">Все категории</option>
                <option value="matematika">Математика</option>
                <option value="fizika">Физика</option>
                <option value="himiya">Химия</option>
                {/* Можно добавить другие категории */}
              </select>
              <select className={styles.filter}>
                <option value="">Сортировка по цене</option>
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
              </select>
              <select className={styles.filter}>
                <option value="">Сортировка по языку</option>
                <option value="ru">Русский</option>
                <option value="en">Английский</option>
                <option value="es">Испанский</option>
              </select>
              <select className={styles.filter}>
                <option value="">Сортировка по месту</option>
                <option value="local">Местные</option>
                <option value="foreign">Иностранные</option>
              </select>
              <select className={styles.filter}>
                <option value="">Все учителя</option>
                <option value="professional">Профессиональные</option>
                <option value="non-professional">Непрофессиональные</option>
              </select>
              <label className={styles.favoriteLabel}>
                <input type="checkbox" className={styles.filter} />
                Любимые учителя
              </label>
              <button type="reset" className={styles.resetButton}>
                Сброс фильтров
              </button>
            </div>
          </form>
        </section>
        <section className={styles.resultsSection}>
          {/* Здесь будут отображаться результаты поиска учителей */}
        </section>
      </main>
    </div>
  );
}
