import { 
  Box, 
  Button, 
  ButtonGroup,
  Stack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { PropsWithChildren } from "react";
import { useMemo } from "react";



type Props = {
  isLoading?: boolean;
  trigger?: React.ReactElement;
  title?: string | React.ReactNode;
  message: string | React.ReactNode;
  confirmText?: string | null;
  confirmButtonLabel?: string | React.ReactNode;
  onConfirm?: () => Promise<void> | void;
  onClose?: () => void;
  isOpen?: boolean;
  onOpen?: () => void;
}

export const ConfirmModal: React.FC<PropsWithChildren<Props>> = ({
  isLoading,
  trigger,
  title,
  message,
  confirmText,
  onConfirm,
  confirmButtonLabel,
  onClose: propOnClose,
  isOpen: propIsOpen,
  onOpen: propOnOpen,
  children,
}) => {
  const t = useTranslations('confirmModal');
  const { 
    onClose: contextOnClose, 
    isOpen: contextIsOpen, 
    onOpen: contextOnOpen,
  } = useDisclosure();
  
  const onClose = propOnClose ?? contextOnClose;
  const isOpen = propIsOpen ?? contextIsOpen;
  const onOpen = propOnOpen ?? contextOnOpen;
  
  const [text, setText] = useState<string | undefined>(undefined);

  const onClick = (e) => {
    onOpen()
    e.preventDefault()
  }

  const triggerEle = useMemo(() => trigger && React.cloneElement(trigger, {
    onClick,
  }), [trigger, onOpen]);
  const cancelRef = React.useRef();

  return (
    <>
      {triggerEle ?? children}
      <AlertDialog onClose={onClose} isOpen={isOpen} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{title ?? t('defaultTitle')}</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody as={Stack}>
              <Box>{message}</Box>
              {confirmText && <Input placeholder={confirmText} value={text} onChange={(e) => setText(e.target.value)} />}
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup>
                <Button ref={cancelRef} onClick={onClose}>
                  {t("cancelBtnTxt")}
                </Button>
                <Button
                  isLoading={isLoading}
                  colorScheme='red'
                  isDisabled={!!confirmText && confirmText !== text}
                  onClick={async () => {
                    await onConfirm?.()
                    onClose()
                  }}
                >
                  {confirmButtonLabel ?? t("confirmButtonLabel")}
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}