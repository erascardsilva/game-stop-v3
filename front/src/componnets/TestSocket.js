import React, { useEffect, useState } from 'react';
import socket from '../utils/socket';

function TestSocket() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('testEvent', (data) => {
      setMessage(data.message);
    });

    return () => {
      socket.off('testEvent');
    };
  }, []);

  return <div>{message}</div>;
}

export default TestSocket;
