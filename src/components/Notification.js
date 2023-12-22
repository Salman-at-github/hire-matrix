import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { onMessageListener, requestPermission } from '../config/firebase';

const Notification = () => {
  const [notification, setNotification] = useState({ title: '', body: '' });

  useEffect(() => {
    const setupMessageListener = async () => {
      await requestPermission(); // Wait for permission to be granted

      onMessageListener()
        .then((payload) => {
          console.log('Worked! 000000 ', payload);
          setNotification({ title: payload?.notification.title, body: payload?.notification.body });

          // Manually create a new toast whenever a new notification is received
          toast.success(<ToastDisplay />, {
            style: {
              background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
              color: '#fff',
            },
          });
        })
        .catch(err => console.log('Notif failed: ', err));
    };

    setupMessageListener();
  }, []);

  function ToastDisplay() {
    return (
      <div>
        <p><b>{notification?.title}</b></p>
        <p>{notification?.body}</p>
      </div>
    );
  }

  return <Toaster />;
};

export default Notification;
