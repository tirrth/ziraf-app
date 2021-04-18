import React from 'react';
import {FlatList, View} from 'react-native';
import LoadingIndicator from '../common/LoadingIndicator';
import Text from '../common/Text';

class PendingOrders extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderOrder = ({item: data}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 4,
          padding: 10,
          marginBottom: 15,
        }}>
        <View>
          <Text
            style={{
              color: 'black',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            {data.order_title || 'No Title'}
          </Text>
        </View>
        <View
          style={{
            marginTop: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1}}>
            {Array.isArray(data.items) &&
              data.items.map((item, idx) => {
                return (
                  <Text key={idx} style={{color: 'black', fontSize: 15}}>
                    {item.quantity || 0} - {item.name || 'No name'}
                  </Text>
                );
              })}
          </View>
          <View style={{flex: 1}}>
            <Text style={{color: 'black'}}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 16}}>
                Delivery Time:{' '}
              </Text>
              {`${data.delivery_time}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {data: pendingOrders} = this.props;
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={pendingOrders.data}
          renderItem={this._renderOrder}
          keyExtractor={(data, index) => `${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 50}}
          ListFooterComponent={
            pendingOrders.is_next_page && (
              <LoadingIndicator size={'small'} style={{padding: 4}} />
            )
          }
          onEndReached={() =>
            pendingOrders.is_next_page && this.props._handleLoadMore()
          }
          onEndReachedThreshold={0.5}
        />
      </View>
    );
  }
}

export default PendingOrders;
