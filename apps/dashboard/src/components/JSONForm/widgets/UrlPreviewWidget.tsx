import { Stack, Box } from '@chakra-ui/react'
import { WidgetProps, getUiOptions, getTemplate } from '@rjsf/utils'
import { IFramelyViewer } from '../../IFramelyViewer'


function isValidUrl (url: string) {
  return !!url && (url.startsWith('http://') || url.startsWith('https://'))
}

export const UrlPreviewWidget: React.FC<WidgetProps> = (props) => {
  const { uiSchema, registry } = props
  const options = getUiOptions(uiSchema)

  const BaseInputTemplate = getTemplate<"BaseInputTemplate">(
    "BaseInputTemplate",
    registry,
    options,
  )

  return (
    <Stack spacing={2}>
      <BaseInputTemplate type='url' {...props} />
      <Box w={options?.preview?.width ?? '100%'}>
        {isValidUrl(props.value) && <IFramelyViewer url={props.value} />}
      </Box>
    </Stack>
  );
}

