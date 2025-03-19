"use client";

import React, { useState } from "react";
import { apiService } from "../../../utilities/api";
import styles from "./page.module.scss";
import Link from "next/link";

export default function AddTimePage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get current date for minimum date input
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      setError("Please select a date and time");
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

      // Reset form
      setDate("");
      setTime("");

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
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              className={styles.input}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2V6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 18V22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.93 4.93L7.76 7.76"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.24 16.24L19.07 19.07"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12H6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 12H22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.93 19.07L7.76 16.24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.24 7.76L19.07 4.93"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6V12L16 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 2V6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 2V6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 10H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.tipContent}>
              <h3>Planning</h3>
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
