import React, { useState } from 'react';
import { VStack, Image, List, ListItem, Spinner, Button, useToast } from '@chakra-ui/react';

const TimelinePage = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const toast = useToast();

  const loadTimeline = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEvents(['Event 1', 'Event 2', 'Event 3']);
      toast({ title: 'Timeline loaded', status: 'success' });
    } catch (err) {
      toast({ title: 'Failed to load timeline', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Button onClick={loadTimeline} isDisabled={loading} alignSelf="start">
        {loading ? <Spinner size="sm" /> : 'Load Timeline'}
      </Button>
      {!loading && events.length > 0 && (
        <>
          <Image src="https://via.placeholder.com/400x100?text=Timeline" alt="Timeline" />
          <List spacing={2}>
            {events.map((e, i) => (
              <ListItem key={i}>{e}</ListItem>
            ))}
          </List>
        </>
      )}
    </VStack>
  );
};

export default TimelinePage;
