import { Stack } from '@chakra-ui/react'
import { Footer } from 'components/common/Footer'
import { SocialMetaTags } from 'components/common/SocialMetaTags'
import { EndCta } from 'components/Homepage/EndCta'
import { Hero } from 'components/Homepage/Hero'
import { ConnectYourDataAnywhere } from 'components/Homepage/ConnectYourDataAnywhere'
import { IntegrateAllToolsSeamlessly } from 'components/Homepage/IntegrateAllToolsSeamlessly'
import { AccessYourAgentAnywhere } from 'components/Homepage/AccessYourAgentAnywhere'
import { MultiModalAICapabilities } from 'components/Homepage/MultiModalAICapabilities'
import { OnePlatformForCollaborativeAIWithAutonomy } from 'components/Homepage/OnePlatformForCollaborativeAIWithAutonomy'
import { PriceTable } from 'components/Homepage/PriceTable'
import { Faq } from 'components/Homepage/Faq'

const App = () => {
  return (
    <Stack w="full" overflowX="hidden" bgColor="gray.900">
      <SocialMetaTags currentUrl={`https://openbot.chat/`} />
      <Hero />
      <ConnectYourDataAnywhere />
      <IntegrateAllToolsSeamlessly />
      <AccessYourAgentAnywhere />
      <MultiModalAICapabilities />
      <OnePlatformForCollaborativeAIWithAutonomy />
      <PriceTable />
      <Faq />
      <EndCta />
      <Footer />
    </Stack>
  )
}

export default App
