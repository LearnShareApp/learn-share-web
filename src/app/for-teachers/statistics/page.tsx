"use client";

import React, { useState, useEffect } from "react";
import { useTeacher } from "../../../hooks/useTeacher";
import styles from "./page.module.scss";
import Link from "next/link";
import Loader from "@/components/loader/Loader";

interface StatisticsData {
  totalLessons: number;
  totalStudents: number;
  averageRating: number;
  totalReviews: number;
  lessonsPerMonth: { month: string; count: number }[];
  lessonsPerSkill: { skill: string; count: number }[];
  recentReviews: {
    student_name: string;
    student_surname: string;
    category_name: string;
    rate: number;
    comment: string;
    date: string;
  }[];
}

export default function StatisticsPage() {
  const { teacher, loadingTeacher } = useTeacher();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);

  useEffect(() => {
    if (!teacher) return;

    // In a real API, we would request statistics data through a separate endpoint
    // Here we create demo data based on the teacher's profile data

    const mockStatistics: StatisticsData = {
      totalLessons: teacher.finished_lessons,
      totalStudents: teacher.count_of_students,
      averageRating: teacher.common_rate,
      totalReviews: teacher.common_reviews_count,
      lessonsPerMonth: [
        { month: "January", count: 12 },
        { month: "February", count: 15 },
        { month: "March", count: 10 },
        { month: "April", count: 18 },
        { month: "May", count: 22 },
        { month: "June", count: 8 },
      ],
      lessonsPerSkill: teacher.skills.map((skill) => ({
        skill: skill.category_name,
        count: Math.floor(Math.random() * 20) + 5, // Random number from 5 to 25
      })),
      recentReviews: [
        {
          student_name: "Alex",
          student_surname: "Johnson",
          category_name: "Programming",
          rate: 4.8,
          comment:
            "Very clear explanations, well-structured lessons. Highly recommended!",
          date: "2023-05-15",
        },
        {
          student_name: "Olivia",
          student_surname: "Smith",
          category_name: "English",
          rate: 5.0,
          comment:
            "Excellent teacher! Results are noticeable after just a few lessons.",
          date: "2023-04-28",
        },
        {
          student_name: "Michael",
          student_surname: "Brown",
          category_name: "Mathematics",
          rate: 4.5,
          comment:
            "Good explanations, lots of practice. Helped me understand difficult topics.",
          date: "2023-04-10",
        },
      ],
    };

    // Simulating data loading
    setTimeout(() => {
      setStatistics(mockStatistics);
      setLoading(false);
    }, 1000);
  }, [teacher]);

  if (loadingTeacher || loading) return <Loader />;

  if (!teacher || !statistics) {
    return (
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Statistics Not Available</h1>
        <p>You need to become a teacher to access statistics.</p>
        <Link href="/for-teachers" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Statistics</h1>
        <Link href="/for-teachers" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className={styles.statsOverview}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{statistics.totalLessons}</div>
          <div className={styles.statLabel}>Lessons Completed</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{statistics.totalStudents}</div>
          <div className={styles.statLabel}>Students</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {statistics.averageRating.toFixed(1)}
          </div>
          <div className={styles.statLabel}>Average Rating</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{statistics.totalReviews}</div>
          <div className={styles.statLabel}>Reviews</div>
        </div>
      </div>

      <div className={styles.statsSection}>
        <h2>Lessons by Month</h2>
        <div className={styles.chartContainer}>
          {statistics.lessonsPerMonth.map((item) => (
            <div className={styles.chartItem} key={item.month}>
              <div
                className={styles.chartBar}
                style={{ height: `${(item.count / 25) * 200}px` }}
              >
                <div className={styles.chartValue}>{item.count}</div>
              </div>
              <div className={styles.chartLabel}>{item.month}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.twoColumns}>
        <div className={styles.statsSection}>
          <h2>Lessons by Skill</h2>
          <div className={styles.skillsList}>
            {statistics.lessonsPerSkill.map((item) => (
              <div className={styles.skillItem} key={item.skill}>
                <div className={styles.skillName}>{item.skill}</div>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillBarFill}
                    style={{ width: `${(item.count / 25) * 100}%` }}
                  ></div>
                </div>
                <div className={styles.skillCount}>{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.statsSection}>
          <h2>Recent Reviews</h2>
          <div className={styles.reviewsList}>
            {statistics.recentReviews.map((review, index) => (
              <div className={styles.reviewItem} key={index}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerName}>
                    {review.student_name} {review.student_surname}
                  </div>
                  <div className={styles.reviewRating}>
                    {review.rate.toFixed(1)}{" "}
                    <span className={styles.star}>★</span>
                  </div>
                </div>
                <div className={styles.reviewCategory}>
                  {review.category_name}
                </div>
                <div className={styles.reviewComment}>{review.comment}</div>
                <div className={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
