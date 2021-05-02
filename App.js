import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import ApplicationWrapper from './src/components/ApplicationWrapper';
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission({
    sound: true,
    announcement: true,
    badge: true,
    alert: true,
    carPlay: true,
    provisional: false,
    criticalAlert: false,
  });
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export default App = () => {
  useEffect(() => {
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new FCM Foreground message arrived!',
        JSON.stringify(remoteMessage),
      );
    });

    // When the application is opened from a quit state.
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available, when the application is running, but in the background.
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    return unsubscribe;
  });

  return (
    <Provider store={store}>
      <ApplicationWrapper>
        <AppNavigator />
      </ApplicationWrapper>
    </Provider>
  );
};
