
import { Image } from '@chakra-ui/react';
import { DocumentRenderProps } from './DocumentPreview';

export const ImageRender = ({
  document,
}: DocumentRenderProps) => (
  <Image alt="" src={document.metadata_.url} rounded="md" h="full" />
)