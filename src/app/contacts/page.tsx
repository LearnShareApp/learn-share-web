"use client";

import React, { useState } from "react";
import styles from "./page.module.scss";
import {
  FaPhone,
  FaEnvelope,
  FaTelegram,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { PageHeader, Card, SectionTitle, Button } from "@/components";

// Инициализация EmailJS
emailjs.init("U6NjmEzxE5luWkwTH");

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      await emailjs.send("service_8kxequk", "template_ph279o4", {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: "learnshareapp@gmail.com",
      });

      setStatus({
        type: "success",
        message: "Message sent successfully! We&apos;ll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus({
        type: "error",
        message:
          "An error occurred while sending the message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.content}>
      <PageHeader title="Get in Touch" />
      <div className={styles.columns}>
        <div className={styles.contactInfo}>
          <Card>
            <SectionTitle level={3}>Contact Information</SectionTitle>
            <p className={styles.description}>
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>

            <div className={styles.contactItem}>
              <FaPhone className={styles.icon} />
              <div>
                <h3>Phone</h3>
                <a href="tel:+381621981089">+381 62 198 1089</a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <FaEnvelope className={styles.icon} />
              <div>
                <h3>Email</h3>
                <a href="mailto:learnshareapp@gmail.com">
                  learnshareapp@gmail.com
                </a>
              </div>
            </div>

            <div className={styles.socials}>
              <h3>Follow Us</h3>
              <div className={styles.socialIcons}>
                <a
                  href="https://t.me/learnshare"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                >
                  <FaTelegram />
                </a>
                <a
                  href="https://twitter.com/learnshare"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://linkedin.com/company/learnshare"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://instagram.com/learnshare"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </Card>
        </div>

        <div className={styles.formContainer}>
          <Card>
            <SectionTitle level={3}>Send us a Message</SectionTitle>
            {status.type && (
              <div
                className={`${styles.statusMessage} ${
                  status.type === "success" ? styles.success : styles.error
                }`}
              >
                {status.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message"
                  rows={5}
                />
              </div>

              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
