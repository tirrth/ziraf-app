import React from 'react';
import {View} from 'react-native';
import Text from '../common/Text';

class RejectedOrders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hey: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({hey: true});
    }, 800);
  }
  render() {
    return (
      <View>
        <Text>{this.state.hey ? 'Rejected' : 'Rejected Changes'}</Text>
      </View>
    );
  }
}

export default RejectedOrders;
