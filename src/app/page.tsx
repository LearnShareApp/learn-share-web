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
import {
  Button,
  SectionTitle,
  StatCard,
  FeatureItem,
  StepList,
  IconCard,
  TestimonialCard,
} from "@/components";
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
            <FeatureItem icon={<Info size={24} />} label="100+ Skills" />
            <FeatureItem
              icon={<CalendarDays size={24} />}
              label="Flexible Scheduling"
            />
            <FeatureItem icon={<Shield size={24} />} label="Safe Learning" />
            <FeatureItem icon={<Users size={24} />} label="Community Growth" />
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.howItWorks}>
          <SectionTitle level={2} align="center">
            How It Works
          </SectionTitle>

          <StepList
            steps={[
              {
                number: 1,
                title: "Sign Up",
                description:
                  "Create an account, complete your profile, and specify your interests and skills",
              },
              {
                number: 2,
                title: "Choose Your Role",
                description:
                  "Decide who you want to be today: a student or a teacher",
              },
              {
                number: 3,
                title: "Start Learning",
                description:
                  "Find the perfect teacher or students for knowledge exchange",
              },
            ]}
          />
        </section>

        <section className={styles.benefits}>
          <SectionTitle level={2} align="center">
            Key Features
          </SectionTitle>

          <div className={styles.benefitCards}>
            <IconCard
              icon={<User size={32} />}
              title="One-on-One Sessions"
              subtitle="Book personal sessions with mentors and experts in various fields"
            />
            <IconCard
              icon={<Users size={32} />}
              title="Group Classes"
              subtitle="Organize or join affordable and collaborative learning sessions"
            />
            <IconCard
              icon={<Presentation size={32} />}
              title="Events & Webinars"
              subtitle="Participate in public lectures, webinars, and workshops from the community"
            />
            <IconCard
              icon={<CheckCircle2 size={32} />}
              title="Reviews & Ratings"
              subtitle="Build trust and transparency through verified user reviews"
            />
            <IconCard
              icon={<MessageSquare size={32} />}
              title="Chat System"
              subtitle="Convenient communication with teachers and students before and after sessions for maximum efficiency"
            />
            <IconCard
              icon={<CreditCard size={32} />}
              title="Flexible Payments"
              subtitle="Convenient payment system and wallet for easy earnings and expense management"
            />
          </div>
        </section>

        <section className={styles.popularCategories}>
          <SectionTitle level={2} align="center">
            Popular Categories
          </SectionTitle>

          <div className={styles.categoriesGrid}>
            <IconCard
              icon={<LayoutPanelLeft size={24} />}
              title="Digital Skills"
              subtitle="200+ Skills"
            />
            <IconCard
              icon={<Palette size={24} />}
              title="Creative Arts"
              subtitle="150+ Skills"
            />
            <IconCard
              icon={<Languages size={24} />}
              title="Languages"
              subtitle="100+ Skills"
            />
            <IconCard
              icon={<Star size={24} />}
              title="Life Skills"
              subtitle="180+ Skills"
            />
            <IconCard
              icon={<Code size={24} />}
              title="Tech & Coding"
              subtitle="250+ Skills"
            />
            <IconCard
              icon={<Music size={24} />}
              title="Music & Performance"
              subtitle="120+ Skills"
            />
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
            <TestimonialCard
              text="The platform completely changed my approach to learning. Now I can not only gain knowledge but also share my experience with others. A wonderful opportunity for professional growth!"
              avatarSrc="/images/person1.jpg"
              name="Alexander K."
              role="JavaScript Instructor"
            />
            <TestimonialCard
              text="Thanks to Learn&Share, I found the perfect design teacher. The user-friendly interface, flexible schedule, and personalized approach made learning extremely effective."
              avatarSrc="/images/person1.jpg"
              name="Maria S."
              role="Student, Web Designer"
            />
            <TestimonialCard
              text="As an English teacher, I appreciate the opportunity to work with motivated students. The platform provides all the necessary tools for effective teaching."
              avatarSrc="/images/person1.jpg"
              name="Elena M."
              role="English Teacher"
            />
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
