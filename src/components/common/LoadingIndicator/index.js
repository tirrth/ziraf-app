import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

export default class LoadingIndicator extends Component {
  render() {
    const {color, style, size} = this.props;
    return (
      <View style={[styles.container, styles.horizontal, style]}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }
}

LoadingIndicator.defaultProps = {
  size: 'large',
  color: '#f08f07',
  style: {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1d1d1c',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
