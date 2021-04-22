import React from 'react';
import {FlatList, View, StyleSheet, TouchableOpacity} from 'react-native';
import LoadingIndicator from '../common/LoadingIndicator';
import Text from '../common/Text';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

class PendingOrders extends React.Component {
  _renderOrder = ({item: data}) => {
    const _toggleCard = () => {
      data.is_expanded = !data.is_expanded;
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
    const createdAtDate = data.createdAt?.split?.('T')?.[0];
    data.createdAt?.split?.('T')?.[1]?.split?.('.')?.[0]?.split?.(':')?.pop?.();
    let createdAtTime = data.createdAt
      ?.split?.('T')?.[1]
      ?.split?.('.')?.[0]
      ?.split?.(':');
    createdAtTime?.pop?.();
    createdAtTime = createdAtTime?.join?.(':');

    return (
      <TouchableOpacity
        onPress={_toggleCard}
        activeOpacity={1}
        style={{
          backgroundColor: 'white',
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
          <Text
            style={{
              color: 'black',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            {`Order ${data.orderNo || ''}`}
          </Text>

          {data.amount && (
            <Text
              style={{
                color: 'black',
                textTransform: 'capitalize',
                fontSize: 17,
                letterSpacing: 1,
              }}>
              Rs. {data.amount}
            </Text>
          )}
        </View>
        <View style={{...styles.horizontalSeparator}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1}}>
            {Array.isArray(data.cartItems) &&
              data.cartItems.map((item, idx) => {
                return (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 15,
                        textTransform: 'capitalize',
                      }}>
                      {`(${item.quantity})`} {item.name || 'No Item name'}
                    </Text>
                    <Text style={{color: 'black'}}>
                      Rs. {item.price * (item.quantity || 1)}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
        <View style={{...styles.horizontalSeparator}} />
        <View>
          {!data.is_expanded ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{flex: 1, marginTop: 4}}>
                <TouchableOpacity
                  onPress={_toggleCard}
                  activeOpacity={0.4}
                  style={{
                    height: 22,
                    width: 22,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#4285F4',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#4285F4',
                      marginTop: -2,
                    }}>
                    i
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 6,
                }}>
                {data.is_error && (
                  <View
                    style={{
                      backgroundColor: '#FFCC00',
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 4,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text>Try Again!</Text>
                  </View>
                )}
                {!data.is_error &&
                  !data.is_accepted &&
                  !data.toggle_accept_btn_loader && (
                    <TouchableOpacity
                      activeOpacity={
                        data.toggle_reject_btn_loader || data.is_rejected
                          ? 1
                          : 0.6
                      }
                      onPress={() =>
                        !data.is_rejected &&
                        __changeOrderStatus('toggle_reject_btn_loader', false)
                      }
                      style={{
                        backgroundColor: '#DB4437',
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text>
                        {data.is_rejected
                          ? 'Rejected!'
                          : data.toggle_reject_btn_loader
                          ? 'Rejecting'
                          : 'Reject'}
                      </Text>
                      {data.toggle_reject_btn_loader && (
                        <LoadingIndicator
                          size={15}
                          color="white"
                          style={{
                            height: 15,
                            width: 15,
                            marginLeft: 4,
                            backgroundColor: 'transparent',
                            flex: 0,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                {!data.is_error &&
                  !data.is_rejected &&
                  !data.toggle_reject_btn_loader && (
                    <TouchableOpacity
                      activeOpacity={
                        data.toggle_accept_btn_loader || data.is_accepted
                          ? 1
                          : 0.6
                      }
                      onPress={() =>
                        !data.is_accepted &&
                        __changeOrderStatus('toggle_accept_btn_loader', true)
                      }
                      style={{
                        marginLeft: 10,
                        backgroundColor: '#4285F4',
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text>
                        {data.is_accepted
                          ? 'Accepted!'
                          : data.toggle_accept_btn_loader
                          ? 'Accepting'
                          : 'Accept'}
                      </Text>
                      {data.toggle_accept_btn_loader && (
                        <LoadingIndicator
                          size={15}
                          color="white"
                          style={{
                            height: 15,
                            width: 15,
                            backgroundColor: 'transparent',
                            flex: 0,
                            marginLeft: 4,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                paddingTop: 3,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1}}>
                {createdAtTime && (
                  <View
                    style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        flexShrink: 1,
                      }}>
                      Time:{' '}
                    </Text>
                    <Text style={{color: 'black', flexShrink: 1}}>
                      {createdAtTime}
                    </Text>
                  </View>
                )}
                {createdAtDate && (
                  <View
                    style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        flexShrink: 1,
                      }}>
                      Date:{' '}
                    </Text>
                    <Text style={{color: 'black', flexShrink: 1}}>
                      {createdAtDate}
                    </Text>
                  </View>
                )}

                {data.customerName && (
                  <View
                    style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        flexShrink: 1,
                      }}>
                      Name:{' '}
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        flexShrink: 1,
                        textTransform: 'capitalize',
                      }}>
                      {data.customerName}
                    </Text>
                  </View>
                )}

                {data.email && (
                  <View
                    style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        flexShrink: 1,
                      }}>
                      Email:{' '}
                    </Text>
                    <Text style={{color: 'black', flexShrink: 1}}>
                      {data.email}
                    </Text>
                  </View>
                )}

                {data.customerPhone && (
                  <View
                    style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        flexShrink: 1,
                      }}>
                      Phone:{' '}
                    </Text>
                    <Text style={{color: 'black', flexShrink: 1}}>
                      {data.customerPhone}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  // flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 8,
                }}>
                {data.is_error ? (
                  <TouchableOpacity
                    style={{
                      height: 38,
                      width: 38,
                      borderRadius: 19,
                      backgroundColor: '#FFCC00',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name="exclamation" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      activeOpacity={
                        data.toggle_reject_btn_loader || data.is_rejected
                          ? 1
                          : 0.6
                      }
                      onPress={() =>
                        !data.is_rejected &&
                        __changeOrderStatus('toggle_reject_btn_loader', false)
                      }
                      style={{
                        // height: 34,
                        // width: 34,
                        // borderRadius: 17,
                        height: 38,
                        width: 38,
                        borderRadius: 19,
                        borderWidth: 2,
                        borderColor: '#DB4437',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {!data.toggle_reject_btn_loader ? (
                        <Icon
                          style={{marginTop: -1}}
                          name="times"
                          size={18}
                          color="#DB4437"
                        />
                      ) : (
                        <LoadingIndicator
                          size={16}
                          color="#DB4437"
                          style={{
                            height: 15,
                            width: 15,
                            backgroundColor: 'transparent',
                            flex: 0,
                            marginTop: -1,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={
                        data.toggle_accept_btn_loader || data.is_accepted
                          ? 1
                          : 0.6
                      }
                      onPress={() =>
                        !data.is_accepted &&
                        __changeOrderStatus('toggle_accept_btn_loader', true)
                      }
                      style={{
                        // height: 34,
                        // width: 34,
                        // borderRadius: 17,
                        height: 38,
                        width: 38,
                        borderRadius: 19,
                        backgroundColor: '#4285F4',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // marginLeft: 14,
                        marginTop: 12,
                      }}>
                      {!data.toggle_accept_btn_loader ? (
                        <Icon name="check" size={18} color="#fff" />
                      ) : (
                        <LoadingIndicator
                          size={16}
                          color="white"
                          style={{
                            height: 15,
                            width: 15,
                            backgroundColor: 'transparent',
                            flex: 0,
                            marginTop: -1,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
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

const styles = StyleSheet.create({
  horizontalSeparator: {
    height: 0.8,
    width: '100%',
    marginVertical: 4,
    backgroundColor: '#e0e0e0',
  },
});

export default PendingOrders;
