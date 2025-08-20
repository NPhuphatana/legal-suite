import React, { useState } from 'react';
import { VStack, Input, Button, Box, Text, Spinner, useToast } from '@chakra-ui/react';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      setLoading(true);
      const userMessage = { sender: 'user', text: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      await new Promise((resolve) => setTimeout(resolve, 800));
      const botMessage = { sender: 'bot', text: `Echo: ${userMessage.text}` };
      setMessages((prev) => [...prev, botMessage]);
      toast({ title: 'Message sent', status: 'success' });
    } catch (err) {
      toast({ title: 'Message failed', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box flex="1" border="1px" borderColor="gray.200" p={4} overflowY="auto" h="300px">
        {messages.map((msg, idx) => (
          <Text key={idx} textAlign={msg.sender === 'user' ? 'right' : 'left'}>
            {msg.text}
          </Text>
        ))}
      </Box>
      <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" />
      <Button onClick={sendMessage} isDisabled={loading}>
        {loading ? <Spinner size="sm" /> : 'Send'}
      </Button>
    </VStack>
  );
};

export default ChatPage;
