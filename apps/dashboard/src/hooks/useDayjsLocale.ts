import dayjs from 'dayjs';
import { useEffect } from "react";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const dayjs_LOCALES = {
  'zh-CN': 'zh-cn',
  'en-US': 'en',
}

export const useDayjsLocale = (locale?: string): void => {
  useEffect(() => {
    const dayjsLocale = dayjs_LOCALES[locale];
    if (dayjsLocale) {
      import(`dayjs/locale/${dayjsLocale}.js`).then(() => {
        dayjs.locale(dayjsLocale);
      });
    }
  }, [locale]);
};