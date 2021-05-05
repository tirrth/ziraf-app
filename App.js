import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import ApplicationWrapper from './src/components/ApplicationWrapper';
import {UserProvider} from './src/providers/UserProvider';
import {NotifyProvider} from './src/providers/NotifyProvider';

// function isFunction(functionToCheck) {
//   return (
//     functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
//   );
// }

export default App = () => {
  return (
    <Provider store={store}>
      <UserProvider>
        <NotifyProvider>
          <ApplicationWrapper>
            <AppNavigator />
          </ApplicationWrapper>
        </NotifyProvider>
      </UserProvider>
    </Provider>
  );
};
