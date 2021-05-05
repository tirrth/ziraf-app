import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
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
import BaseAjaxConfig from '../../js/actions/BaseAjaxConfig.js';
import qs from 'querystring';
import LoadingIndicator from '../common/LoadingIndicator';
import moment from 'moment';
import {ToastAndroid, Platform, AlertIOS} from 'react-native';
import {OrderNotifyContext} from './OrderNotifyProvider';

export function notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    AlertIOS.alert(msg);
  }
}

// const PENDING_ORDERS_DATA = [
//   {
//     order_title: 'Order 1',
//     delivery_time: new Date(),
//     items: [
//       {
//         quantity: 2,
//         name: 'Name of the dish',
//       },
//       {
//         quantity: 1,
//         name: 'Name of the dish',
//       },
//       {
//         quantity: 8,
//         name: 'Name of the dish',
//       },
//       {
//         quantity: 3,
//         name: 'Name of the dish',
//       },
//     ],
//   },
// ];

class MyOrders extends Component {
  constructor(args) {
    super(args);
    this.state = {
      isLoading: true,
      currentTab: 'pending',

      pendingOrders: {},
      acceptedOrders: {},
      rejectedOrders: {},

      currentTime: moment().format('ddd, MMM D, h:mm A'),
      errMessage: '',
    };
  }

  _onNotificationReceived = (pendingOrders = this.state.pendingOrders) => {
    const {orderId: order_id, setOrderId} = this.context;
    const {data} = pendingOrders;
    if (order_id && Array.isArray(data)) {
      data?.map(
        order =>
          order._id == order_id &&
          ((order.toggle_modal = true), setOrderId(null)),
      );
    }
    this.setState({pendingOrders});
  };

  _resetNavigationParams = () => {
    const {setOrderId} = this.context;
    setOrderId(null);
  };

  _setErrorMsg = (errMessage = 'Error found!') => {
    this.setState({
      errMessage,
      pendingOrders: {},
      acceptedOrders: {},
      acceptedOrders: {},
      isLoading: true,
    });
  };

  componentDidMount() {
    const {order_id} = this.props?.route?.params;
    const {setOrderId} = this.context;
    setOrderId(order_id);

    setInterval(() => {
      this.setState({
        currentTime: moment().format('ddd, MMM D, h:mm A'),
      });
    }, 1000);

    const {navigation} = this.props;
    this._unsubscribeOnFocus = navigation.addListener('focus', () => {
      this.setState({isLoading: true});
      this._getOrders()
        .then(res =>
          !res.data?.length
            ? this._setErrorMsg('No data found!')
            : this._onNotificationReceived(res),
        )
        .catch(err => this._setErrorMsg('No data found!'))
        .finally(() => this.setState({isLoading: false}));
    });

    this._unsubscribeOnBlur = navigation.addListener(
      'blur',
      this._resetNavigationParams,
    );
  }

  // componentDidUpdate(prevProps) {
  //   const {prev_order_id} = prevProps?.route?.params;
  //   const {changed_order_id} = this.props?.route?.params;
  //   console.log('componentDidUpdate called');
  //   if (prev_order_id != changed_order_id) {
  //     console.log('order_id changed');
  //   }
  // }

  componentWillUnmount() {
    this._unsubscribeOnFocus?.();
    this._unsubscribeOnBlur?.();
  }

  _getOrders = async (pageNumber = 0, ORDER_TYPE = 'PENDING') => {
    const path = '/api/v1/order';
    const query_data = {
      limit: 5,
      pageNumber,
      status: ORDER_TYPE,
    };
    return fetch(
      BaseAjaxConfig.host + path + ('?' + qs.stringify(query_data)),
      {
        method: 'GET',
        headers: BaseAjaxConfig.headers,
      },
    )
      .then(response => {
        if (response) {
          return response.json();
        } else {
          let err = new Error('API Error. Failed to fetch');
          return Promise.reject(err);
        }
      })
      .then(json => {
        const is_data_available = !!(
          Array.isArray(json?.data) && json?.data?.[0]
        );
        ORDER_TYPE === 'ACCEPTED' &&
          is_data_available &&
          json.data.map(data => (data.is_accepted = true));
        ORDER_TYPE === 'REJECTED' &&
          is_data_available &&
          json.data.map(data => (data.is_rejected = true));
        return {
          current_page_no: query_data.pageNumber,
          is_next_page: is_data_available,
          data: is_data_available ? json.data : [],
        };
      })
      .catch(err => {
        throw err;
      });
  };

  handleTabChange(tab) {
    this.setState({
      errMessage: '',
      currentTab: tab,
    });

    const __getOrdersFirstPage = (object_key, ORDER_TYPE) => {
      if (
        object_key &&
        ORDER_TYPE /* && !this.state[object_key].data?.length */ // Uncomment the last condition of if block, if you do not want to refresh the data every-time the current tab changes
      ) {
        this.setState({isLoading: true});
        this._getOrders(0, ORDER_TYPE)
          .then(res => {
            if (!res.data?.length) {
              this._setErrorMsg('No data found!');
            } else {
              this.setState({[object_key]: {...res}});
            }
          })
          .catch(err => {
            this._setErrorMsg('No data found!');
            console.log(err);
          })
          .finally(() => this.setState({isLoading: false}));
      }
    };
    if (tab == 'pending') {
      __getOrdersFirstPage('pendingOrders', 'PENDING');
    } else if (tab == 'rejected') {
      __getOrdersFirstPage('rejectedOrders', 'REJECTED');
    } else if (tab == 'accepted') {
      __getOrdersFirstPage('acceptedOrders', 'ACCEPTED');
    }
  }

  handleGoBack() {
    const {navigation, route} = this.props;
    const origin = route?.params?.origin;
    if (origin) {
      navigation.goBack();
      navigation.navigate(origin);
    } else {
      navigation.goBack();
    }
  }

  _onLoadMore = ORDER_TYPE => {
    ORDER_TYPE = `${ORDER_TYPE}`.toUpperCase();
    const __getMoreOrders = (object_key, ORDER_TYPE) => {
      object_key &&
        ORDER_TYPE &&
        this._getOrders(this.state[object_key]?.current_page_no + 1, ORDER_TYPE)
          .then(res => {
            this.setState(state => {
              const data = [...state?.[object_key].data, ...res.data];
              return {[object_key]: {...res, data}};
            });
          })
          .catch(err => console.log(err));
    };

    if (ORDER_TYPE === 'PENDING') {
      __getMoreOrders('pendingOrders', ORDER_TYPE);
    } else if (ORDER_TYPE === 'ACCEPTED') {
      __getMoreOrders('acceptedOrders', ORDER_TYPE);
    } else if (ORDER_TYPE === 'REJECTED') {
      __getMoreOrders('rejectedOrders', ORDER_TYPE);
    }
  };

  _onOrderStatusChange = async (orderId, is_accepted = false) => {
    if (!orderId) {
      throw new Error('OrderId is required');
    }
    const path = '/api/v1/status';
    const data = {
      status: !!is_accepted,
      orderId,
    };
    return fetch(BaseAjaxConfig.host + path, {
      method: 'POST',
      headers: BaseAjaxConfig.headers,
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response) {
          return response.json();
        } else {
          const err = new Error('API Error. Failed to fetch');
          return Promise.reject(err);
        }
      })
      .then(json => json)
      .catch(err => {
        throw err;
      });
  };

  // _moveData = (is_accepted, data) => {
  //   if (is_accepted) {
  //     const {acceptedOrders} = this.state;
  //     acceptedOrders?.data?.unshift?.(data);
  //     this.setState({acceptedOrders});
  //   } else {
  //     const {rejectedOrders} = this.state;
  //     rejectedOrders?.data?.unshift?.(data);
  //     this.setState({rejectedOrders});
  //   }
  // };

  _reloadData = () => {
    this.setState(
      {pendingOrders: {}, acceptedOrders: {}, rejectedOrders: {}},
      () => {
        this.handleTabChange('pending');
      },
    );
  };

  render() {
    const {
      currentTab,
      pendingOrders,
      acceptedOrders,
      rejectedOrders,
      isLoading,
      errMessage,
      currentTime,
    } = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#1d1d1c'}}>
        <View style={styles.container}>
          <View>
            <View style={{height: 45}} />
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
            <Text
              style={{
                textAlign: 'center',
                marginVertical: 8,
                fontWeight: 'bold',
              }}>
              Current Time:{' '}
              <Text style={{fontWeight: 'normal'}}>{currentTime}</Text>
            </Text>
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

          {isLoading || errMessage ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -20,
              }}>
              {isLoading && <LoadingIndicator style={{flex: 0}} />}
              {!!errMessage && (
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 16,
                    padding: 10,
                  }}>{`${errMessage}`}</Text>
              )}
            </View>
          ) : (
            <View style={{flex: 1}}>
              {currentTab === 'pending' && (
                <PendingOrders
                  data={pendingOrders}
                  _changeData={data => this.setState({pendingOrders: data})}
                  _changeOrderStatus={this._onOrderStatusChange}
                  // _moveData={this._moveData}
                  _reloadData={this._reloadData}
                  _handleLoadMore={() => this._onLoadMore('PENDING')}
                />
              )}
              {currentTab === 'accepted' && (
                <AcceptedOrders
                  data={acceptedOrders}
                  _changeData={data => this.setState({acceptedOrders: data})}
                  _handleLoadMore={() => this._onLoadMore('ACCEPTED')}
                />
              )}
              {currentTab === 'rejected' && (
                <RejectedOrders
                  data={rejectedOrders}
                  _changeData={data => this.setState({rejectedOrders: data})}
                  _handleLoadMore={() => this._onLoadMore('REJECTED')}
                />
              )}
            </View>
          )}
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

MyOrders.contextType = OrderNotifyContext;
export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
