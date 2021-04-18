import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
// import {HeaderHeightContext} from '@react-navigation/stack';
// import { Header } from 'react-navigation';
// import {useHeaderHeight} from '@react-navigation/stack';

const headerHeight = 80;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ModalWrapper extends Component {
  constructor(args) {
    super(args);
    this.state = {
      modalX: new Animated.Value(-deviceHeight),
    };
  }

  openModal() {
    Animated.timing(this.state.modalX, {
      duration: 300,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }

  closeModal() {
    const {modalX} = this.props;
    Animated.timing(modalX, {
      duration: 300,
      toValue: -deviceHeight,
      useNativeDriver: false,
    }).start();
  }

  render() {
    const {modalX, fullHeight} = this.props;

    return (
      <View style={styles.container}>
        {/* <HeaderHeightContext>
          {headerHeight => ( */}
        <Animated.View
          style={[
            styles.modal,
            // {height: deviceHeight - headerHeight - 83},
            {transform: [{translateX: modalX}]},
            fullHeight ? {height: deviceHeight} : {},
          ]}
          onPress={this.closeModal.bind(this)}>
          <TouchableWithoutFeedback onPress={this.closeModal.bind(this)}>
            <View
              style={{
                backgroundColor: 'transparent',
                flex: 1,
                justifyContent: 'center',
              }}>
              {this.props.children}
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
        {/* )}
        </HeaderHeightContext> */}
      </View>
    );
  }
  s;
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'absolute',
  },
  button: {
    backgroundColor: 'green',
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
  },
  modal: {
    flex: 1,
    zIndex: 1,
    height: deviceHeight - headerHeight - 83,
    width: deviceWidth,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
});

export default ModalWrapper;
