import React, { useState, useEffect } from 'react'
import {
  Fade,
  Flex,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { useDrag } from '@use-gesture/react'
import { ResizeHandle } from './ResizeHandle'
import { PreviewDrawerBody } from './PreviewDrawerBody'
import { useAgent } from '@/features/agent/providers/AgentProvider'


export const PreviewDrawer = () => {
  const [width, setWidth] = useState(400)
  const [isResizeHandleVisible, setIsResizeHandleVisible] = useState(false)
  const [restartKey, setRestartKey] = useState(0) // 暂时没有用
  const { agent } = useAgent()

  useEffect(() => {
    // setRestartKey((key) => key + 1)
    console.warn('agent changed')
  }, [agent])

  const useResizeHandleDrag = useDrag(
    (state) => {    
      setWidth(-state.offset[0])
    },
    {
      from: () => [-width, 0],
    }
  )

  return (
    <Flex
      h="full"
      w={`${width}px`}
      minW="300px"
      bgColor={useColorModeValue('white', 'gray.800')}
      shadow="lg"
      onMouseOver={() => setIsResizeHandleVisible(true)}
      onMouseLeave={() => setIsResizeHandleVisible(false)}
      p="0"
      pos="relative"
      zIndex={1}
    >
      <Fade in={isResizeHandleVisible}>
        <ResizeHandle
          {...useResizeHandleDrag()}
          pos="absolute"
          left="-7.5px"
          top={`calc(50% - ${56}px)`}
        />
      </Fade>
      <VStack w="full" spacing={4}>
        {agent && <PreviewDrawerBody />}
      </VStack>
    </Flex>
  );
}