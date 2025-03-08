import {
  createSharedPathnamesNavigation,
} from "next-intl/navigation"

export const defaultLocale = "en-US"
export const locales = ['en-US', 'zh-CN', 'jp', 'fr', 'de', 'pt']

// Navigation utilities configured for the defined locales.
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales })