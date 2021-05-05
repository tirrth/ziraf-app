import React, {createContext, useState} from 'react';
export const NotifyContext = createContext({});
export const NotifyProvider = ({children}) => {
  const [orderId, setOrderId] = useState(null);
  const [deviceToken, setDeviceToken] = useState('');
  const notifyContext = React.useMemo(() => {
    return {
      orderId,
      setOrderId,
      deviceToken,
      setDeviceToken,
    };
  });
  return (
    <NotifyContext.Provider value={notifyContext}>
      {children}
    </NotifyContext.Provider>
  );
};
