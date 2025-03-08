import { Select } from '@chakra-ui/react'
import { useRouter, usePathname } from 'next/navigation'
import { ChangeEvent } from 'react'

const languages = [
  {
    name: "🇬🇧 English", value: "en", pathname: "/en-US",
  },
  {
    name: "🇨🇳 中文", value: "zh", pathname: "zh-CN",
  }
]

export const LangSelect = () => {
  const pathname = usePathname()
  const router = useRouter()

  const selected = languages.find((l) => l.pathname === pathname)
  
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value
    const selected = languages.find((l) => l.value === locale)
    if (selected) {
      router.push(selected.pathname)
    }
  }

  return (
    <Select
      w="150px"
      value={selected?.value}
      onChange={handleChange}
      borderColor="gray.300"
    >
      {languages.map(it => (
        <option key={it.value} value={it.value}>{it.name}</option>
      ))}
    </Select>
  );
}