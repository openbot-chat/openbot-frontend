
import { Box } from '@chakra-ui/react'
import { Logo } from '@/assets/icons/Logo'



export const LogoWithRipple = () => {
  return (
    <Box 
      position="relative"
      top={0}
      borderRadius="50%" 
      padding="8px" 
    >
      <Box
        _hover={{ animation: 'spin 2s infinite linear' }}
        css={{ '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }}
      >
        <Logo fontSize={32} />
      </Box>
    </Box>
  );
}