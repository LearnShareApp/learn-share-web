import React from "react";
import styles from "./TeacherStats.module.scss";
import { StatCard } from "@/components";
import { Clock, Users, Star } from "lucide-react";

interface TeacherStatsProps {
  finishedLessons: number | string;
  studentsCount: number | string;
  rating: number | string;
  className?: string;
}

const TeacherStats: React.FC<TeacherStatsProps> = ({
  finishedLessons,
  studentsCount,
  rating,
  className = "",
}) => {
  return (
    <div className={[styles.stats, className].filter(Boolean).join(" ")}>
      <StatCard
        number={finishedLessons}
        label="Проведено уроков"
        icon={<Clock />}
      />
      <StatCard number={studentsCount} label="Студентов" icon={<Users />} />
      <StatCard number={rating} label="Рейтинг" icon={<Star />} />
    </div>
  );
};

export default TeacherStats;
