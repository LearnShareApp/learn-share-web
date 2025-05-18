import Link from "next/link";
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
import styles from "./page.module.scss";
import initTranslations from "@/lib/i18n/i18n";

const iconMap = {
  oneOnOne: <User size={32} />,
  groupClasses: <Users size={32} />,
  events: <Presentation size={32} />,
  reviews: <CheckCircle2 size={32} />,
  chat: <MessageSquare size={32} />,
  payments: <CreditCard size={32} />,
};
type IconKey = keyof typeof iconMap;

function getIcon(key: IconKey) {
  return iconMap[key];
}

function getCategoryIcon(key: keyof typeof categoryIconMap) {
  return categoryIconMap[key];
}

const categoryIconMap = {
  digital: <LayoutPanelLeft size={24} />,
  creative: <Palette size={24} />,
  languages: <Languages size={24} />,
  life: <Star size={24} />,
  tech: <Code size={24} />,
  music: <Music size={24} />,
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LandingPage(props: Props) {
  const params = await props.params;
  const { t } = await initTranslations(params.locale, ["loading"]);

  const benefitKeys: IconKey[] = [
    "oneOnOne",
    "groupClasses",
    "events",
    "reviews",
    "chat",
    "payments",
  ];

  const categoryKeys = Object.keys(categoryIconMap) as (keyof typeof categoryIconMap)[];

  return (
    <div className={styles.landingPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroHeadline}>
            <h1>
              <span className={styles.highlight}>{t("hero.title")}</span>
              <span>{t("hero.subtitle")}</span>
            </h1>
            <p>{t("hero.description")}</p>

            <div className={styles.heroButtons}>
              <Link href="/auth?role=student" className={styles.primaryButton}>
                <span>{t("hero.learnButton")}</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/auth?role=teacher"
                className={styles.secondaryButton}
              >
                <span>{t("hero.teachButton")}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <Image
              src="/images/hero-image.jpg"
              alt={t("hero.imageAlt")}
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
              <span>{t("features.skills")}</span>
            </div>
            <div className={styles.keyFeature}>
              <CalendarDays size={24} />
              <span>{t("features.schedule")}</span>
            </div>
            <div className={styles.keyFeature}>
              <Shield size={24} />
              <span>{t("features.safety")}</span>
            </div>
            <div className={styles.keyFeature}>
              <Users size={24} />
              <span>{t("features.community")}</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.howItWorks}>
          <h2>{t("howItWorks.title")}</h2>
          <div className={styles.steps}>
            {[1, 2, 3].map((step) => (
              <div className={styles.step} key={step}>
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepContent}>
                  <h3>{t(`howItWorks.steps.${step}.title`)}</h3>
                  <p>{t(`howItWorks.steps.${step}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.benefits}>
          <h2>{t("benefits.title")}</h2>
          <div className={styles.benefitCards}>
            {benefitKeys.map((key) => (
              <div className={styles.benefitCard} key={key}>
                <div className={styles.benefitIcon}>{getIcon(key)}</div>
                <h3>{t(`benefits.${key}.title`)}</h3>
                <p>{t(`benefits.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.popularCategories}>
          <h2>{t("categories.title")}</h2>
          <div className={styles.categoriesGrid}>
            {categoryKeys.map((key) => (
              <div className={styles.categoryCard} key={key}>
                <div className={styles.categoryIcon}>{getCategoryIcon(key)}</div>
                <h3>{t(`categories.${key}.title`)}</h3>
                <p>{t(`categories.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.statistics}>
          {["skills", "users", "sessions"].map((key) => (
            <div className={styles.statItem} key={key}>
              <span className={styles.statNumber}>
                {t(`stats.${key}.number`)}
              </span>
              <span className={styles.statLabel}>
                {t(`stats.${key}.label`)}
              </span>
            </div>
          ))}
        </section>

        <section className={styles.testimonials}>
          <h2>{t("testimonials.title")}</h2>
          <div className={styles.testimonialCards}>
            {[1, 2, 3].map((index) => (
              <div className={styles.testimonialCard} key={index}>
                <div className={styles.testimonialContent}>
                  <p>{t(`testimonials.${index}.quote`)}</p>
                </div>
                <div className={styles.testimonialAuthor}>
                  <Image
                    src="/images/person1.jpg"
                    alt={t(`testimonials.${index}.name`)}
                    width={80}
                    height={80}
                    className={styles.authorAvatar}
                  />
                  <div className={styles.authorInfo}>
                    <p className={styles.authorName}>
                      {t(`testimonials.${index}.name`)}
                    </p>
                    <p className={styles.authorRole}>
                      {t(`testimonials.${index}.role`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.callToAction}>
          <h2>{t("cta.title")}</h2>
          <p>{t("cta.description")}</p>
          <div className={styles.ctaButtons}>
            <Link href="/auth?role=student" className={styles.primaryButton}>
              {t("cta.learn")}
            </Link>
            <Link href="/auth?role=teacher" className={styles.secondaryButton}>
              {t("cta.teach")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
