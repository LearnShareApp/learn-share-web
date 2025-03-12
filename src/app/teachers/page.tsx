"use client";

import styles from "./page.module.scss";

export default function TeachersPage() {
  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <section className="card">
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
                <select className={styles.filter}>
                  <option value="">Все категории</option>
                  <option value="matematika">Математика</option>
                  <option value="fizika">Физика</option>
                  <option value="himiya">Химия</option>
                  {/* Можно добавить другие категории */}
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
                    d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2v2m0 16v2m9-11h-2M4 12H2m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 7.464"
                  />
                </svg>
                <select className={styles.filter}>
                  <option value="">Цена</option>
                  <option value="asc">По возрастанию</option>
                  <option value="desc">По убыванию</option>
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
                  <option value="">Учителя из</option>
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
