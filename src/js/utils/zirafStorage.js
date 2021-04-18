import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseAjaxConfig from '../actions/BaseAjaxConfig.js';

const zirafStorage = {
  setAccessToken: async token => {
    try {
      await AsyncStorage.setItem('@Ziraf:accessToken', token);
      await BaseAjaxConfig.refreshAuthHeader();
    } catch (error) {
      // Error saving data
      //console.log("Error saving data" + error);
    }
  },
  refreshAuthHeader: async () => {
    try {
      await BaseAjaxConfig.refreshAuthHeader();
    } catch (error) {
      //console.log("Error in refreshAuthHeader");
    }
  },
  resetAccessToken: async () => {
    try {
      await AsyncStorage.removeItem('@Ziraf:accessToken');
      await BaseAjaxConfig.refreshAuthHeader();
    } catch (error) {
      //console.log("Error in resetAccessToken");
    }
  },
};

module.exports = zirafStorage;
