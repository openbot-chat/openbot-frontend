"use client"

import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { HiChevronLeft } from 'react-icons/hi'
import { Button } from '@chakra-ui/react'



export default function NotFoundPage() {
  const locale = useLocale()
  const router = useRouter()
  const scopedT = useTranslations('NotFoundPage')

  const handleClick = () => {
    router.push(`/${locale}`)
  }

  return (
    <main className='relative h-screen w-full overflow-y-auto'>
      <div className="flex min-h-screen flex-col items-center justify-center py-16">
        <Image
          priority
          width={400}
          height={400}
          alt=""
          src="/images/illustrations/404.svg"
          className="h-auto w-full lg:max-w-md"
        />
        <h1 className="mb-6 text-2xl font-bold dark:text-white md:text-5xl">
          {scopedT('title')}
        </h1>
        <p className="mb-6 w-4/5 text-center text-lg text-gray-500 dark:text-gray-300">
          {scopedT('description')}
        </p>
        <Button variant="outline" leftIcon={<HiChevronLeft className="text-xl" />} onClick={() => handleClick()}>
          {scopedT('backHome')}
          <div className="mr-1 flex items-center gap-x-2">
          </div>
        </Button>
      </div>
      
      <div className="mx-4 mt-4">
      
      </div>
    </main>
  )
}