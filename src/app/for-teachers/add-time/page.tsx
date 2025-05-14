"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiService } from "../../../utilities/api";
import styles from "./page.module.scss";
import Link from "next/link";
import { Lightbulb, Clock, CalendarDays, Bell } from "lucide-react";
import { DateTime } from "@/types/types";

export default function AddTimePage() {
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [existingTimes, setExistingTimes] = useState<DateTime[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  // Get current date for minimum date input
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  // Функция для добавления минут к времени
  const addMinutes = (timeString: string, minutes: number) => {
    const [hours, mins] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Обновляем время окончания при изменении времени начала
  useEffect(() => {
    if (time) {
      setEndTime(addMinutes(time, 30));
    }
  }, [time]);

  // Обновляем time при изменении hour или minute
  useEffect(() => {
    if (hour !== "" && minute !== "") {
      setTime(`${hour}:${minute}`);
    } else {
      setTime("");
    }
  }, [hour, minute]);

  const fetchTimes = useCallback(async () => {
    setLoadingTimes(true);
    try {
      const times = await apiService.getTime();
      setExistingTimes(times);
    } finally {
      setLoadingTimes(false);
    }
  }, []);

  useEffect(() => {
    fetchTimes();
  }, [fetchTimes]);

  // Проверка на пересечение слотов
  const isOverlapping = (newDate: Date) => {
    const newStart = newDate.getTime();
    const newEnd = newStart + 30 * 60 * 1000;
    return existingTimes.some((slot) => {
      const slotStart = new Date(slot.datetime).getTime();
      const slotEnd = slotStart + 30 * 60 * 1000;
      // Пересекаются ли интервалы
      return newStart < slotEnd && newEnd > slotStart;
    });
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      setError("Please select a date and time");
      return;
    }

    const datetime = new Date(`${date}T${time}`);
    if (isOverlapping(datetime)) {
      setError(
        "В это время уже есть другой урок. Пожалуйста, выберите другое время."
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create date object from selected values
      const datetime = new Date(`${date}T${time}`);

      // Check if the date is in the future
      if (datetime < today) {
        setError("Please select a date and time in the future");
        return;
      }

      await apiService.addTime({ datetime });
      setSuccess("Time slot successfully added!");
      fetchTimes();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error adding time slot:", err);
      setError("Failed to add time slot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add Available Time</h1>
        <Link href="/for-teachers" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className={styles.card}>
        <h2>Ваши доступные слоты</h2>
        {loadingTimes ? (
          <div>Загрузка...</div>
        ) : existingTimes.length === 0 ? (
          <div>Нет добавленных слотов.</div>
        ) : (
          <ul className={styles.timeList}>
            {existingTimes.map((slot) => {
              const dateObj = new Date(slot.datetime);
              const dateStr = dateObj.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              });
              const startTime = dateObj.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const endTime = new Date(
                dateObj.getTime() + 30 * 60000
              ).toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <li key={slot.schedule_time_id} className={styles.timeListItem}>
                  <span>
                    {dateStr} — {startTime}–{endTime}
                  </span>{" "}
                  {slot.is_available ? "(Свободно)" : "(Занято)"}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.instructions}>
          <h2>How It Works</h2>
          <p>
            Add your available time slots for conducting lessons. Students will
            be able to choose a convenient time from your schedule.
          </p>
          <ul className={styles.steps}>
            <li>Select the date and time for a lesson</li>
            <li>Add them to your schedule</li>
            <li>Wait for a student to book this time</li>
            <li>Receive a booking notification</li>
          </ul>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Select Date and Time</h2>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <div className={styles.dateTimeContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                className={styles.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Time</label>
              <div className={styles.timeInputContainer}>
                <select
                  className={styles.input}
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    --
                  </option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={String(i).padStart(2, "0")}>
                      {String(i).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span style={{ margin: "0 4px" }}>:</span>
                <select
                  className={styles.input}
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    --
                  </option>
                  {["00", "15", "30", "45"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {time && (
                  <div className={styles.endTime}>Ends at: {endTime}</div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Time Slot"}
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h2>Tips for Teachers</h2>
        <div className={styles.tips}>
          <div className={styles.tip}>
            <div className={styles.tipIcon}>
              <Lightbulb width={24} height={24} />
            </div>
            <div className={styles.tipContent}>
              <h3>Consistency</h3>
              <p>
                Try to add lesson times regularly, this will help students find
                the most convenient time for lessons.
              </p>
            </div>
          </div>

          <div className={styles.tip}>
            <div className={styles.tipIcon}>
              <Clock width={24} height={24} />
            </div>
            <div className={styles.tipContent}>
              <h3>Convenient Time</h3>
              <p>
                It`&apos;`s best to add time slots in the evening and on
                weekends, when most students are free.
              </p>
            </div>
          </div>

          <div className={styles.tip}>
            <div className={styles.tipIcon}>
              <CalendarDays width={24} height={24} />
            </div>
            <div className={styles.tipContent}>
              <h3>Variety</h3>
              <p>
                Plan your time in advance and add available slots at least a
                week ahead.
              </p>
            </div>
          </div>

          <div className={styles.tip}>
            <div className={styles.tipIcon}>
              <Bell width={24} height={24} />
            </div>
            <div className={styles.tipContent}>
              <h3>Cancellations</h3>
              <p>
                Plan your time in advance and add available slots at least a
                week ahead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
