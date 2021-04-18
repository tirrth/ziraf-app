import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {
  fetchRestaurantDetail,
  clearRestaurantDetail,
  setAppState,
} from '../../js/actions/actionCreators';
import cs from '../../styles/common-styles';
import Text from '../common/Text';
import PendingOrders from './Pending';
import AcceptedOrders from './Accepted';
import RejectedOrders from './Rejected';

const PENDING_ORDERS_DATA = [
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
  {
    order_title: 'Order 1',
    delivery_time: new Date(),
    items: [
      {
        quantity: 2,
        name: 'Name of the dish',
      },
      {
        quantity: 1,
        name: 'Name of the dish',
      },
      {
        quantity: 8,
        name: 'Name of the dish',
      },
      {
        quantity: 3,
        name: 'Name of the dish',
      },
    ],
  },
];

class MyOrders extends Component {
  constructor(args) {
    super(args);
    this.state = {
      currentTab: 'pending',

      pendingOrders: {is_next_page: true, data: PENDING_ORDERS_DATA},
      acceptedOrders: [],
      rejectedOrders: [],
    };
  }

  handleTabChange(tab) {
    this.setState({
      currentTab: tab,
    });
  }

  handleGoBack() {
    const {navigation, route} = this.props;
    // const origin = navigation.getParam('origin');
    const origin = route?.params?.origin;
    if (origin) {
      navigation.goBack();
      navigation.navigate(origin);
    } else {
      navigation.goBack();
    }
  }

  _onLoadMore = ORDER_TYPE => {
    if (ORDER_TYPE === 'PENDING') {
      setTimeout(() => {
        this.setState(({pendingOrders}) => {
          return {
            pendingOrders: {
              ...pendingOrders,
              data: [...pendingOrders.data, ...pendingOrders.data],
            },
          };
        });
      }, 1000);
    } else if (ORDER_TYPE === 'ACCEPTED') {
    } else if (ORDER_TYPE === 'REJECTED') {
    }
  };

  render() {
    const {
      currentTab,
      pendingOrders,
      acceptedOrders,
      rejectedOrders,
    } = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#1d1d1c'}}>
        <View style={styles.container}>
          <View>
            <View style={{height: 70}} />
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={{flex: 1, alignItems: 'flex-start'}}
                onPress={this.handleGoBack.bind(this)}>
                <Image
                  style={{
                    height: 18,
                    resizeMode: 'contain',
                    marginRight: 5,
                  }}
                  source={require('../../images/icons/ChevronLeft.png')}
                />
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 22,
                  }}>
                  My Orders
                </Text>
              </View>
              <View style={{flex: 1}} />
            </View>
          </View>

          <View>
            <View
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                },
                cs.paddingTB10,
              ]}>
              <TouchableOpacity
                onPress={() => this.handleTabChange('pending')}
                style={[
                  currentTab === 'pending' ? styles.activeTab : styles.tab,
                ]}>
                <Text
                  allowFontScaling={false}
                  style={[cs.font17, cs.textWhite, styles.tabText]}>
                  Pending
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.handleTabChange('accepted')}
                style={[
                  currentTab === 'accepted' ? styles.activeTab : styles.tab,
                ]}>
                <Text
                  allowFontScaling={false}
                  style={[cs.font17, cs.textWhite, styles.tabText]}>
                  Accepted
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.handleTabChange('rejected')}
                style={[
                  currentTab === 'rejected' ? styles.activeTab : styles.tab,
                ]}>
                <Text
                  allowFontScaling={false}
                  style={[cs.font17, cs.textWhite, styles.tabText]}>
                  Rejected
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{padding: 15, flex: 1}}>
            {currentTab === 'pending' && (
              <PendingOrders
                data={pendingOrders}
                _handleLoadMore={() => this._onLoadMore('PENDING')}
              />
            )}
            {currentTab === 'accepted' && (
              <AcceptedOrders
                data={acceptedOrders}
                _handleLoadMore={() => this._onLoadMore('ACCEPTED')}
              />
            )}
            {currentTab === 'rejected' && (
              <RejectedOrders
                data={rejectedOrders}
                _handleLoadMore={() => this._onLoadMore('REJECTED')}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

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
  tabText: {
    fontWeight: '600',
  },
  tab: {
    backgroundColor: 'transparent',
    paddingTop: 0,
    paddingBottom: 4,
    paddingLeft: 18,
    paddingRight: 18,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#F2910A',
    paddingTop: 0,
    paddingBottom: 4,
    paddingLeft: 18,
    paddingRight: 18,
    borderRadius: 20,
  },
});

function mapStateToProps(state) {
  return {
    userDetail: state.userDetail,
    appState: state.appState,
    restaurantDetail: state.restaurantDetail,
    restaurantReview: state.restaurantReview,
  };
}

function mapDispatchToProps() {
  return {
    fetchRestaurantDetailData: fetchRestaurantDetail,
    clearRestaurantDetailData: clearRestaurantDetail,
    setAppStateData: setAppState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
