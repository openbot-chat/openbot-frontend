import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Stack,
  StackProps,
  HStack,
  Tooltip,
  chakra,
  Button,
  Heading,
} from '@chakra-ui/react'
import { CheckIcon } from 'assets/icons/CheckIcon'
import { HelpCircleIcon } from 'assets/icons/HelpCircleIcon'
import Link from 'next/link'
import React from 'react'

type Props = StackProps

export const PlanComparisonTables = (props: Props) => {
  return (
    <Stack spacing="12" {...props}>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th fontWeight="bold" color="white" w="400px">
                Plan
              </Th>
              <Th>Free</Th>
              <Th>Basic</Th>
              <Th>Pro</Th>
              <Th color="orange.200">Enterprise Standard</Th>
              <Th color="blue.200">Enterprise Custom</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              {/* <TdWithTooltip
                text="Agent Usage Limit "
                tooltip="Self-generated + Used Templates"
              /> */}
              <Td>Price</Td>
              <Td>$0</Td>
              <Td>$49/month</Td>
              <Td>$99/month</Td>
              <Td>$499/month</Td>
              <Td>Contact sales</Td>
            </Tr>
            <Tr>
              <Td>Agent</Td>
              <Td>1</Td>
              <Td>5</Td>
              <Td>10</Td>
              <Td>unlimited</Td>
              <Td>unlimited</Td>
            </Tr>
            <Tr>
              <Td>Dialouge</Td>
              <Td>100 chats/month</Td>
              <Td>5000 chats/month</Td>
              <Td>10000 chats/month</Td>
              <Td>50000 chats/month </Td>
              <Td>custom</Td>
            </Tr>
            <Tr>
              <Td>Voice Speech</Td>
              <Td></Td>
              <Td></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
            </Tr>
            <Tr>
              <Td>Image Generation</Td>
              <Td></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
            </Tr>
            <Tr>
              <Td>3D Avatar</Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
            </Tr>
            <Tr>
              <Td>Openbot Markeplace</Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
            </Tr>
            <Tr>
              <Td>Datastore</Td>
              <Td>1</Td>
              <Td>5</Td>
              <Td>20</Td>
              <Td>unlimited</Td>
              <Td>unlimited</Td>
            </Tr>
            <Tr>
              <Td>Vector Data Storage</Td>
              <Td>50 MB</Td>
              <Td>300 MB</Td>
              <Td>1 GB</Td>
              <Td>5 GB</Td>
              <Td>custom</Td>
            </Tr>
            <Tr>
              <Td>Accessibility</Td>
              <Td>50 MB</Td>
              <Td>300 MB</Td>
              <Td>1 GB</Td>
              <Td>5 GB</Td>
              <Td>custom</Td>
            </Tr>
            <Tr>
              <Td>Tools Plugin</Td>
              <Td>3</Td>
              <Td>20</Td>
              <Td>unlimited</Td>
              <Td>unlimited</Td>
              <Td>unlimited</Td>
            </Tr>
            <Tr>
              <Td>Autonomous tasks</Td>
              <Td></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
            </Tr>
            <Tr>
              <Td>Openbot API</Td>
              <Td></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
              <Td><CheckIcon /></Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

// const TdWithTooltip = ({
//   text,
//   tooltip,
// }: {
//   text: string
//   tooltip: string
// }) => (
//   <HStack as={Td}>
//     <Text>{text}</Text>
//     <Tooltip hasArrow placement="top" label={tooltip}>
//       <chakra.span cursor="pointer">
//         <HelpCircleIcon />
//       </chakra.span>
//     </Tooltip>
//   </HStack>
// )
