import {
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import * as React from 'react'
// import { useEffect, useState } from 'react'
// import { formatPrice } from '@openbot/lib/pricing'
import { CheckCircleIcon } from '../../../assets/icons/CheckCircleIcon'
import { Card, CardProps } from './Card'

export interface PricingCardData {
  features: React.ReactNode[]
  name: string
  price: number | string
  featureLabel?: string
}

interface PricingCardProps extends CardProps {
  data: PricingCardData
  icon?: JSX.Element
  button: React.ReactElement
}

export const PricingCard = ({
  data,
  icon,
  button,
  ...rest
}: PricingCardProps) => {
  const { features, price, name } = data
  // const [formattedPrice, setFormattedPrice] = useState(price)
  const accentColor = useColorModeValue('blue.500', 'white')

  // useEffect(() => {
  //   setFormattedPrice(typeof price === 'number' ? formatPrice(price) : price)
  // }, [price])

  return (
    <Card rounded="xl" bgColor="gray.800" {...rest}>
      <Flex justifyContent="space-between" flexDir="column" h="full">
        <Flex flexDir="column">
          <VStack spacing={6}>
            {icon}
            <Heading size="md" fontWeight="extrabold" color={rest.borderColor}>
              {name}
            </Heading>
          </VStack>
          <Flex
            align="flex-end"
            justify="center"
            fontWeight="extrabold"
            color={accentColor}
            my="8"
          >
            <Heading size="2xl" fontWeight="inherit" lineHeight="0.9em">
              {/* {formattedPrice} */}
            </Heading>
            {typeof price === 'number' && (
              <Text fontWeight="inherit" fontSize="xl">
                / month
              </Text>
            )}
          </Flex>

          <List spacing="4" mb="8" maxW="30ch" mx="auto">
            {data.featureLabel && (
              <Text fontWeight="bold">{data.featureLabel}</Text>
            )}
            {features.map((feature, index) => (
              <ListItem
                fontWeight="medium"
                key={index}
                display="flex"
                alignItems="center"
              >
                <ListIcon
                  fontSize="xl"
                  as={CheckCircleIcon}
                  marginEnd={2}
                  color={accentColor}
                  fill={rest.borderColor}
                />
                {feature}
              </ListItem>
            ))}
          </List>
        </Flex>

        {button}
      </Flex>
    </Card>
  )
}
