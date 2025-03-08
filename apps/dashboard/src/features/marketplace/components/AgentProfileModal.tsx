import React, { useState, useEffect } from 'react';

import {
  Flex,
  Button,
  HStack,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Card,
  Stack,
  Avatar,
  Tag,
  Divider,
  Text,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  CardHeader,
  CardBody,
} from '@chakra-ui/react'
import { Agent, AgentTool } from 'models'
import { useTranslations } from 'next-intl';

type Props = {
  agent?: Agent
  isOpen: boolean
  onClose: () => void
}

export const AgentProfileModal: React.FC<Props> = ({
  agent,
  isOpen,
  onClose,
}) => {
  const scopedT = useTranslations('agent.agentProfileModal')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent h="3xl">
        <ModalHeader>
          {scopedT('title')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex pb={4} direction="row">
            <Card p={4} w="300px">
              <Stack spacing={4}>
                <VStack spacing={2}>
                  <Avatar name={agent?.name} src={agent?.avatar?.thumbnail} w="96px" h="96px" />
                  <Heading size="sm">{agent?.name}</Heading>
                  <Text fontSize="xs" noOfLines={3}>{agent?.description}</Text>
                  <HStack spacing={2}>
                    <Tag colorScheme="orange"  variant="solid">Market</Tag>
                    <Tag colorScheme="orange"  variant="solid">Tools</Tag>
                  </HStack>
                </VStack>
                <Divider/>
                <Stack spacing={4}>
                  <Accordion allowMultiple>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex='1' textAlign='left'>
                            <Heading size="sm">{scopedT('tools.title')}({agent?.tools?.length})</Heading>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Stack spacing={2}>
                          {agent?.tools?.map((it, i) => (
                            <AgentToolItem key={i} agentTool={it} />
                          ))}
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Stack>
              </Stack>
            </Card>
            <Stack ml={4} flex={1}>
              <Card>
                <CardHeader>
                  <Heading size='sm'>{scopedT('userGuide.title')}</Heading>
                </CardHeader>
                <CardBody>
                  <Text>How to use this agent</Text>
                </CardBody>
              </Card>
            </Stack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}



const AgentToolItem = ({
  agentTool
}: {
  agentTool: AgentTool
}) => (
  <Stack spacing={2}>
    <Heading size="sm">{agentTool.name ?? agentTool.tool?.name}</Heading>
    <Text fontSize="xs" noOfLines={3}>{agentTool?.description ?? agentTool.tool?.description}</Text>
  </Stack>
)