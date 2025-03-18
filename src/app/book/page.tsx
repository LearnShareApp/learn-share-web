"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  apiService,
  DateTime,
  TeacherProfile,
  TeacherSkill,
} from "@/utilities/api";
import styles from "./page.module.scss";
import Link from "next/link";
import { useAvatar } from "@/hooks/avatar-hook";
import Avatar from "@/components/avatar/Avatar";
import Loader from "@/components/loader/Loader";

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teacherId = searchParams.get("teacherId");

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [timeSlots, setTimeSlots] = useState<DateTime[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);

  const { avatarSource, loadingAvatar } = useAvatar(teacher?.avatar || null);

  // Load teacher data
  useEffect(() => {
    async function fetchTeacher() {
      if (!teacherId) return;

      try {
        const teacherData = await apiService.getTeacherById(teacherId);
        setTeacher(teacherData);
      } catch (err) {
        console.error("Error fetching teacher data:", err);
        setError("Failed to load teacher data");
      }
    }

    fetchTeacher();
  }, [teacherId]);

  // Load teacher's available time slots
  useEffect(() => {
    async function fetchTimeSlots() {
      if (!teacherId) return;

      try {
        const timeSlotsData = await apiService.getTimeById(teacherId);
        setTimeSlots(timeSlotsData);
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError("Failed to load teacher's schedule");
      } finally {
        setLoading(false);
      }
    }

    fetchTimeSlots();
  }, [teacherId]);

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

  if (loading || loadingAvatar) return <Loader />;

  if (!teacherId) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorCard}>
          <h2>Error</h2>
          <p>Teacher ID is not specified. Please select a teacher.</p>
          <Link href="/teachers" className={styles.button}>
            Go to Teachers
          </Link>
        </div>
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
