import React, {createContext, useState} from 'react';
export const OrderNotifyContext = createContext({});
export const OrderNotifyProvider = ({children}) => {
  const [orderId, setOrderId] = useState(null);
  const orderNotifyContext = React.useMemo(() => {
    return {
      orderId,
      setOrderId,
    };
  });
  return (
    <OrderNotifyContext.Provider value={orderNotifyContext}>
      {children}
    </OrderNotifyContext.Provider>
  );
};
