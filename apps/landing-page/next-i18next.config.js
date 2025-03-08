/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

/*
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: 'zh',
    locales: ['en', 'zh'],
  },
  defaultNS: 'common',
  localePath:
    typeof window === 'undefined'
      ? path.resolve('./public/locales')
      : '/locales',
  localeStructure: '{{lng}}/{{ns}}',
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};