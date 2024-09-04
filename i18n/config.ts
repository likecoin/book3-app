import enMessage from "./messages/en.json";
import zhHantMessage from "./messages/zh-Hant.json";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages: {
    en: enMessage,
    "zh-Hant": zhHantMessage,
  },
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: "book3_app_i18n",
    redirectOn: "root",
  },
}));
