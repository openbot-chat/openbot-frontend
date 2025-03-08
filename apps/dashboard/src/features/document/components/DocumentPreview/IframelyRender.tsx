
import { IFramelyViewer } from '@/components/IFramelyViewer';
import { DocumentRenderProps } from './DocumentPreview';
import { Container } from '@chakra-ui/react';

export const IFramelyRender = ({
  document,
}: DocumentRenderProps) => {
  return (
    <Container w='full'>
      <IFramelyViewer url={document.metadata_?.url} />
    </Container>
  )
}
