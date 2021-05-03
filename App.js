import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import ApplicationWrapper from './src/components/ApplicationWrapper';
import {UserProvider} from './src/navigation/UserProvider';

// function isFunction(functionToCheck) {
//   return (
//     functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
//   );
// }

export default App = () => {
  return (
    <Provider store={store}>
      <UserProvider>
        <ApplicationWrapper>
          <AppNavigator />
        </ApplicationWrapper>
      </UserProvider>
    </Provider>
  );
};
