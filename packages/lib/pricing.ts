import type { Organization } from 'models'
import { PlanEnum } from 'models'

const infinity = -1

export const priceIds = {
  [PlanEnum.STARTER]: {
    base: {
      monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID,
    },
    chats: {
      monthly: process.env.STRIPE_STARTER_CHATS_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_STARTER_CHATS_YEARLY_PRICE_ID,
    },
    storage: {
      monthly: process.env.STRIPE_STARTER_STORAGE_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_STARTER_STORAGE_YEARLY_PRICE_ID,
    },
  },
  [PlanEnum.PRO]: {
    base: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    },
    chats: {
      monthly: process.env.STRIPE_PRO_CHATS_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_PRO_CHATS_YEARLY_PRICE_ID,
    },
    storage: {
      monthly: process.env.STRIPE_PRO_STORAGE_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_PRO_STORAGE_YEARLY_PRICE_ID,
    },
  },
}

export const prices = {
  [PlanEnum.STARTER]: 39,
  [PlanEnum.PRO]: 89,
} as const

export const chatsLimit = {
  [PlanEnum.FREE]: { totalIncluded: 200 },
  [PlanEnum.STARTER]: {
    graduatedPrice: [
      { totalIncluded: 2000, price: 0 },
      {
        totalIncluded: 2500,
        price: 10,
      },
      {
        totalIncluded: 3000,
        price: 20,
      },
      {
        totalIncluded: 3500,
        price: 30,
      },
    ],
  },
  [PlanEnum.PRO]: {
    graduatedPrice: [
      { totalIncluded: 10000, price: 0 },
      { totalIncluded: 15000, price: 50 },
      { totalIncluded: 25000, price: 150 },
      { totalIncluded: 50000, price: 400 },
    ],
  },
  [PlanEnum.CUSTOM]: {
    totalIncluded: 2000,
    increaseStep: {
      amount: 500,
      price: 10,
    },
  },
  [PlanEnum.OFFERED]: { totalIncluded: infinity },
  [PlanEnum.LIFETIME]: { totalIncluded: infinity },
  [PlanEnum.UNLIMITED]: { totalIncluded: infinity },
} as const

export const storageLimit = {
  [PlanEnum.FREE]: { totalIncluded: 0 },
  [PlanEnum.STARTER]: {
    graduatedPrice: [
      { totalIncluded: 2, price: 0 },
      {
        totalIncluded: 3,
        price: 2,
      },
      {
        totalIncluded: 4,
        price: 4,
      },
      {
        totalIncluded: 5,
        price: 6,
      },
    ],
  },
  [PlanEnum.PRO]: {
    graduatedPrice: [
      { totalIncluded: 10, price: 0 },
      {
        totalIncluded: 15,
        price: 8,
      },
      {
        totalIncluded: 25,
        price: 24,
      },
      {
        totalIncluded: 40,
        price: 49,
      },
    ],
  },
  [PlanEnum.CUSTOM]: {
    totalIncluded: 2,
    increaseStep: {
      amount: 1,
      price: 2,
    },
  },
  [PlanEnum.OFFERED]: { totalIncluded: 2 },
  [PlanEnum.LIFETIME]: { totalIncluded: 10 },
  [PlanEnum.UNLIMITED]: { totalIncluded: infinity },
} as const

export const seatsLimit = {
  [PlanEnum.FREE]: { totalIncluded: 1 },
  [PlanEnum.STARTER]: {
    totalIncluded: 2,
  },
  [PlanEnum.PRO]: {
    totalIncluded: 5,
  },
  [PlanEnum.CUSTOM]: {
    totalIncluded: 2,
  },
  [PlanEnum.OFFERED]: { totalIncluded: 2 },
  [PlanEnum.LIFETIME]: { totalIncluded: 8 },
  [PlanEnum.UNLIMITED]: { totalIncluded: infinity },
} as const

export const getChatsLimit = ({
  plan,
  additionalChatsIndex,
  customChatsLimit,
}: Pick<Organization, 'additionalChatsIndex' | 'plan' | 'customChatsLimit'>) => {
  if (customChatsLimit) return customChatsLimit
  const totalIncluded =
    plan === PlanEnum.STARTER || plan === PlanEnum.PRO
      ? chatsLimit[plan].graduatedPrice[additionalChatsIndex].totalIncluded
      : chatsLimit[plan].totalIncluded
  return totalIncluded
}

export const getStorageLimit = ({
  plan,
  additionalStorageIndex,
  customStorageLimit,
}: Pick<
  Organization,
  'additionalStorageIndex' | 'plan' | 'customStorageLimit'
>) => {
  if (customStorageLimit) return customStorageLimit
  const totalIncluded =
    plan === PlanEnum.STARTER || plan === PlanEnum.PRO
      ? storageLimit[plan].graduatedPrice[additionalStorageIndex].totalIncluded
      : storageLimit[plan].totalIncluded
  return totalIncluded
}

export const getSeatsLimit = ({
  plan,
  customSeatsLimit,
}: Pick<Organization, 'plan' | 'customSeatsLimit'>) => {
  if (customSeatsLimit) return customSeatsLimit
  return seatsLimit[plan].totalIncluded
}

export const isSeatsLimitReached = ({
  existingMembersAndInvitationsCount,
  plan,
  customSeatsLimit,
}: {
  existingMembersAndInvitationsCount: number
} & Pick<Organization, 'plan' | 'customSeatsLimit'>) => {
  const seatsLimit = getSeatsLimit({ plan, customSeatsLimit })
  return (
    seatsLimit !== infinity && seatsLimit <= existingMembersAndInvitationsCount
  )
}

export const computePrice = (
  plan: PlanEnum,
  selectedTotalChatsIndex: number,
  selectedTotalStorageIndex: number,
  frequency: 'monthly' | 'yearly'
) => {
  if (plan !== PlanEnum.STARTER && plan !== PlanEnum.PRO) return
  const price =
    prices[plan] +
    chatsLimit[plan].graduatedPrice[selectedTotalChatsIndex].price +
    storageLimit[plan].graduatedPrice[selectedTotalStorageIndex].price
  return frequency === 'monthly' ? price : price - price * 0.16
}

const europeanUnionCountryCodes = [
  'AT',
  'BE',
  'BG',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HR',
  'HU',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
]

const europeanUnionExclusiveLanguageCodes = [
  'fr',
  'de',
  'it',
  'el',
  'pl',
  'fi',
  'nl',
  'hr',
  'cs',
  'hu',
  'ro',
  'sl',
  'sv',
  'bg',
]

export const guessIfUserIsEuropean = () => {
  if (typeof window === 'undefined') return false
  return window.navigator.languages.some((language) => {
    const [languageCode, countryCode] = language.split('-')
    return countryCode
      ? europeanUnionCountryCodes.includes(countryCode)
      : europeanUnionExclusiveLanguageCodes.includes(languageCode)
  })
}

export const formatPrice = (price: number, currency?: 'eur' | 'usd') => {
  const isEuropean = guessIfUserIsEuropean()
  const formatter = new Intl.NumberFormat(isEuropean ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: currency?.toUpperCase() ?? (isEuropean ? 'EUR' : 'USD'),
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  })
  return formatter.format(price)
}
