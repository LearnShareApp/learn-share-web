import React from "react";
import { Search, ListFilter, X } from "lucide-react";
import styles from "./FilterBar.module.scss";
import Button from "../Button/Button";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  onReset?: () => void;
  showReset?: boolean;
  className?: string;
  searchPlaceholder?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  filterValue = "",
  onFilterChange,
  filterOptions = [],
  filterLabel = "Все категории",
  onReset,
  showReset = false,
  className = "",
  searchPlaceholder = "Поиск...",
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.();
  };

  return (
    <div className={`${styles.filterBar} ${className}`}>
      <form className={styles.searchContainer} onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button
          type="submit"
          className={styles.searchButton}
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </form>

      {filterOptions.length > 0 && onFilterChange && (
        <div className={styles.filtersContainer}>
          <div className={styles.filterWrapper}>
            <ListFilter className={styles.filterIcon} size={18} />
            <select
              className={styles.filter}
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              <option value="">{filterLabel}</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {showReset && onReset && (
        <Button
          variant="ghost"
          size="small"
          onClick={onReset}
          icon={<X size={16} />}
          iconPosition="left"
        >
          Сбросить
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
