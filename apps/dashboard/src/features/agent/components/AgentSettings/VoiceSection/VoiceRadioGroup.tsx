import { Loading } from '@/components/Loading';
import {
  RadioGroup,
  Radio,
  Grid,
  HStack,
  Badge,
  RadioGroupProps,
} from '@chakra-ui/react';
import { Voice } from 'models';



type Props = {
  isLoading: boolean;
  voices: Voice[];
  value?: string;
  onChange?: (value: string) => void;
} & RadioGroupProps;

export const VoiceRadioGroup = ({
  isLoading,
  voices,
  value,
  onChange,
}: Props) => {
  return (
    <Loading isLoading={isLoading}>
      <RadioGroup value={value} onChange={onChange} w='full'>
        <Grid templateColumns="repeat(3, 1fr)" gap={6} w='full' h='full'>
          {voices.map((it: Voice) => (
            <HStack key={it.identifier}>
              <Radio value={it.identifier}>{it.name} - {it.language}</Radio>
              {it.is_cloned && (<Badge>Cloned</Badge>)}
            </HStack>
          ))}
        </Grid>
      </RadioGroup>
    </Loading>
  );
}