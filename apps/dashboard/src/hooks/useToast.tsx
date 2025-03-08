import { Toast, ToastProps } from '@/components/Toast'
import { useToast as useChakraToast } from '@chakra-ui/react'
import { useCallback } from 'react'

export const useToast = () => {
  const toast = useChakraToast({
    isClosable: true,
  })

  const showToast = useCallback(
    ({
      title,
      description,
      status = 'error',
      icon,
      primaryButton,
      secondaryButton,
    }: Omit<ToastProps, 'onClose'>) => {
      toast({
        position: 'top-right',
        duration: status === 'error' ? null : undefined,
        title,
        description,
        icon,
        status,
        /*
        render: ({ onClose }) => (
          <Toast
            title={title}
            description={description}
            status={status}
            icon={icon}
            onClose={onClose}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
          />
        ),
        */
      })
    },
    [toast]
  )

  return { showToast }
}
