import React, { ReactNode, useMemo } from 'react';
import { 
  HStack,
  Tag,
  TagLabel,
  Text,
} from '@chakra-ui/react';

import { RadioButtons } from '@/components/inputs';


export type CategoriesProps = {
  title: string;
  value?: string;
  options: (string | { value: string; label: ReactNode })[]
  onSelect?: (value: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  title,
  value,
  options: _options,
  onSelect,
}) => {
  const options = useMemo(() => [{ value: undefined, label: 'All' }, ..._options], [_options]);

  return (
    <HStack spacing={4} w="full" p={4}>
      <Text>{title}</Text>
      {options?.map(it => (
        <Tag 
          style={{
            cursor: "pointer",
          }}
          key={it.value} 
          size="md"
          colorScheme={value === it.value ? 'twitter' : ''}
          onClick={() => onSelect(it.value)}
        >
          {it.label}
        </Tag>
      ))}  
    </HStack>
  );
}