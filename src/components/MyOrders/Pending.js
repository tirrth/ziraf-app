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
import moment from 'moment';
import OrderDetailsModal from './OrderDetailsModal';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {notifyMessage} from '.';

class PendingOrders extends React.Component {
  _renderOrder = ({item: data, index}) => {
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
            console.log('response1response1 =', res);
            if (is_accepted) {
              data.is_accepted = true;
              data.acceptedOn = new Date().toUTCString();
            } else {
              data.is_rejected = true;
              data.rejectedOn = new Date().toUTCString();
            }
          })
          .catch(err => {
            console.log(err);
            data.is_error = true;
          })
          .finally(() => {
            data[loader_key] = false;
            // const {data: pendingOrders} = this.props;
            // pendingOrders?.data?.splice?.(index, 1); // Removed card from pending tab
            // data.toggle_modal && (data.toggle_modal = false);
            // this.props._changeData(pendingOrders);
            // this.props._moveData(is_accepted, data);
            this.props._reloadData();
          });
      }
    };
    // const orderedAt = moment(data.createdAt).format('ddd, MMM D, h:mm A');
    const expectedDeliveryAt =
      data.deliveryTime &&
      data.deliveryDay &&
      `${moment(data.deliveryDay).format('DD/MM/YY')} ${data.deliveryTime}`;
    const is_accept_btn_disabled =
      data.toggle_reject_btn_loader || data.is_rejected || data.is_error;
    const is_reject_btn_disabled =
      data.toggle_accept_btn_loader || data.is_accepted || data.is_error;

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
          {data.is_error && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => notifyMessage('Error occurred. Try again!')}
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                backgroundColor: '#F2910A',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="exclamation" size={12} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        {!!expectedDeliveryAt && (
          <View>
            <Text style={{fontSize: 12, color: '#b0b0b0'}}>
              Pick Up: {expectedDeliveryAt}
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
        <View
          style={{
            flex: 1,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() =>
              __changeOrderStatus('toggle_accept_btn_loader', true)
            }
            disabled={data.is_accepted || is_accept_btn_disabled}
            style={{
              width: '30%',
              paddingVertical: 6,
              backgroundColor: is_accept_btn_disabled ? '#cccccc' : '#55B72D',
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {!data.is_accepted ? (
              <Text
                style={{
                  fontWeight: 'bold',
                  color: is_accept_btn_disabled ? '#666666' : '#ffffff',
                }}>
                {!data.toggle_accept_btn_loader ? 'Accept' : 'Accepting...'}
              </Text>
            ) : (
              <Text>Accepted</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() =>
              __changeOrderStatus('toggle_reject_btn_loader', false)
            }
            disabled={data.is_rejected || is_reject_btn_disabled}
            style={{
              width: '30%',
              paddingVertical: 6,
              backgroundColor: is_reject_btn_disabled ? '#cccccc' : '#DB4437',
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {!data.is_rejected ? (
              <Text
                style={{
                  fontWeight: 'bold',
                  color: is_reject_btn_disabled ? '#666666' : '#ffffff',
                }}>
                {!data.toggle_reject_btn_loader ? 'Reject' : 'Rejecting...'}
              </Text>
            ) : (
              <Text>Rejected</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={_toggleOrderDetailsView}
            style={{
              width: '30%',
              paddingVertical: 6,
              borderRadius: 30,
              borderWidth: 0.6,
              borderColor: '#F2910A',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#F2910A'}}>View</Text>
            {data.toggle_modal && (
              <OrderDetailsModal
                data={data}
                _changeOrderStatus={__changeOrderStatus}
                closeModal={_toggleOrderDetailsView}
              />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
          contentContainerStyle={{
            paddingBottom: 50,
            paddingHorizontal: 15,
          }}
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

const styles = StyleSheet.create({
  horizontalSeparator: {
    height: 0.8,
    width: '100%',
    marginVertical: 4,
    backgroundColor: '#e0e0e0',
  },
});

export default PendingOrders;
