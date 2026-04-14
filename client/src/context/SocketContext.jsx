import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const newSocket = io('http://localhost:5000');

    // Register user ID on connection
    newSocket.on('connect', () => {
      newSocket.emit('register', user.id);
    });

    // Listen for notifications
    newSocket.on('notification', (notif) => {
      setNotifications((prev) => [notif, ...prev]);

      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification('OffTime', { body: notif.message });
      }
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const addInitialNotifications = (notifs) => {
    setNotifications(notifs);
  };

  const markAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: 'read' }))
    );
  };

  return (
    <SocketContext.Provider
      value={{ socket, notifications, addInitialNotifications, markAsRead }}
    >
      {children}
    </SocketContext.Provider>
  );
};