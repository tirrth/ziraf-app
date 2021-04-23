import React from 'react';
import {FlatList, View, StyleSheet, TouchableOpacity} from 'react-native';
import LoadingIndicator from '../common/LoadingIndicator';
import Text from '../common/Text';
import moment from 'moment';
import OrderDetailsModal from './OrderDetailsModal';

class RejectedOrders extends React.Component {
  _renderOrder = ({item: data}) => {
    const _toggleOrderDetailsView = () => {
      data.toggle_modal = !data.toggle_modal;
      this.props._changeData(this.props.data);
    };
    const orderRejectedAt = moment(data.rejectedOn).format(
      'ddd, MMM D, h:mm A',
    );
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: '#2f3242',
          borderRadius: 4,
          padding: 10,
          marginBottom: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 0}}>
            {`Order Id: #${data.orderNo || ''}`}
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={_toggleOrderDetailsView}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 30,
              borderWidth: 0.6,
              borderColor: '#F2910A',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#F2910A', fontSize: 10}}>View</Text>
            {data.toggle_modal && (
              <OrderDetailsModal
                data={data}
                closeModal={_toggleOrderDetailsView}
              />
            )}
          </TouchableOpacity>
        </View>
        {orderRejectedAt && (
          <View>
            <Text style={{fontSize: 12, color: '#b0b0b0'}}>
              Rejected On: {orderRejectedAt}
            </Text>
          </View>
        )}
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>
            {data.totalQuantity} Items
          </Text>
        </View>
        <View>
          {Array.isArray(data.cartItems) &&
            data.cartItems.map((item, idx) => {
              return (
                <View key={idx}>
                  <Text
                    style={{
                      textTransform: 'capitalize',
                      color: '#b0b0b0',
                      fontSize: 13,
                    }}>
                    {`${item.quantity} - `}
                    {item.name || 'No Item name'}
                  </Text>
                </View>
              );
            })}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {data: rejectedOrders} = this.props;
    console.log('rejectedOrders=', rejectedOrders);
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={rejectedOrders.data}
          renderItem={this._renderOrder}
          keyExtractor={(data, index) => `${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 50}}
          ListFooterComponent={
            rejectedOrders.is_next_page && (
              <LoadingIndicator size={'small'} style={{padding: 4}} />
            )
          }
          onEndReached={() =>
            rejectedOrders.is_next_page && this.props._handleLoadMore()
          }
          onEndReachedThreshold={0.5}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  horizontalSeparator: {
    height: 0.8,
    width: '100%',
    marginVertical: 4,
    backgroundColor: '#e0e0e0',
  },
});

export default RejectedOrders;
