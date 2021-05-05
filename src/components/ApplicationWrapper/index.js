import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, PermissionsAndroid, Platform, Linking} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  fetchAppConfig,
  fetchUserDetail,
  setAppState,
  fetchAutocomplete,
} from '../../js/actions/actionCreators';
import {refreshAuthHeader} from './../../js/utils/zirafStorage';
import Splashscreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import BaseAjaxConfig from '../../js/actions/BaseAjaxConfig.js';
import {UserContext} from '../../navigation/UserProvider';
import Snackbar from 'react-native-snackbar';

function isNotifyPermissionEnabled(authStatus) {
  console.log('Authorization status:', authStatus);
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

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
  return isNotifyPermissionEnabled(authStatus);
}

function saveTokenToDatabase(deviceToken) {
  console.log('deviceToken =', deviceToken);
  const path = '/api/v1/restaurant/device-token';
  fetch(BaseAjaxConfig.host + path, {
    method: 'POST',
    headers: BaseAjaxConfig.headers,
    body: JSON.stringify({deviceToken}),
  })
    .then(response => {
      if (response) {
        return response.json();
      } else {
        console.log('Device Token API Error. Failed to fetch');
      }
    })
    .then(json => console.log(json))
    .catch(err => console.log('Device Token API Error. Failed to fetch'));
}

const redirectTo = redirection_link => {
  console.log('redirection_link=', redirection_link);
  Linking.canOpenURL(redirection_link)
    .then(canOpen => canOpen && Linking.openURL(redirection_link))
    .catch(err => console.log(err));
};

export const notificationListeners = async (orderNotifyContext = {}) => {
  const {setOrderId} = orderNotifyContext;
  return messaging()
    .hasPermission()
    .then(async authStatus => {
      let enabled = false;
      isNotifyPermissionEnabled(authStatus) && (enabled = true);
      if (!enabled) {
        enabled = await requestUserPermission();
      }

      if (enabled) {
        messaging()
          .getToken()
          .then(token => saveTokenToDatabase(token));

        const unsubscribeNotify = messaging().onMessage(async remoteMessage => {
          console.log('A new FCM Foreground message arrived!', remoteMessage);
          const order_id = remoteMessage?.data?.order_id;
          setOrderId(order_id);
          Snackbar.show({
            text: 'New order received',
            duration: Snackbar.LENGTH_LONG,
            action: {
              text: 'VIEW',
              textColor: '#F2910A',
              onPress: () =>
                order_id && redirectTo(`zirafapp://order/view/${order_id}`),
            },
          });
        });

        // When the application is opened from a quit state.
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
          );
          const order_id = remoteMessage?.data?.order_id;
          setOrderId(order_id);
          order_id && redirectTo(`zirafapp://order/view/${order_id}`);
        });

        // Check whether an initial notification is available, when the application is running, but in the background.
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log(
                'Notification caused app to open from quit state:',
                remoteMessage,
              );
              const order_id = remoteMessage?.data?.order_id;
              setOrderId(order_id);
              order_id && redirectTo(`zirafapp://order/view/${order_id}`);
            }
          });

        const unsubscribeRefreshDeviceToken = messaging().onTokenRefresh(
          async fcmToken => saveTokenToDatabase(fcmToken),
        );

        return {
          unsubscribeNotify,
          unsubRefreshToken: unsubscribeRefreshDeviceToken,
        };
      }
    })
    .catch(err => {
      throw err;
    });
};

class ApplicationWrapper extends Component {
  static contextType = UserContext;
  constructor(args) {
    super(args);
    this.state = {};
  }

  async componentDidMount() {
    const {
      fetchAppConfigData,
      setAppStateData,
      fetchAutocompleteData,
      fetchUserDetailData,
    } = this.props;

    refreshAuthHeader().then(() => {
      fetchUserDetailData()
        .then(res => {
          if (res?.data && typeof res.data === 'object') {
            console.log('userInfo:', res?.data);
            const userContext = this.context;
            userContext.setUserInfo(res.data);
            return;
          }
          console.log({error: 'You are Unauthenticated!'});
        })
        .catch(err => console.log(err))
        .finally(() => Splashscreen.hide());
    });

    fetchAppConfigData();

    let hasLocationPermission = false;
    if (Platform.OS === 'android') {
      hasLocationPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (
        !hasLocationPermission ||
        (PermissionsAndroid &&
          PermissionsAndroid.RESULTS &&
          PermissionsAndroid.RESULTS.DENIED)
      ) {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Ziraf App Location Permission',
              message:
                'Ziraf need to access location ' +
                'to recommend you restaurants nearby.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //console.log('You can use the location');
            hasLocationPermission = true;
          } else {
            //console.log('Location permission denied');
          }
        } catch (err) {
          //console.warn(err);
        }
      }
    } else {
      Geolocation.setRNConfiguration({
        skipPermissionRequests: true,
        authorizationLevel: 'whenInUse',
      });
      Geolocation.requestAuthorization();
      hasLocationPermission = true;
    }

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          setAppStateData('CURRENT_LOCATION', position);
        },
        error => {
          //console.log(error.code, error.message);
          setAppStateData('CURRENT_LOCATION', undefined);
        },
        {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
      );
    } else {
      //console.log('ACCESS_FINE_LOCATION permission denied');
      setAppStateData('CURRENT_LOCATION', undefined);
    }
    fetchAutocompleteData();
  }

  render() {
    return <View style={{flex: 1}}>{this.props.children}</View>;
  }
}

function mapStateToProps(state) {
  return {};
}

// ApplicationWrapper.contextType = UserContext; or inside class component -->  static contextType = UserContext;
export default connect(mapStateToProps, {
  fetchAppConfigData: fetchAppConfig,
  fetchUserDetailData: fetchUserDetail,
  setAppStateData: setAppState,
  fetchAutocompleteData: fetchAutocomplete,
})(ApplicationWrapper);
