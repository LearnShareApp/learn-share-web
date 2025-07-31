import React from "react";
import styles from "./ButtonGroup.module.scss";
import Button from "../Button/Button";

interface ButtonGroupOption {
  value: string;
  label: string;
}

interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`${styles.buttonGroup} ${className}`}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "primary" : "ghost"}
          onClick={() => onChange(option.value)}
          className={styles.groupButton}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default ButtonGroup;
