import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Linking,
} from 'react-native';
import moment from 'moment';
import Text from '../common/Text';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {ScrollView} from 'react-native-gesture-handler';
import {notifyMessage} from '.';

const OrderDetailsModal = props => {
  const {data, closeModal, _changeOrderStatus} = props;
  // const orderedAt = moment(data.createdAt).format('YY-MM-DD h:mm A');
  const expectedDeliveryAt =
    data.deliveryTime &&
    data.deliveryDay &&
    `${moment(data.deliveryDay).format('DD/MM/YY')} ${data.deliveryTime}`;
  const is_accept_btn_disabled =
    data.toggle_reject_btn_loader || data.is_rejected || data.is_error;
  const is_reject_btn_disabled =
    data.toggle_accept_btn_loader || data.is_accepted || data.is_error;
  return (
    <Modal visible onRequestClose={closeModal} animationType="slide">
      <SafeAreaView style={{flex: 1, backgroundColor: '#1d1d1c'}}>
        <View style={styles.container}>
          <View>
            <View style={{height: 50}} />
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={{alignItems: 'flex-start'}}
                onPress={closeModal}>
                <Image
                  style={{
                    height: 18,
                    resizeMode: 'contain',
                    marginRight: 5,
                  }}
                  source={require('../../images/icons/ChevronLeft.png')}
                />
              </TouchableOpacity>
              <View style={{flex: 1, marginLeft: 10}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 22,
                  }}>
                  Order Details
                </Text>
              </View>
              <View style={{flex: 1}} />
            </View>
            <View
              style={{
                ...styles.horizontalSeparator,
                marginVertical: 0,
                height: 0.6,
              }}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{padding: 10, paddingBottom: 120}}>
              <View
                style={{
                  backgroundColor: '#2f3242',
                  borderRadius: 4,
                  padding: 10,
                  marginVertical: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        marginTop: 0,
                      }}>
                      {`Order Id: #${data.orderNo || ''}`}
                    </Text>
                    {data.is_error && (
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() =>
                          notifyMessage('Error occurred. Try again!')
                        }
                        style={{
                          marginLeft: 6,
                          height: 18,
                          width: 18,
                          borderRadius: 9,
                          backgroundColor: '#F2910A',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Icon name="exclamation" size={10} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                  {/* <Text
                    style={{fontWeight: 'bold', fontSize: 18, marginTop: 0}}>
                    {`€${data.amount || '0'}`}
                  </Text> */}

                  {/* {((data.is_accepted && data.acceptedOn) ||
                    (data.is_rejected && data.rejectedOn)) && (
                    <Text
                      style={{
                        textTransform: 'uppercase',
                        fontSize: 15,
                        color: data.is_accepted ? '#55B72D' : '#DB4437',
                      }}>
                      {data.is_accepted ? 'Accepted' : 'Rejected'}
                    </Text>
                  )} */}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {/* {orderedAt && (
                    <View>
                      <Text style={{fontSize: 12, color: '#b0b0b0'}}>
                        Order Received
                      </Text>
                      <Text style={{fontSize: 12, color: '#b0b0b0'}}>
                        {orderedAt}
                      </Text>
                    </View>
                  )} */}
                  <View>
                    {expectedDeliveryAt && (
                      <>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#b0b0b0',
                            // textAlign: 'right',
                            textAlign: 'left',
                          }}>
                          Pickup on
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#b0b0b0',
                            textAlign: 'right',
                          }}>
                          {expectedDeliveryAt}
                        </Text>
                      </>
                    )}
                  </View>

                  {/* {((data.is_accepted && data.acceptedOn) ||
                    (data.is_rejected && data.rejectedOn)) && (
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#b0b0b0',
                          textAlign: 'right',
                        }}>
                        {data.is_accepted ? 'Accepted On' : 'Rejected On'}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#b0b0b0',
                          textAlign: 'right',
                        }}>
                        {moment(
                          data.is_accepted ? data.acceptedOn : data.rejectedOn,
                        ).format('ddd, MMM D, h:mm A')}
                      </Text>
                    </View>
                  )} */}
                </View>
              </View>

              {/* <View style={{marginTop: 20}}>
                {Array.isArray(data.cartItems) &&
                  data.cartItems.map((item, idx) => {
                    return (
                      <View
                        key={idx}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                            fontSize: 16,
                          }}>
                          {item.name || 'No Item name'}
                          {` X `}
                          <Text style={{fontSize: 13}}>({item.quantity})</Text>
                        </Text>
                        <Text style={{letterSpacing: 1}}>
                          €{item.price * item.quantity}
                        </Text>
                      </View>
                    );
                  })}
                <View style={{...styles.horizontalSeparator}} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      letterSpacing: 1,
                    }}>
                    Total ({data.totalQuantity})
                  </Text>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                    €{data.amount}
                  </Text>
                </View>
              </View> */}

              <View style={{marginTop: 30}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#F2910A',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    Order Items
                  </Text>
                </View>
                <View style={{...styles.horizontalSeparator}} />
                <View>
                  {Array.isArray(data.cartItems) &&
                    data.cartItems.map((item, idx) => {
                      return (
                        <View
                          key={idx}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              textTransform: 'capitalize',
                              fontWeight: 'bold',
                              // fontSize: 13,
                            }}>
                            {item.name || 'No Item name'}
                            {` X `}
                            <Text style={{fontSize: 12, fontWeight: 'normal'}}>
                              ({item.quantity})
                            </Text>
                          </Text>
                          {/* <Text style={{letterSpacing: 1}}>
                            €{item.price * item.quantity}
                          </Text> */}
                        </View>
                      );
                    })}
                </View>
              </View>

              {((data.is_accepted && data.acceptedOn) ||
                (data.is_rejected && data.rejectedOn)) && (
                <View style={{marginTop: 30}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#F2910A',
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      Order Information
                    </Text>
                    <Text
                      style={{
                        textTransform: 'uppercase',
                        fontSize: 15,
                        color: data.is_accepted ? '#55B72D' : '#DB4437',
                      }}>
                      {data.is_accepted ? 'Accepted' : 'Rejected'}
                    </Text>
                  </View>
                  <View style={{...styles.horizontalSeparator}} />
                  <View>
                    <View>
                      <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                        {data.is_accepted ? 'Accepted On' : 'Rejected On'}
                      </Text>
                      <Text
                        style={{
                          marginTop: -2,
                          fontSize: 13,
                          color: '#b0b0b0',
                        }}>
                        {moment(
                          data.is_accepted ? data.acceptedOn : data.rejectedOn,
                        ).format('ddd, MMM D, h:mm A')}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={{marginTop: 30}}>
                <View>
                  <Text
                    style={{
                      color: '#F2910A',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    Delivery Information
                  </Text>
                </View>
                <View style={{...styles.horizontalSeparator}} />
                <View>
                  <View>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      Customer Name
                    </Text>
                    <Text
                      style={{
                        textTransform: 'capitalize',
                        marginTop: -2,
                        fontSize: 13,
                        color: '#b0b0b0',
                      }}>
                      {data.customerName}
                    </Text>
                  </View>

                  <View style={{marginTop: 6}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      Email Address
                    </Text>
                    <Text
                      style={{
                        marginTop: -2,
                        fontSize: 13,
                        color: '#b0b0b0',
                      }}>
                      {data.email}
                    </Text>
                  </View>

                  <View style={{marginTop: 6}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      Delivery Address
                    </Text>
                    <Text
                      style={{
                        textTransform: 'capitalize',
                        marginTop: -2,
                        fontSize: 13,
                        color: '#b0b0b0',
                      }}>
                      {data.address}
                    </Text>
                  </View>
                </View>
                {/* <View style={{...styles.horizontalSeparator}} /> */}

                <View style={{marginTop: 30}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View>
                      <Icon name="phone" size={20} color="#F2910A" />
                    </View>
                    <View style={{marginHorizontal: 8}}>
                      <Text style={{fontWeight: 'bold'}}>
                        {data.customerPhone}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() =>
                        Linking.openURL(`tel:${data.customerPhone}`)
                      }
                      style={{
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderRadius: 4,
                        backgroundColor: '#F2910A',
                      }}>
                      <Text
                        style={{
                          textTransform: 'uppercase',
                          fontSize: 13,
                          fontWeight: 'bold',
                        }}>
                        Call
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {!data.is_accepted && !data.is_rejected && !data.is_error && (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
              }}>
              <View style={{...styles.horizontalSeparator, marginBottom: 0}} />
              <View
                style={{
                  paddingTop: 10,
                  paddingBottom: 11,
                  marginBottom: -1,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  backgroundColor: '#1d1d1c',
                }}>
                <>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() =>
                      _changeOrderStatus?.('toggle_accept_btn_loader', true)
                    }
                    disabled={is_accept_btn_disabled}
                    style={{
                      width: '30%',
                      paddingVertical: 8,
                      backgroundColor: is_accept_btn_disabled
                        ? '#cccccc'
                        : '#55B72D',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: is_accept_btn_disabled ? '#666666' : '#ffffff',
                      }}>
                      {!data.toggle_accept_btn_loader
                        ? 'Accept Order'
                        : 'Accepting...'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() =>
                      _changeOrderStatus?.('toggle_reject_btn_loader', false)
                    }
                    disabled={is_reject_btn_disabled}
                    style={{
                      width: '30%',
                      paddingVertical: 8,
                      backgroundColor: is_reject_btn_disabled
                        ? '#cccccc'
                        : '#DB4437',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: is_reject_btn_disabled ? '#666666' : '#ffffff',
                      }}>
                      {!data.toggle_reject_btn_loader
                        ? 'Reject Order'
                        : 'Rejecting...'}
                    </Text>
                  </TouchableOpacity>
                </>

                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={closeModal}
                  style={{
                    width: '30%',
                    paddingVertical: 8,
                    borderRadius: 30,
                    borderWidth: 0.6,
                    borderColor: '#F2910A',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: '#F2910A'}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default OrderDetailsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d1c',
  },
  headerContainer: {
    position: 'absolute',
    left: 0,
    paddingRight: 5,
    borderRadius: 20,
    paddingLeft: 10,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontalSeparator: {
    height: 0.8,
    width: '100%',
    marginVertical: 4,
    backgroundColor: '#575757',
  },
});
