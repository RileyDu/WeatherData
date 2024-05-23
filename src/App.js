// Libraries Import
import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,

} from '@chakra-ui/react';
import { SaasProvider } from '@saas-ui/react';

import { theme } from './Styling/theme';

// Files Import
import Dashboard from './Frontend/Dashboard';


function App() {
  return (
    <ChakraProvider theme={theme}>
      <Dashboard />
    </ChakraProvider>
  );
}

export default App;
