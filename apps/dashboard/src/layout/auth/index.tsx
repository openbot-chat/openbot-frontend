import React from 'react';
import { Container } from '@chakra-ui/react';

const AuthLayout = ({ 
  children
}) => {
  const style = {
    background: `url('${process.env.STATIC_URL}/background-mask-20.png')`,
    backgroundSize: 'cover'
  };

  return (
    <Container style={style} w="full">
      {children}
    </Container>
  );
};

export default AuthLayout;