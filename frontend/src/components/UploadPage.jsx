import React, { useState } from 'react';
import { VStack, Input, Button, Text, Spinner, useToast } from '@chakra-ui/react';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleUpload = async () => {
    if (!file) {
      toast({ title: 'No file selected', status: 'error' });
      return;
    }
    try {
      setLoading(true);
      setStatus('Uploading...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('Upload successful');
      toast({ title: 'File uploaded', status: 'success' });
    } catch (err) {
      toast({ title: 'Upload failed', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <Button onClick={handleUpload} isDisabled={loading}>
        {loading ? <Spinner size="sm" /> : 'Upload'}
      </Button>
      {status && <Text>{status}</Text>}
    </VStack>
  );
};

export default UploadPage;
