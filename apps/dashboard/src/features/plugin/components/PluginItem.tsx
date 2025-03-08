import { AIPlugin } from 'models';
import {
  Button,
  WrapItem,
  VStack,
  Avatar,
  Text,
} from '@chakra-ui/react';

type Props = {
  plugin: AIPlugin;
  onConnect?: (plugin: AIPlugin) => void;
}

export const PluginItem: React.FC<Props> = ({
  plugin,
  onConnect,
}) => {
  return (
    <WrapItem
      as={Button} 
      alignItems="center"
      style={{ width: '180px', height: '256px' }}
      whiteSpace={'normal'}
      p='12px'
    >
      <VStack h='full' w='full'>
        <VStack h='206px' w='full'>
          <Avatar name={plugin.name_for_human} src={plugin.logo} w='108px' h='108px' borderRadius={16}/>
          <Text>{plugin.name_for_model}</Text>
          <div style={{
            maxWidth: '100%',
            fontSize: '12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}>
            {plugin.description_for_model}
          </div>
        </VStack>
        <Button colorScheme="blue" onClick={() => onConnect?.(plugin)}>连接</Button>
      </VStack>
    </WrapItem>
  );
}