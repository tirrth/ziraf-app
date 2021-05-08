import AsyncStorage from '@react-native-async-storage/async-storage';

let baseConfig = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: null,
  },
};

let setAuthHeader = async () => {
  try {
    const token = await AsyncStorage.getItem('@Ziraf:accessToken');
    baseConfig.headers['Authorization'] = token;
  } catch (error) {
    // Error retrieving data
    //console.log('Error retrieving data' + error);
  }
};

setAuthHeader();

baseConfig.refreshAuthHeader = async () => {
  await setAuthHeader();
};

Object.assign(baseConfig, {
  // host: 'http://localhost:6001'
  // host: 'https://staging.api.zirafer.com'
  host: 'https://uat.api.zirafer.com',
  //host: 'https://3af7e16f12b2.ngrok.io',
});

export default baseConfig;
