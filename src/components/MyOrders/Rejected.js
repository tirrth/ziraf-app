import React from 'react';
import {FlatList, View, StyleSheet, TouchableOpacity} from 'react-native';
import LoadingIndicator from '../common/LoadingIndicator';
import Text from '../common/Text';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

class RejectedOrders extends React.Component {
  _renderOrder = ({item: data}) => {
    const _toggleCard = () => {
      data.is_expanded = !data.is_expanded;
      this.props._changeData(this.props.data);
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
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View>
                <TouchableOpacity onPress={_toggleCard} activeOpacity={0.4}>
                  <Icon name="chevron-down" size={18} color="#d0d0d0" />
                </TouchableOpacity>
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
            </View>
          )}
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
