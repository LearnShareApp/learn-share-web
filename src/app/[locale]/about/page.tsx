import { defaultLocale } from "@/lib/i18n/config";
import AboutPageEn from "./AboutPageEn";
import AboutPageRu from "./AboutPageRu";
import AboutPageSr from "./AboutPageSr";

type Props = {
  params: Promise<{ locale: string }>;
};

const components: Record<string, React.ComponentType> = {
  en: AboutPageEn,
  ru: AboutPageRu,
  sr: AboutPageSr,
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const PageComponent = components[locale] || components[defaultLocale];
  return <PageComponent />;
}
