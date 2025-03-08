import { useMemo } from 'react';
import { Document } from 'models';
import { ImageRender } from './ImageRender';
import { IFramelyRender } from './IframelyRender';


type DocumentPreviewProps = {
  document: Document;
}

export type DocumentRenderProps = {
  document: Document;
}


const EmptyRender: React.FC<DocumentRenderProps> = () => <></>;



const fileRenders = {
  'png': ImageRender,
  'gif': ImageRender,
  'webp': ImageRender,
  'svg': ImageRender,
  'jpeg': ImageRender,
  'jpg': ImageRender,
}


export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
}) => {
  console.log('DocumentPreview render: ', document.id);

  const Render = useMemo(() => {
    if (!document || !document.metadata_  || !document.metadata_.source_type) {
      return EmptyRender
    }

    return fileRenders[document.metadata_.source_type] ?? IFramelyRender
  }, [document])
 
  return (
    <Render document={document} />
  );
}