import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import ApplicationWrapper from './src/components/ApplicationWrapper';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ApplicationWrapper>
          <AppNavigator />
        </ApplicationWrapper>
      </Provider>
    );
  }
}
