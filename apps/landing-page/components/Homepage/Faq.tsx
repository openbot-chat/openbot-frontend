import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Heading,
	Flex,
	Stack,
} from '@chakra-ui/react'
import { TextLink } from 'components/common/TextLink'

export const Faq = () => {
	return (

		<Flex as="section" justify="center">

			<Stack
				style={{ maxWidth: '1200px' }}
				pt={40}
				w="full"
				px="4"
				spacing={24}
				justifyContent="space-between"
				alignItems="center"
			>

				<Stack spacing={6} w="full">
					<Heading as="h1" textAlign="center" data-aos="fade">
						FAQ
					</Heading>
				</Stack>

				<Accordion w="full" allowToggle defaultIndex={0}>
					<AccordionItem>
						<Heading as="h2">
							<AccordionButton py="6">
								<Box flex="1" textAlign="left" fontSize="2xl">
									What happens once I reach the monthly chats limit?
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</Heading>
						<AccordionPanel pb={4}>
							You will receive an email notification once you reached 80% of this
							limit. Then, once you reach 100%, the bot will be closed to new users.
							Upgrading your limit will automatically reopen the bot.
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem>
						<Heading as="h2">
							<AccordionButton py="6">
								<Box flex="1" textAlign="left" fontSize="2xl">
									What happens once I reach the storage limit?
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</Heading>
						<AccordionPanel pb={4}>
							You will receive an email notification once you reached 80% of this
							limit. Then, once you reach 100%, your users will still be able to
							chat with your bot but their uploads won&apos;t be stored anymore. You
							will need to upgrade the limit or free up some space to continue
							collecting your users&apos; files.
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem>
						<Heading as="h2">
							<AccordionButton py="6">
								<Box flex="1" textAlign="left" fontSize="2xl">
									If I change my mind, can I get a refund?
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</Heading>
						<AccordionPanel pb={4}>
							Sure! Just{' '}
							<TextLink href="mailto:service@openbot.chat">
								shoot me an email
							</TextLink>{' '}
							and we&apos;ll figure things out 😀
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</Stack>
		</Flex>


	)
}