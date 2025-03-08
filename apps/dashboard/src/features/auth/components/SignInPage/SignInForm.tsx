import { useTranslations } from 'next-intl';
import { 
  FormControl, 
  FormLabel,
  Input,
  Button,
  VStack,
} from '@chakra-ui/react';


export type SignFormData = Record<string, any>;

export type SignInFormProps = {
  onSendVCode: ({ phone_number, country_code }) => void;
  onSignIn: (data: SignFormData) => void;
}

export default function SignInForm({
  onSendVCode,
  onSignIn,
}: SignInFormProps) {
  const t = useTranslations();

  const handleSendVCode = () => {
    const { phone_number, country_code } = form.getFieldsValue();
    onSendVCode({ phone_number, country_code });
  };

  return (
    <VStack onSubmit={onSignIn}>
      <FormControl>
        <FormLabel>请输入手机号码</FormLabel>
        <Input placeholder="请输入手机号码" />
      </FormControl>
      <Button>
        {t('login.btn')}
      </Button>
    </VStack>
  );
}