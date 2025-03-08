import { useTranslations } from 'next-intl';
import { Divider, Heading, Stack, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Pricing } from "./Pricing";



export const SubscriptionPage = () => {
  const t = useTranslations();

  return (
    <Stack w="full" h="full" spacing={8} px={8} py={8}>
      <Heading>{t('nav.subscriptions')}</Heading>

      <Tabs position="relative" variant="unstyled">
        <TabList>
          <Tab>{t('subscriptions.tab.overview')}</Tab>
          <Divider orientation="vertical" />
          <Tab>{t('subscriptions.tab.pricing')}</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="twitter"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel>
            fjf
          </TabPanel>
          <TabPanel>
            <Pricing />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}