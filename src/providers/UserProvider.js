import React, {createContext, useState} from 'react';
export const UserContext = createContext({});
export const UserProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const userContext = React.useMemo(() => {
    return {
      userInfo,
      setUserInfo,
      changeUserInfo: user_info => setUserInfo({...userInfo, ...user_info}),
      isAdmin: () => {
        if (!userInfo) {
          return false;
        }
        let isAdmin = false;
        if (Array.isArray(userInfo.roles)) {
          userInfo.roles.forEach(role => {
            if (role.alias === 'restaurantOwner') {
              isAdmin = true;
            }
          });
        }
        return isAdmin;
      },
    };
  });

  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};
