import React from "react";
import styles from "./page.module.scss";
import { DocumentLayout } from "@/components";

//TODO: replace the postal address from Russian Federation, Moscow, Primernaya st., 123, LLC "LearnSher", 123456 to Serbia, Novi Sad, random street random house etc.

export default function PrivacyPage() {
  return (
    <DocumentLayout
      title="Learn&Share Privacy Policy"
      lastUpdated="March 18, 2024"
    >
      <div className={styles.policyContent}>
        <section className={styles.policySection}>
          <h2>About Us</h2>
          <p>
            Learn&Share is an innovative skill-sharing platform where anyone can
            be both a student and a teacher, regardless of formal education. We
            create a safe space where people can monetize their abilities or
            share them for free as volunteers.
          </p>
          <p>
            Our platform aims to connect people with diverse skills and
            knowledge, providing a safe and productive environment for learning
            and teaching. Learn&Share is operated by LLC
            &ldquo;LearnShare&rdquo; (Tax ID: 1234567890, legal address: Russian
            Federation, Moscow, Primernaya st., 123).
          </p>
        </section>

        <section className={styles.policySection}>
          <h2>Definitions and Terms</h2>
          <p>The following terms are used in this Privacy Policy:</p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              <strong>Platform</strong> — Learn&Share website and mobile
              application.
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>User</strong> — an individual using the Platform.
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Student</strong> — a User receiving educational services.
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Teacher</strong> — a User providing educational services.
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Personal Data</strong> — any information relating directly
              or indirectly to an identified or identifiable User.
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Personal Data Processing</strong> — any operation
              performed on a User&apos;s personal data.
            </li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Legal Basis for Data Processing</h2>
          <p>
            We process Users&apos; personal data on the following legal grounds:
          </p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              User&apos;s consent to the processing of personal data
            </li>
            <li>
              <span className={styles.bullet}></span>
              Necessity of processing for the performance of a contract to which
              the User is a party
            </li>
            <li>
              <span className={styles.bullet}></span>
              Necessity of processing for compliance with legal obligations
            </li>
            <li>
              <span className={styles.bullet}></span>
              Necessity of processing to protect the vital interests of the User
              or another person
            </li>
            <li>
              <span className={styles.bullet}></span>
              Necessity of processing for the performance of a task carried out
              in the public interest
            </li>
            <li>
              <span className={styles.bullet}></span>
              Necessity of processing for the purposes of the legitimate
              interests pursued by the Platform Administration or a third party
            </li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              <strong>Personal data</strong> (name, email, phone number, date of
              birth, identification documents for teacher verification)
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Information about skills and interests</strong> for
              optimal matching of teachers and courses
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Profile data</strong> (photos, biography, video
              presentations, education, work experience)
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Information about interactions</strong> between users to
              improve service quality (message history, reviews, ratings)
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Technical data</strong> (IP address, device type,
              operating system, browser type and version, system language,
              device identifiers, cookies data)
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Geolocation data</strong> (with User&apos;s consent) for
              matching teachers in a specific region
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Payment data</strong> (transaction history, banking
              details) for processing and accounting of payment transactions
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Platform usage data</strong> (pages visited, time and
              duration of use, actions on the platform)
            </li>
          </ul>
          <p>
            <strong>Special categories of data:</strong> We do not collect or
            store data belonging to special categories (racial or ethnic origin,
            political opinions, religious or philosophical beliefs, trade union
            membership, genetic data, biometric data for the purpose of uniquely
            identifying a person, data concerning health, data concerning a
            person&apos;s sex life or sexual orientation), except when necessary
            for the provision of specialized services and with the explicit
            consent of the User.
          </p>
        </section>

        <section className={styles.policySection}>
          <h2>Methods of Information Collection</h2>
          <p>We collect information through the following methods:</p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              <strong>Direct provision</strong> — information that the User
              provides during registration, profile creation, account setup
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Automatic collection</strong> — through cookies, web
              beacons, log files, and other tracking technologies
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>From third parties</strong> — from partners, social
              networks during authorization, payment systems
            </li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Use of Cookies</h2>
          <p>
            We use cookies and similar technologies to improve the
            Platform&apos;s functionality, analyze traffic, and personalize the
            User&apos;s experience. Cookies are small text files stored on the
            User&apos;s device.
          </p>
          <p>We use the following types of cookies:</p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              <strong>Necessary cookies</strong> — for the operation of basic
              Platform functions
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Functional cookies</strong> — for remembering User
              preferences
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Analytical cookies</strong> — for collecting information
              about Platform usage
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Marketing cookies</strong> — for displaying relevant
              advertisements
            </li>
          </ul>
          <p>
            Users can manage cookie settings in their browser, including
            blocking or deleting cookies. However, this may affect the
            functionality of the Platform.
          </p>
        </section>

        <section className={styles.policySection}>
          <h2>Use of Information</h2>
          <p>The collected information is used for:</p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              Creating and managing user accounts
            </li>
            <li>
              <span className={styles.bullet}></span>
              Ensuring the functioning of the skill exchange platform
            </li>
            <li>
              <span className={styles.bullet}></span>
              Connecting students with teachers and creating a safe learning
              environment
            </li>
            <li>
              <span className={styles.bullet}></span>
              Improving service quality and user experience
            </li>
            <li>
              <span className={styles.bullet}></span>
              Ensuring platform security and preventing fraud
            </li>
            <li>
              <span className={styles.bullet}></span>
              Processing payments and managing financial transactions
            </li>
            <li>
              <span className={styles.bullet}></span>
              Personalizing content and offers based on User interests and
              preferences
            </li>
            <li>
              <span className={styles.bullet}></span>
              Communicating with Users and sending important notifications
            </li>
            <li>
              <span className={styles.bullet}></span>
              Conducting research and analytics to improve services
            </li>
            <li>
              <span className={styles.bullet}></span>
              Marketing campaigns and service promotion (with User consent)
            </li>
            <li>
              <span className={styles.bullet}></span>
              Compliance with legal obligations and dispute resolution
            </li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Sharing Data with Third Parties</h2>
          <p>
            We do not sell or transfer your personal data to third parties
            without your consent, except in cases:
          </p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              When necessary to ensure service operation (e.g., integration with
              payment systems, cloud storage, video communication services,
              analytical services)
            </li>
            <li>
              <span className={styles.bullet}></span>
              In cases provided by law (at the request of authorized government
              agencies, in the context of legal proceedings)
            </li>
            <li>
              <span className={styles.bullet}></span>
              To protect the rights and safety of our platform users, including
              investigating potential violations
            </li>
            <li>
              <span className={styles.bullet}></span>
              In the event of company reorganization, merger or sale of assets,
              subject to compliance with the provisions of this Privacy Policy
            </li>
          </ul>
          <p>
            When transferring data to third parties, we ensure that appropriate
            data protection and processing agreements are in place with such
            parties.
          </p>
        </section>

        <section className={styles.policySection}>
          <h2>International Data Transfers</h2>
          <p>
            We may transfer, store and process User information in countries
            other than the User&apos;s country of residence. These countries may
            have different data protection laws. When transferring data to such
            countries, we take appropriate measures to ensure adequate data
            protection, including:
          </p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              Concluding special agreements containing data protection
              conditions (standard contractual clauses)
            </li>
            <li>
              <span className={styles.bullet}></span>
              Transferring data only to countries recognized as providing an
              adequate level of data protection
            </li>
            <li>
              <span className={styles.bullet}></span>
              Obtaining special User consent for data transfer
            </li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Data Storage and Protection</h2>
          <p>
            We take all necessary measures to protect your data from
            unauthorized access, alteration, disclosure, or destruction:
          </p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              We use data encryption for transmission and storage (SSL/TLS,
              database encryption)
            </li>
            <li>
              <span className={styles.bullet}></span>
              We implement strict access protocols for our employees (principle
              of least privilege, two-factor authentication)
            </li>
            <li>
              <span className={styles.bullet}></span>
              We regularly conduct security audits of our system and penetration
              testing
            </li>
            <li>
              <span className={styles.bullet}></span>
              We store data only for the period necessary to ensure service
              operation or in accordance with legal requirements
            </li>
            <li>
              <span className={styles.bullet}></span>
              We implement data security incident response procedures
            </li>
            <li>
              <span className={styles.bullet}></span>
              We conduct regular employee training on data security issues
            </li>
          </ul>
          <p>
            <strong>Data retention periods:</strong>
          </p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              Account data is stored until the User deletes the account or for 3
              years after the last activity
            </li>
            <li>
              <span className={styles.bullet}></span>
              Transaction data is stored for the period established by tax
              legislation (at least 5 years)
            </li>
            <li>
              <span className={styles.bullet}></span>
              Messages and correspondence are stored for 1 year after their
              creation
            </li>
            <li>
              <span className={styles.bullet}></span>
              Technical logs and analytics data are stored for up to 2 years
            </li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>User Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              <strong>Access your personal data</strong>: request a copy of your
              personal data that we process
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Rectify inaccurate information</strong>: request
              correction of inaccurate or incomplete personal data
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Delete your data from the system</strong> (&ldquo;right to
              be forgotten&rdquo;): request deletion of your personal data in
              certain circumstances
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Restrict data processing</strong>: request restriction of
              processing of your personal data in certain circumstances
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Withdraw your consent to data processing</strong>:
              withdraw previously given consent to data processing at any time
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Request export of your data</strong> in a structured
              format: receive your data in a machine-readable format and
              transfer it to another data controller
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Object to data processing</strong>: object to the
              processing of your personal data for marketing purposes or for
              reasons related to your particular situation
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Not be subject to automated decision-making</strong>: not
              be subject to a decision based solely on automated processing,
              including profiling, which produces legal effects concerning you
              or significantly affects you
            </li>
            <li>
              <span className={styles.bullet}></span>
              <strong>Lodge a complaint</strong>: file a complaint with a data
              protection supervisory authority if you believe that the
              processing of your personal data violates applicable data
              protection law
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us through the
            support section in the application or by email. We will consider
            your request and respond to it within 30 days of receipt.
          </p>
          <p>
            Please note that in some cases we may not be able to fulfill your
            request fully or partially in accordance with applicable law.
          </p>
        </section>

        <section className={styles.policySection}>
          <h2>Protection of Minors`&apos;` Data</h2>
          <p>
            Our Platform is not intended for individuals under 16 years of age.
            We do not knowingly collect personal data from children under 16. If
            you become aware that a child under 16 has provided us with personal
            data without parental or guardian consent, please contact us. If we
            learn that we have collected personal data from a child under 16
            without verification of parental consent, we will take steps to
            delete that information from our servers.
          </p>
          <p>
            For users between 16 and 18 years of age, parental or guardian
            consent is required for the processing of personal data.
          </p>
        </section>

        <section className={styles.policySection}>
          <h2>Security Breach Notification</h2>
          <p>
            In the event of a security breach resulting in accidental or
            unlawful destruction, loss, alteration, unauthorized disclosure of,
            or access to your personal data, we will notify you and the relevant
            supervisory authorities of such breach in accordance with the
            requirements of applicable law.
          </p>
        </section>

        <section className={styles.policySection}>
          <h2>Changes to Privacy Policy</h2>
          <p>
            We reserve the right to make changes to this Privacy Policy. Users
            will be notified of significant changes through the application or
            by email. We recommend regularly checking this page for the latest
            information about our data protection practices.
          </p>
          <p>
            Continued use of the Platform after changes to the Privacy Policy
            means acceptance of these changes. If you do not agree with the
            changes, you should stop using the Platform.
          </p>
          <p>Change history:</p>
          <ul>
            <li>
              <span className={styles.bullet}></span>
              March 18, 2024 — update of the privacy policy with details of user
              rights and data processing procedures
            </li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>User Consent</h2>
          <p>
            By using the Learn&Share platform, you agree to the terms of this
            Privacy Policy. If you do not agree with these terms, please stop
            using our service.
          </p>
          <p>
            For certain types of data processing, your separate consent may be
            required, which you can provide or withdraw in your account settings
            or through customer support.
          </p>
        </section>

        <section className={styles.policySection}>
          <h2>Applicable Law</h2>
          <p>
            This Privacy Policy is governed by and construed in accordance with
            the laws of the Russian Federation, including the Federal Law
            &ldquo;On Personal Data&rdquo; of July 27, 2006 N 152-FZ, without
            regard to conflict of law rules.
          </p>
          <p>
            For users from the European Union, the provisions of the General
            Data Protection Regulation (GDPR) also apply.
          </p>
          <p>
            All disputes arising out of or in connection with this Privacy
            Policy shall be resolved in accordance with the laws of the Russian
            Federation.
          </p>
        </section>

        <section className={styles.policySection}>
          <h2>Contact Information</h2>
          <div className={styles.contactInfo}>
            <p>
              For questions regarding this Privacy Policy, you can contact us:
            </p>
            <ul>
              <li>
                <span className={styles.bullet}></span>
                By email:{" "}
                <a href="mailto:learnandshareapp@gmail.com">
                  learnandshareapp@gmail.com
                </a>
              </li>
              <li>
                <span className={styles.bullet}></span>
                Through the feedback form on the <a href="/support">
                  support
                </a>{" "}
                page
              </li>
              <li>
                <span className={styles.bullet}></span>
                By postal mail: Russian Federation, Moscow, Primernaya st., 123,
                LLC &ldquo;LearnShare&rdquo;, 123456
              </li>
              <li>
                <span className={styles.bullet}></span>
                Data Protection Officer: Eroshenkov Andrey Sergeevich,
                <a href="jerosenkov.andrej@jjzmaj.edu.rs">
                  jerosenkov.andrej@jjzmaj.edu.rs
                </a>
              </li>
            </ul>
            <p>
              We commit to reviewing all your requests regarding the processing
              of your personal data and providing a response within 30 calendar
              days from the date of receipt of the request.
            </p>
          </div>
        </section>
      </div>
    </DocumentLayout>
  );
}
