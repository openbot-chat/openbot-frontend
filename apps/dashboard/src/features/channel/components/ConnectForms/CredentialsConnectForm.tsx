import { CredentialsSelect } from "@/features/credentials/components/CredentialsSelect"
import { FormControl, FormLabel, Portal, Stack } from "@chakra-ui/react"
import { Credentials } from "models"


type Props = {
  channel: any
  onSelect?: (item?: Credentials) => void
}

export const CredentialsConnectForm: React.FC<Props> = ({
  channel,
  onSelect,
}) => {
  return (
    <Stack spacing={4} p={2}>
      <FormControl>
        <FormLabel>Credentials</FormLabel>
        <CredentialsSelect type={channel.identifier} onSelect={(value, item) => onSelect?.(item)} />
      </FormControl>
    </Stack>
  )
}