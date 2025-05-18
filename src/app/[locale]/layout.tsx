import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ProfileProvider from "@/providers/ProfileProvider";
import AuthRedirector from "@/components/AuthRedirector";
import ClientLayout from "@/layouts/ClientLayout";
import { dir } from "i18next";
import { locales } from "@/lib/i18n/config";
import initTranslations from "@/lib/i18n/i18n";
import TranslationsProvider from "@/lib/i18n/TranslationsProvider";
import "@/styles/globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await initTranslations(params.locale, ["common"]);

  return {
    title: t("title"),
    description: t("description"),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// load all i18n namespaces to get them in client components
const i18nNamespaces = ["common", "loading", "settings"];

export default async function RootLayout(props: Props) {
  const params = await props.params;
  const { children } = props;

  const { resources } = await initTranslations(params.locale, i18nNamespaces);

  return (
    <html lang={params.locale} dir={dir(params.locale)}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TranslationsProvider
          locale={params.locale}
          namespaces={i18nNamespaces}
          resources={resources}
        >
          <ProfileProvider>
            <AuthRedirector />
            <ClientLayout>{children}</ClientLayout>
          </ProfileProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
