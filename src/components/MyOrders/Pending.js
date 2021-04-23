import React from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import LoadingIndicator from '../common/LoadingIndicator';
import Text from '../common/Text';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import moment from 'moment';

class PendingOrders extends React.Component {
  _renderOrder = ({item: data}) => {
    const _toggleOrderDetailsView = () => {
      data.toggle_modal = !data.toggle_modal;
      this.props._changeData(this.props.data);
    };

    const __changeOrderStatus = (loader_key, is_accepted) => {
      if (!data[loader_key]) {
        data[loader_key] = true;
        this.props._changeData(this.props.data);
        this.props
          ._changeOrderStatus(data._id, is_accepted)
          .then(res => {
            console.log(res);
            if (is_accepted) data.is_accepted = true;
            else data.is_rejected = true;
          })
          .catch(err => {
            console.log(err);
            data.is_error = true;
          })
          .finally(() => {
            data[loader_key] = false;
            this.props._changeData(this.props.data);
          });
      }
    };
    // const createdAtDate = data.createdAt?.split?.('T')?.[0];
    // data.createdAt?.split?.('T')?.[1]?.split?.('.')?.[0]?.split?.(':')?.pop?.();
    // let createdAtTime = data.createdAt
    //   ?.split?.('T')?.[1]
    //   ?.split?.('.')?.[0]
    //   ?.split?.(':');
    // createdAtTime?.pop?.();
    // createdAtTime = createdAtTime?.join?.(':');
    const orderedAt = moment(data.createdAt).format('ddd, MMM D, h:mm A');

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          // backgroundColor: '#131419',
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

          {/* {data.amount && (
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                letterSpacing: 1,
              }}>
              €{data.amount}
            </Text>
          )} */}
        </View>
        <View>
          {/* <Text style={{fontSize: 12, color: '#b0b0b0'}}>
            Ordered on {orderedAt}
          </Text> */}
          <Text style={{fontSize: 12, color: '#b0b0b0'}}>
            Pick Up: {orderedAt}
          </Text>
        </View>
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
          {/* <Text style={{fontSize: 12, color: '#b0b0b0'}}>
            Expected delivery on {orderedAt}
          </Text> */}
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

        {/* <View
          style={{
            ...styles.horizontalSeparator,
            // backgroundColor: 'rgba(242,145,10, 0.2)',
            backgroundColor: '#454545',
            // marginTop: 10,
          }}
        /> */}
        {/* <Text style={{fontSize: 12, color: '#b0b0b0', marginBottom: 6}}>
          Expected delivery on {orderedAt}
        </Text> */}
        <View
          style={{
            flex: 1,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '30%',
              paddingVertical: 6,
              backgroundColor: '#4285F4',
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Accept</Text>
          </View>
          <View
            style={{
              width: '30%',
              paddingVertical: 6,
              backgroundColor: '#DB4437',
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Reject</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={_toggleOrderDetailsView}
            style={{
              width: '30%',
              paddingVertical: 6,
              borderRadius: 4,
              borderWidth: 0.6,
              borderColor: '#F2910A',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#F2910A'}}>View</Text>
            {data.toggle_modal && (
              <OrderDetailsModal closeModal={_toggleOrderDetailsView} />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {data: pendingOrders} = this.props;
    console.log('pendingOrders=', pendingOrders);
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

const OrderDetailsModal = props => {
  return (
    <Modal visible onRequestClose={props.closeModal} animationType="slide">
      <View style={{flex: 1}}>
        <Text style={{color: '#b0b0b0'}}>
          hewjhhjweehwjwehjwejhjewewhjjhewewhewhjewhjehjewjwejehjewjhewhjewhjjhewjhewhj
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  horizontalSeparator: {
    height: 0.8,
    width: '100%',
    marginVertical: 4,
    backgroundColor: '#e0e0e0',
  },
});

export default PendingOrders;
