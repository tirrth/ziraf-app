import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  fetchAppConfig,
  fetchUserDetail,
  setAppState,
  fetchAutocomplete,
} from '../../js/actions/actionCreators';
import {refreshAuthHeader} from './../../js/utils/zirafStorage';
import Splashscreen from 'react-native-splash-screen';
class ApplicationWrapper extends Component {
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
      fetchUserDetailData().finally(() => Splashscreen.hide());
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

export default connect(mapStateToProps, {
  fetchAppConfigData: fetchAppConfig,
  fetchUserDetailData: fetchUserDetail,
  setAppStateData: setAppState,
  fetchAutocompleteData: fetchAutocomplete,
})(ApplicationWrapper);
