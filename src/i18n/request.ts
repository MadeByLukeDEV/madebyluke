// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  // 1. Check cookie preference
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value;

  // 2. Check Accept-Language header for geo-based detection
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language") ?? "";

  let locale = "en";

  if (cookieLang && ["en", "de"].includes(cookieLang)) {
    locale = cookieLang;
  } else if (acceptLanguage.toLowerCase().startsWith("de")) {
    locale = "de";
  }

  const messages = (await import(`./messages/${locale}.json`)).default;

  return { locale, messages };
});
