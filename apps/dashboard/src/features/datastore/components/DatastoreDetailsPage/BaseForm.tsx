import {
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Tooltip,
  Flex,
  Input,
  RadioGroup,
  Radio,
  HStack,
  useClipboard,
  FormErrorMessage,
  Button,
  Box,
  Textarea,
} from '@chakra-ui/react';
import { trpc } from '@/utils/trpc-client';
import { useToast } from '@/hooks/useToast'
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { Datastore, updateDatastoreSchema } from 'models';
import { useTranslations } from 'next-intl';
import { toFormikValidationSchema } from "@artizon/zod-formik-adapter";
import { FaCheck } from 'react-icons/fa';

type Props = {
  datastore?: Datastore;
}

export const BaseForm = ({
  datastore,
}: Props) => {
  const t = useTranslations();
  const trpcContext = trpc.useContext();
  const { showToast } = useToast();

  const updateDatastoreMutation = trpc.datastore.update.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.datastore.list.invalidate();
      trpcContext.datastore.details.invalidate();
      showToast({ status: 'success', description: '保存成功' });
    },
  });
  
  const formik = useFormik<Datastore>({
    initialValues: datastore ?? {},
    validationSchema: () => toFormikValidationSchema(updateDatastoreSchema),
    onSubmit: async (values) => {
      console.log('values: ', values);
      await updateDatastoreMutation.mutateAsync(values);
    },
  });

  const { onCopy, setValue, hasCopied } = useClipboard("");
  useEffect(() => {
    setValue(datastore?.id);
  }, [datastore]);

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <VStack w="full" spacing={8}>
        <FormControl>
          <FormLabel>{t('datastore.id')}</FormLabel>
          <Flex 
            bg='gray.400' 
            w='100%' 
            p={3}
            borderRadius="6" 
            color='white' 
            cursor="pointer"
            onClick={onCopy}
            alignItems="center"
            justifyContent="space-between"
          >
            {datastore?.id}
            {hasCopied && (
              <Tooltip label={'Copied'} defaultIsOpen placement="top" hasArrow>
                <Box>
                  <FaCheck color="green.500" />
                </Box>
              </Tooltip>
            )}
          </Flex>
        </FormControl>
        <FormControl>
          <FormLabel>{t('datastore.provider')}</FormLabel>
          <Input value={formik.values.provider} readonly={true} />
          <FormHelperText>
            Vectorstore Provider
          </FormHelperText>
        </FormControl>
        <FormControl isRequired isInvalid={formik.touched.name_for_model && formik.errors.name_for_model}>
          <FormLabel>{t('datastore.name')}</FormLabel>
          <Input name="name_for_model" value={formik.values.name_for_model} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          <FormErrorMessage>{formik.errors.name_for_model}</FormErrorMessage>
          <FormHelperText>
            e.g.: Nuclear Fusion latest research papers
          </FormHelperText>
        </FormControl>
        <FormControl isRequired isInvalid={formik.touched.description_for_model && formik.errors.description_for_model}>
          <FormLabel>{t('datastore.description')}</FormLabel>
          <Textarea name="description_for_model" value={formik.values.description_for_model} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          <FormErrorMessage>{formik.errors.description_for_model}</FormErrorMessage>
          <FormHelperText>
            e.g.: Used to answer questions about doc
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>{t('datastore.visibility')}</FormLabel>
          <RadioGroup as={HStack} name="visibility" handleChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.visibility}>
            <Radio value="public">{t('datastore.public')}</Radio>
            <Radio value="private">{t('datastore.private')}</Radio>
          </RadioGroup>
        </FormControl>
        <Button isLoading={updateDatastoreMutation.isLoading} colorScheme="twitter" type="submit">Save</Button>
      </VStack>
    </form>
  );
}