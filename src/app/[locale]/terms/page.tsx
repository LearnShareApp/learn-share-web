import React from "react";
import styles from "./page.module.scss";

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Learn&amp;Share Terms of Service</h1>
        <p className={styles.lastUpdated}>Last updated: March 18, 2024</p>
      </div>

      <div className={styles.termsContent}>
        <section className={styles.termsSection}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Learn&Share, a community-driven learning platform where
            anyone can become a teacher or a student. These Terms of Service
            (&ldquo;Terms&rdquo;) govern your access to and use of the
            Learn&Share platform, including website, mobile applications, and
            any services offered through the platform (collectively, the
            &ldquo;Service&rdquo;).
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these
            Terms. If you do not agree to these Terms, please do not access or
            use the Service. Learn&Share is operated by LLC
            &ldquo;LearnShare&rdquo; (hereinafter referred to as
            &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>2. Definitions</h2>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              <strong>&ldquo;Platform&rdquo;</strong> means Learn&Share website
              and mobile application.
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>&ldquo;User&rdquo;</strong> means any individual who has
              registered an account on the Platform.
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>&ldquo;Student&rdquo;</strong> means a User who receives
              educational services through the Platform.
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>&ldquo;Teacher&rdquo;</strong> means a User who provides
              educational services through the Platform.
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>&ldquo;Content&rdquo;</strong> means any text, graphics,
              photos, audio, video, information, and other materials shared on
              the Platform.
            </li>
          </ul>
        </section>

        <section className={styles.termsSection}>
          <h2>3. Eligibility</h2>
          <p>
            To use the Service, you must be at least 16 years old. If you are
            under 18, you may only use the Service with the consent and
            supervision of a parent or legal guardian who agrees to be bound by
            these Terms. By using the Service, you represent and warrant that
            you meet these eligibility requirements.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>4. Account Registration</h2>
          <p>
            To access certain features of the Service, you must register for an
            account. When registering, you agree to provide accurate, current,
            and complete information. You are responsible for maintaining the
            confidentiality of your account credentials and for all activities
            that occur under your account.
          </p>
          <p>
            You agree to immediately notify us of any unauthorized use of your
            account or any other breach of security. We cannot and will not be
            liable for any loss or damage arising from your failure to maintain
            the security of your account.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>5. User Roles and Responsibilities</h2>
          <h3>5.1. General Responsibilities</h3>
          <p>
            All Users agree to use the Service in accordance with these Terms
            and all applicable laws and regulations. Users are prohibited from:
          </p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              Using the Service for any illegal purpose
            </li>
            <li>
              <span className={styles.bullet}></span>
              Posting or sharing content that is offensive, abusive, defamatory,
              or violates the rights of others
            </li>
            <li>
              <span className={styles.bullet}></span>
              Attempting to interfere with or disrupt the Service or its servers
            </li>
            <li>
              <span className={styles.bullet}></span>
              Impersonating another person or entity
            </li>
            <li>
              <span className={styles.bullet}></span>
              Creating multiple accounts for abusive or fraudulent purposes
            </li>
          </ul>

          <h3>5.2. Teacher Responsibilities</h3>
          <p>As a Teacher on the Platform, you additionally agree to:</p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              Provide accurate information about your qualifications,
              experience, and skills
            </li>
            <li>
              <span className={styles.bullet}></span>
              Deliver educational services as described in your profile and
              agreed upon with Students
            </li>
            <li>
              <span className={styles.bullet}></span>
              Maintain appropriate conduct during all interactions with Students
            </li>
            <li>
              <span className={styles.bullet}></span>
              Respect the confidentiality of all Student information
            </li>
            <li>
              <span className={styles.bullet}></span>
              Comply with the Platform&apos;s policies regarding scheduling,
              cancellations, and refunds
            </li>
          </ul>

          <h3>5.3. Student Responsibilities</h3>
          <p>As a Student on the Platform, you additionally agree to:</p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              Provide accurate information when booking lessons or sessions
            </li>
            <li>
              <span className={styles.bullet}></span>
              Attend scheduled sessions on time
            </li>
            <li>
              <span className={styles.bullet}></span>
              Communicate promptly with Teachers regarding any changes to
              scheduled sessions
            </li>
            <li>
              <span className={styles.bullet}></span>
              Provide honest and constructive feedback on Teachers and lessons
            </li>
          </ul>
        </section>

        <section className={styles.termsSection}>
          <h2>6. Content and Intellectual Property</h2>
          <h3>6.1. User Content</h3>
          <p>
            You retain all rights to any content you submit, post, or display on
            or through the Service (&ldquo;User Content&rdquo;). By submitting,
            posting, or displaying User Content on the Service, you grant us a
            worldwide, non-exclusive, royalty-free license to use, reproduce,
            modify, adapt, publish, translate, and distribute such User Content
            for the purpose of providing and promoting the Service.
          </p>

          <h3>6.2. Platform Content</h3>
          <p>
            The Service and its original content, features, and functionality
            are owned by Learn&Share and are protected by international
            copyright, trademark, patent, trade secret, and other intellectual
            property laws. You may not reproduce, distribute, modify, create
            derivative works of, publicly display, publicly perform, republish,
            download, store, or transmit any of the material on our Service
            without our prior written consent.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>7. Payments and Fees</h2>
          <h3>7.1. Payment Processing</h3>
          <p>
            Learn&Share uses third-party payment processors to facilitate
            payment transactions between Students and Teachers. By using the
            Service, you agree to be bound by the terms of service of these
            payment processors.
          </p>

          <h3>7.2. Teacher Compensation</h3>
          <p>
            Teachers set their own rates for the services they provide.
            Learn&Share charges a service fee (platform commission) for each
            transaction. The service fee will be clearly disclosed during the
            payment process. Teachers will receive payment for their services
            according to the platform&apos;s payment schedule, after deduction
            of applicable fees.
          </p>

          <h3>7.3. Refunds</h3>
          <p>
            Refund policies may vary depending on the specific circumstances.
            Generally, refunds are processed in accordance with our Refund
            Policy, which is incorporated into these Terms by reference.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>8. Cancellations and Rescheduling</h2>
          <p>
            Users may cancel or reschedule sessions according to the
            platform&apos;s Cancellation Policy. Late cancellations or no-shows
            may result in charges or penalties as specified in the Cancellation
            Policy.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>9. Reviews and Ratings</h2>
          <p>
            Students may leave reviews and ratings for Teachers based on their
            experiences. All reviews must be honest, accurate, and constructive.
            We reserve the right to remove reviews that violate these Terms or
            our Review Guidelines.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>10. Verification Process</h2>
          <p>
            Teachers may undergo a verification process to confirm their
            identity and qualifications. This process may include document
            verification, background checks, and skills assessments. The
            verification status will be displayed on the Teacher&apos;s profile.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>11. Privacy</h2>
          <p>
            Your privacy is important to us. Our Privacy Policy, which is
            incorporated into these Terms by reference, explains how we collect,
            use, and disclose information about you.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>12. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Learn&Share and its
            officers, directors, employees, and agents shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages, including but not limited to loss of profits, data, use,
            goodwill, or other intangible losses, resulting from your access to
            or use of or inability to access or use the Service.
          </p>
          <p>
            Learn&Share acts as a platform connecting Teachers and Students and
            is not responsible for the quality, safety, legality, or any other
            aspect of the educational services provided by Teachers.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>13. Disclaimers</h2>
          <p>
            The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS
            AVAILABLE&rdquo; basis. Learn&Share expressly disclaims all
            warranties of any kind, whether express or implied, including but
            not limited to the implied warranties of merchantability, fitness
            for a particular purpose, and non-infringement.
          </p>
          <p>
            Learn&Share makes no warranty that the Service will meet your
            requirements, be available on an uninterrupted, secure, or
            error-free basis, or that defects will be corrected.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>14. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Learn&Share and
            its officers, directors, employees, and agents from and against any
            claims, liabilities, damages, losses, and expenses, including
            without limitation reasonable attorneys&apos; fees, arising out of
            or in any way connected with your access to or use of the Service,
            your violation of these Terms, or your violation of any rights of
            another.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>15. Term and Termination</h2>
          <p>
            These Terms shall remain in full force and effect while you use the
            Service. We reserve the right to terminate or suspend your account
            and access to the Service at any time, for any reason, without
            notice or liability.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>16. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time.
            If a revision is material, we will provide at least 30 days&apos;
            notice prior to any new terms taking effect. What constitutes a
            material change will be determined at our sole discretion.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>17. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the country where Learn&Share is registered, without
            regard to its conflict of law provisions.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>18. Dispute Resolution</h2>
          <p>
            Any dispute arising from or relating to these Terms or the Service
            shall first be attempted to be resolved through good-faith
            negotiations. If such negotiations fail, the dispute shall be
            submitted to binding arbitration in accordance with the laws of the
            country where Learn&Share is registered.
          </p>
        </section>

        <section className={styles.termsSection}>
          <h2>19. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className={styles.contactInfo}>
            <p>
              <strong>LLC &ldquo;LearnShare&rdquo;</strong>
              <br />
              Email: legal@learnshare.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
