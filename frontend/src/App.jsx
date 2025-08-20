import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Box, Flex, Heading, Spacer, Button } from '@chakra-ui/react';
import UploadPage from './components/UploadPage';
import TimelinePage from './components/TimelinePage';
import ChatPage from './components/ChatPage';

const App = () => (
  <Flex direction="column" minH="100vh">
    <Flex as="nav" bg="teal.500" color="white" p={4} wrap="wrap" gap={2}>
      <Heading size="md">Legal Suite</Heading>
      <Spacer />
      <Button as={Link} to="/upload" variant="ghost" colorScheme="whiteAlpha">Upload</Button>
      <Button as={Link} to="/timeline" variant="ghost" colorScheme="whiteAlpha">Timeline</Button>
      <Button as={Link} to="/chat" variant="ghost" colorScheme="whiteAlpha">Chat</Button>
    </Flex>
    <Box flex="1" p={4}>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Box>
  </Flex>
);

export default App;
