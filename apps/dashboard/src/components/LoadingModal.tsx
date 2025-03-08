import { Center, Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react"
import { Loading } from '@/components/Loading'

type Props = {
  isOpen: boolean;
}

export const LoadingModal = ({
  isOpen,
}: Props) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Modal isOpen={isOpen} onClose={()=>{}} isCentered>
      <ModalOverlay 
        backdropFilter='auto'
        backdropInvert='80%'
        backdropBlur='2px'
      />
      <ModalContent bg='none' shadow="none">
        <ModalBody bg='none' as={Center}>
          <Loading isLoading={true} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
