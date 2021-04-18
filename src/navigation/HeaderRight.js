import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';

class HeaderRight extends Component {
  constructor(args) {
    super(args);
    this.state = {};
  }

  render() {
    const {navState, navigation, appState} = this.props;
    let activeState = false;
    if (navState && navState.routeName === 'FilterList') {
      activeState = true;
    }
    if (
      appState &&
      appState.SHOW_FILTER_VIEW === true &&
      navigation.state.routeName === 'Home'
    ) {
      activeState = true;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(
            navState && navState.routeName === 'FilterList'
              ? 'RestaurantList'
              : 'FilterList',
          );
        }}
        style={{
          flex: 1,
          justifyContent: 'center',
          marginRight: 8,
        }}>
        {activeState ? (
          <Image
            source={require('../images/icons/filter_settings_active.png')}
            style={styles.filterIcon}
          />
        ) : (
          <Image
            source={require('../images/icons/filter_settings.png')}
            style={styles.filterIcon}
          />
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  filterIcon: {
    height: 22,
    resizeMode: 'contain',
  },
});

function mapStateToProps(state) {
  return {
    appState: state.appState,
  };
}

export default connect(mapStateToProps, {})(HeaderRight);
