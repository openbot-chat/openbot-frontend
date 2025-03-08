import {
  Stack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Badge,
} from '@chakra-ui/react';


export const Autonomous = () => {
  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader>
          <Heading size="md">
            Deep Thinking
            <Badge ml='1' colorScheme="green">Comming Soon...</Badge>
          </Heading>
        </CardHeader>
        <CardBody>
          Enable Agent to engage in deep thinking and enhance its ability to solve complex problems.
        </CardBody>
        <CardFooter>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader as={Flex} justifyContent="space-between">
          <Heading size="md">
            Self Learning
            <Badge ml='1' colorScheme="green">Comming Soon...</Badge>
          </Heading>
        </CardHeader>
        <CardBody>
          Enable Agent to self-learn and grow during interactions with users.
          Learn to provide services in a way that is tailored to user habits.
        </CardBody>
        <CardFooter>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader as={Flex} justifyContent="space-between">
          <Heading size="md">
            Collaboration
            <Badge ml='1' colorScheme="green">Comming Soon...</Badge>
          </Heading>
        </CardHeader>
        <CardBody>
          Enable Agent to work in teams and collaborate effectively. Each Agent has expertise in a specific field, and through collaboration, their ability to solve problems can be significantly enhanced..
        </CardBody>
        <CardFooter>
        </CardFooter>
      </Card>
    </Stack>
  );
};