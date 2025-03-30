"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiService, DateTime, TeacherSkill } from "@/utilities/api";
import styles from "./page.module.scss";
import Link from "next/link";
import { useAvatar } from "@/hooks/avatar-hook";
import Avatar from "@/components/avatar/Avatar";
import Loader from "@/components/loader/Loader";
import { useTeacher } from "@/hooks/useTeacher";

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teacherId = searchParams.get("teacherId");

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [timeSlots, setTimeSlots] = useState<DateTime[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Используем хук useTeacher с ID вместо прямых вызовов API
  const { teacher, loadingTeacher, errorTeacher } = useTeacher(
    teacherId ? { teacherId } : undefined
  );

  const { avatarSource, loadingAvatar } = useAvatar(teacher?.avatar || null);

  // Загружаем доступные временные слоты для выбранного преподавателя
  useEffect(() => {
    async function fetchTimeSlots() {
      if (!teacherId || !teacher) return;

      try {
        setLoading(true);
        const times = await apiService.getTimeById(teacherId);
        setTimeSlots(times);
        setError(null);
      } catch (err) {
        console.error("Error fetching time slots:", err);
        setError("Failed to load available time slots");
      } finally {
        setLoading(false);
      }
    }

    fetchTimeSlots();
  }, [teacherId, teacher]);

  // Group time slots by date for calendar display
  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    const dateStr = new Date(slot.datetime).toISOString().split("T")[0];
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(slot);
    return acc;
  }, {} as Record<string, DateTime[]>);

  // Sort dates for calendar
  const sortedDates = Object.keys(groupedTimeSlots).sort();

  // Handle lesson booking
  const handleBookLesson = async () => {
    if (!teacherId || !selectedCategory || !selectedTimeSlot) {
      setError("Please select a skill and lesson time");
      return;
    }

    try {
      setBookingLoading(true);
      setError(null);

      await apiService.lessonRequest({
        teacher_id: parseInt(teacherId),
        category_id: selectedCategory,
        schedule_time_id: selectedTimeSlot,
      });

      setSuccess("Lesson successfully booked!");

      // Redirect to lessons page after 2 seconds
      setTimeout(() => {
        router.push("/lessons");
      }, 2000);
    } catch (err) {
      console.error("Error booking lesson:", err);
      setError("Failed to book the lesson. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Render time slots for a selected day
  const renderTimeSlots = (dateStr: string) => {
    return groupedTimeSlots[dateStr].map((slot) => {
      const time = new Date(slot.datetime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <button
          key={slot.schedule_time_id}
          className={`${styles.timeSlot} ${
            selectedTimeSlot === slot.schedule_time_id ? styles.selected : ""
          } ${!slot.is_available ? styles.unavailable : ""}`}
          onClick={() =>
            slot.is_available && setSelectedTimeSlot(slot.schedule_time_id)
          }
          disabled={!slot.is_available}
        >
          {time}
        </button>
      );
    });
  };

  // Transform teacher skills to category list for selection
  const teacherCategories =
    teacher?.skills?.map((skill: TeacherSkill) => ({
      id: skill.category_id,
      name: skill.category_name,
    })) || [];

  // Показываем загрузку, если данные преподавателя или временные слоты загружаются
  if (loadingTeacher || loadingAvatar || loading) return <Loader />;

  // Показываем ошибку, если не удалось загрузить данные преподавателя
  if (errorTeacher || !teacher) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{errorTeacher || "Teacher not found"}</p>
        <button onClick={() => router.back()} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Book a Lesson</h1>
        <Link href={`/teachers/${teacherId}`} className={styles.backLink}>
          ← Back to Teacher Profile
        </Link>
      </div>

      <div className={styles.bookingLayout}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            {teacher && (
              <div className={styles.teacherInfo}>
                <Avatar size={60} src={avatarSource} />
                <div>
                  <h2>
                    {teacher.name} {teacher.surname}
                  </h2>
                  <p>Book a lesson with this teacher</p>
                </div>
              </div>
            )}

            <h2>Select a Skill</h2>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

            <div className={styles.categoriesContainer}>
              {teacherCategories.length > 0 ? (
                teacherCategories.map(
                  (category: { id: number; name: string }) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`${styles.categoryButton} ${
                        selectedCategory === category.id ? styles.selected : ""
                      }`}
                    >
                      {category.name}
                    </button>
                  )
                )
              ) : (
                <p className={styles.noData}>
                  This teacher has no available skills
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <h2>Select Lesson Time</h2>

            {sortedDates.length > 0 ? (
              <div className={styles.calendar}>
                {sortedDates.map((dateStr) => {
                  const date = new Date(dateStr);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });

                  return (
                    <div key={dateStr} className={styles.dateContainer}>
                      <h3 className={styles.dateHeader}>{formattedDate}</h3>
                      <div className={styles.timeSlotsContainer}>
                        {renderTimeSlots(dateStr)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={styles.noData}>
                The teacher has no available time slots
              </p>
            )}

            <button
              className={styles.bookButton}
              onClick={handleBookLesson}
              disabled={
                !selectedCategory || !selectedTimeSlot || bookingLoading
              }
            >
              {bookingLoading ? "Booking..." : "Book Lesson"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
