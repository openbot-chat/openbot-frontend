import { useRef, useMemo } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  VStack,
} from '@chakra-ui/react'
import {
  DataProviderList,
} from './DataProviderList';
import { useTranslations } from 'next-intl';
import { Integration } from 'models';
import { trpc } from '@/utils/trpc-client';
import { useDataProviders } from '../hooks/useDataProviders';

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  onSelect?: (dataProvider: Integration) => void;
}

export const DatasourceDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const t = useTranslations();
  const btnRef = useRef();


  const { data: dataProviders } = useDataProviders();
  
  return (
    <Drawer
      size="md"
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{t('datasource.select')}</DrawerHeader>
        <DrawerBody>
          <VStack>
            <Input placeholder='Search datasource...' />
            <DataProviderList dataProviders={dataProviders} onSelect={onSelect} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}