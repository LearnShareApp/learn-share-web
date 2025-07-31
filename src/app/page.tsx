"use client";

// import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Info,
  CalendarDays,
  Shield,
  Users,
  User,
  Presentation,
  CheckCircle2,
  MessageSquare,
  CreditCard,
  LayoutPanelLeft,
  Palette,
  Languages,
  Star,
  Code,
  Music,
} from "lucide-react";
import { Button, SectionTitle, StatCard } from "@/components";
import styles from "./page.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroHeadline}>
            <h1>
              <span className={styles.highlight}>Learn&Share</span>
              <span>P2P Learning Reimagined</span>
            </h1>

            <p>
              A decentralized knowledge-sharing platform where everyone can
              teach and learn directly from others - through one-on-one
              sessions, group classes, and large-scale events.
            </p>

            <div className={styles.heroButtons}>
              <Button
                variant="primary"
                size="large"
                href="/auth?role=student"
                icon={<ArrowRight size={18} />}
              >
                I Want to Learn
              </Button>
              <Button
                variant="secondary"
                size="large"
                href="/auth?role=teacher"
                icon={<ArrowRight size={18} />}
              >
                I Want to Teach
              </Button>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <Image
              src="/images/hero-image.jpg"
              alt="Learn&Share Platform"
              className={styles.heroImage}
              width={500}
              height={400}
              priority
            />
          </div>
        </div>

        <div className={styles.keyFeatures}>
          <div className={styles.keyFeatureContent}>
            <div className={styles.keyFeature}>
              <Info size={24} />
              <span>100+ Skills</span>
            </div>

            <div className={styles.keyFeature}>
              <CalendarDays size={24} />
              <span>Flexible Scheduling</span>
            </div>

            <div className={styles.keyFeature}>
              <Shield size={24} />
              <span>Safe Learning</span>
            </div>

            <div className={styles.keyFeature}>
              <Users size={24} />
              <span>Community Growth</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.howItWorks}>
          <SectionTitle level={2} align="center">
            How It Works
          </SectionTitle>

          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Sign Up</h3>
                <p>
                  Create an account, complete your profile, and specify your
                  interests and skills
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Choose Your Role</h3>
                <p>Decide who you want to be today: a student or a teacher</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Start Learning</h3>
                <p>
                  Find the perfect teacher or students for knowledge exchange
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.benefits}>
          <SectionTitle level={2} align="center">
            Key Features
          </SectionTitle>

          <div className={styles.benefitCards}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <User size={32} />
              </div>
              <h3>One-on-One Sessions</h3>
              <p>
                Book personal sessions with mentors and experts in various
                fields
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Users size={32} />
              </div>
              <h3>Group Classes</h3>
              <p>
                Organize or join affordable and collaborative learning sessions
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Presentation size={32} />
              </div>
              <h3>Events & Webinars</h3>
              <p>
                Participate in public lectures, webinars, and workshops from the
                community
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <CheckCircle2 size={32} />
              </div>
              <h3>Reviews & Ratings</h3>
              <p>Build trust and transparency through verified user reviews</p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <MessageSquare size={32} />
              </div>
              <h3>Chat System</h3>
              <p>
                Convenient communication with teachers and students before and
                after sessions for maximum efficiency
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <CreditCard size={32} />
              </div>
              <h3>Flexible Payments</h3>
              <p>
                Convenient payment system and wallet for easy earnings and
                expense management
              </p>
            </div>
          </div>
        </section>

        <section className={styles.popularCategories}>
          <SectionTitle level={2} align="center">
            Popular Categories
          </SectionTitle>

          <div className={styles.categoriesGrid}>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <LayoutPanelLeft size={24} />
              </div>
              <h3>Digital Skills</h3>
              <p>200+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <Palette size={24} />
              </div>
              <h3>Creative Arts</h3>
              <p>150+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <Languages size={24} />
              </div>
              <h3>Languages</h3>
              <p>100+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <Star size={24} />
              </div>
              <h3>Life Skills</h3>
              <p>180+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <Code size={24} />
              </div>
              <h3>Tech & Coding</h3>
              <p>250+ Skills</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <Music size={24} />
              </div>
              <h3>Music & Performance</h3>
              <p>120+ Skills</p>
            </div>
          </div>
        </section>

        <section className={styles.statistics}>
          <StatCard number="500+" label="Different Skills" />
          <StatCard number="10,000+" label="Active Users" />
          <StatCard number="5,000+" label="Completed Sessions" />
        </section>

        <section className={styles.testimonials}>
          <SectionTitle level={2} align="center">
            What Our Users Say
          </SectionTitle>
          <div className={styles.testimonialCards}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>
                  &ldquo;The platform completely changed my approach to
                  learning. Now I can not only gain knowledge but also share my
                  experience with others. A wonderful opportunity for
                  professional growth!&rdquo;
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <Image
                  src="/images/person1.jpg"
                  alt="Alexander K."
                  width={80}
                  height={80}
                  className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <p className={styles.authorName}>Alexander K.</p>
                  <p className={styles.authorRole}>JavaScript Instructor</p>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>
                  &ldquo;Thanks to Learn&Share, I found the perfect design
                  teacher. The user-friendly interface, flexible schedule, and
                  personalized approach made learning extremely
                  effective.&rdquo;
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <Image
                  src="/images/person1.jpg"
                  alt="Maria S."
                  width={80}
                  height={80}
                  className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <p className={styles.authorName}>Maria S.</p>
                  <p className={styles.authorRole}>Student, Web Designer</p>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>
                  &ldquo;As an English teacher, I appreciate the opportunity to
                  work with motivated students. The platform provides all the
                  necessary tools for effective teaching.&rdquo;
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <Image
                  src="/images/person1.jpg"
                  alt="Elena M."
                  width={80}
                  height={80}
                  className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <p className={styles.authorName}>Elena M.</p>
                  <p className={styles.authorRole}>English Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.callToAction}>
          <SectionTitle
            level={2}
            align="center"
            subtitle="We're democratizing access to education by making it flexible, accessible, and community-based"
          >
            Join the Community Today
          </SectionTitle>

          <div className={styles.ctaButtons}>
            <Button variant="primary" size="large" href="/auth?role=student">
              Start Learning
            </Button>
            <Button variant="secondary" size="large" href="/auth?role=teacher">
              Start Teaching
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
