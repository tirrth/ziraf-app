import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Image,
  RefreshControl,
} from 'react-native';
import ModalWrapper from '../ModalWrapper';
import {
  fetchRestaurants,
  clearAppState,
  setAppState,
} from '../../../js/actions/actionCreators';
import {getSortedRestaurants} from '../../../js/utils';

import Text from '../Text';
import LoadingIndicator from '../LoadingIndicator';
import RatingBreakdown from '../RatingBreakdown';
import RestaurantCard from '../RestaurantCard';
import cs from '../../../styles/common-styles';
import Alert from '../Alert';
import DiscountModal from '../../common/DiscountModal';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class RestaurantList extends Component {
  constructor(args) {
    super(args);
    this.state = {
      favouriteRestaurants: [],
      data: args.data ? args.data : [],
      visible: false,
      modalX: new Animated.Value(-deviceHeight),
      sorting: {
        location: 'near',
      },
      restaurants: [],
      searchText: '',
      refreshing: false,

      alertSize: false,
      alertSuccess: false,
      alertTitle: 'Hi',
      alertDetail: '',
      alertButton: 'GOT IT',
      alertChildren: null,
      alertOnClose: () => {},
    };
    this.changeSort = this.changeSort.bind(this);
  }

  componentDidMount() {
    const {restaurants} = this.state;

    if (restaurants) {
      this.setRestaurantData(restaurants);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {data, fetchRestaurantList, clearAppStateData} = this.props;

    const {searchText, sorting} = this.state;

    if (data && data !== prevProps.data) {
      if (data) {
        this.setRestaurantData(data);
      }
    }

    if (
      this.props.appState &&
      this.props.appState.FETCH_FILTERED_DATA &&
      this.props.appState.FETCH_FILTERED_DATA !==
        prevProps.appState.FETCH_FILTERED_DATA
    ) {
      if (this.props.appState.FILTERS) {
        let location = Object.assign({}, appState.CURRENT_LOCATION);
        fetchRestaurantList(
          this.props.appState.FILTERS,
          searchText,
          location,
          sorting,
        );
      }
      clearAppStateData('FETCH_FILTERED_DATA');
    }
  }

  setRestaurantData(data) {
    let restaurantList = data.slice(0);
    const {sorting} = this.state;
    restaurantList = getSortedRestaurants(restaurantList, sorting);
    this.setState({
      restaurants: restaurantList,
    });
  }

  openModal() {
    const {modalX} = this.state;
    Animated.timing(modalX, {
      duration: 300,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }

  closeModal() {
    const {modalX} = this.state;
    Animated.timing(modalX, {
      duration: 300,
      toValue: -deviceHeight,
      useNativeDriver: false,
    }).start();
  }

  changeSort(sortType, value) {
    const {onSorting} = this.props;
    this.setState(
      {
        sorting: {
          [sortType]: value,
        },
      },
      () => {
        onSorting && onSorting({[sortType]: value});
      },
    );
  }

  handleSorting() {
    const {restaurants, sorting} = this.state;
    let restaurantList = restaurants.slice(0);
    restaurantList = getSortedRestaurants(restaurantList, sorting);
    this.setState({
      restaurants: restaurantList,
    });
    this.closeModal();
  }

  _keyExtractor(item) {
    return item.id;
  }

  handleRefresh() {
    const {onRefresh} = this.props;

    if (onRefresh) {
      this.setState({refreshing: true});
      onRefresh()
        .then(res => this.setState({refreshing: false}))
        .catch(err => this.setState({refreshing: false}));
    }
  }

  render() {
    const {data, navigation, appState, isSignedIn} = this.props;
    const {
      modalX,
      sorting,
      searchText,
      restaurants,
      favouriteRestaurants,

      alertSize,
      alertSuccess,
      alertTitle,
      alertDetail,
      alertButton,
      alertOnClose,
      alertChildren,
    } = this.state;

    return (
      <View style={styles.container}>
        <View
          style={{
            marginBottom: 10,
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={this.openModal.bind(this)}
            style={{
              flexDirection: 'row',
              width: '30%',
              alignItems: 'flex-start',
            }}>
            <Text
              style={[cs.textWhite, cs.font12, cs.textBold, {paddingRight: 5}]}>
              Sort by
            </Text>
            <Image
              source={require('../../../images/icons/dropdown_arrow.png')}
              style={{
                height: 5,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginTop: 3,
              }}
            />
          </TouchableOpacity>

          {appState && (appState.SHOW_FILTER_VIEW || appState.SHOW_MY_VIEW) ? (
            <View style={{width: '40%', alignItems: 'center'}}>
              <Text style={[cs.textBold, cs.font16]} fontVisby={true}>
                {appState.SHOW_MY_VIEW ? 'Your View' : 'Your Search'}
              </Text>
            </View>
          ) : null}

          {appState && (appState.SHOW_FILTER_VIEW || appState.SHOW_MY_VIEW) ? (
            <View style={{width: '30%', alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  const {fetchRestaurantList} = this.props;
                  this.props.clearAppStateData('SHOW_FILTER_VIEW');
                  this.props.clearAppStateData('SHOW_MY_VIEW');
                  fetchRestaurantList();
                }}>
                <Text style={[cs.font12, cs.textBold, {color: '#737373'}]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh.bind(this)}
            />
          }>
          <View style={{paddingTop: 15, paddingBottom: 15}}>
            {data && data.length > 0 ? (
              <FlatList
                data={data}
                keyExtractor={this._keyExtractor.bind(this)}
                windowSize={11}
                renderItem={event => {
                  return (
                    <RestaurantCard
                      data={event.item}
                      navigation={navigation}
                      isSignedIn={isSignedIn ? true : false}
                      onLoggedInUserOnly={() => {
                        this.props.setAppStateData(
                          'PROMPT_ONLY_USER_ALLOWED_ALERT',
                          true,
                        );
                      }}
                      onRating={ratingBreakdown => {
                        this.setState({
                          alertSize: 'small',
                          alertSuccess: true,
                          alertTitle: event.item.title,
                          alertDetail: '',
                          alertChildren: (
                            <RatingBreakdown data={ratingBreakdown} />
                          ),
                          alertOnClose: () => {
                            this.setState({
                              alertSuccess: false,
                            });
                          },
                        });
                      }}
                      isFavourite={
                        favouriteRestaurants.indexOf(event.item.id) !== -1
                          ? true
                          : false
                      }
                      onDiscount={discountData => {
                        this.setState({
                          alertSize: 'small',
                          alertSuccess: true,
                          alertTitle: event.item.title,
                          alertDetail: '',
                          alertChildren: <DiscountModal data={discountData} />,
                          alertOnClose: () => {
                            this.setState({
                              alertSuccess: false,
                            });
                          },
                        });
                      }}
                    />
                  );
                }}
              />
            ) : null}
          </View>
        </ScrollView>

        <Alert
          title={alertTitle}
          size={alertSize}
          detail={alertDetail}
          button={alertButton ? alertButton : 'GOT IT'}
          visible={alertSuccess}
          onClose={alertOnClose}>
          {alertChildren}
        </Alert>

        <ModalWrapper modalX={modalX}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[cs.padding20, styles.modalContainer]}>
              <View style={styles.sortRow}>
                <View style={styles.sortField}>
                  <Text
                    style={[
                      cs.font12,
                      cs.textBold,
                      cs.textWhite,
                      sorting.location ? cs.textOrange : cs.textWhite,
                    ]}>
                    Location
                  </Text>
                </View>
                <View style={styles.sortFieldOptions}>
                  <TouchableOpacity
                    onPress={() => this.changeSort('location', 'near')}>
                    <Text
                      style={[
                        styles.sortOption,
                        cs.font12,
                        cs.textWhite,
                        sorting.location && sorting.location === 'near'
                          ? cs.textOrange
                          : cs.textWhite,
                      ]}>
                      Near
                    </Text>
                  </TouchableOpacity>
                  <Text style={[cs.textWhite, styles.textSeparator]}>|</Text>
                  <TouchableOpacity
                    onPress={() => this.changeSort('location', 'far')}>
                    <Text
                      style={[
                        styles.sortOption,
                        cs.font12,
                        cs.textWhite,
                        sorting.location && sorting.location === 'far'
                          ? cs.textOrange
                          : cs.textWhite,
                      ]}>
                      Far
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sortRow}>
                <View style={styles.sortField}>
                  <Text
                    style={[
                      cs.font12,
                      cs.textBold,
                      cs.textWhite,
                      sorting.rating ? cs.textOrange : cs.textWhite,
                    ]}>
                    Rating
                  </Text>
                </View>
                <View style={styles.sortFieldOptions}>
                  <TouchableOpacity
                    onPress={() => this.changeSort('rating', 'low')}>
                    <Text
                      style={[
                        styles.sortOption,
                        cs.font12,
                        cs.textWhite,
                        sorting.rating && sorting.rating === 'low'
                          ? cs.textOrange
                          : cs.textWhite,
                      ]}>
                      Low
                    </Text>
                  </TouchableOpacity>
                  <Text style={[cs.textWhite, styles.textSeparator]}>|</Text>
                  <TouchableOpacity
                    onPress={() => this.changeSort('rating', 'high')}>
                    <Text
                      style={[
                        styles.sortOption,
                        cs.font12,
                        cs.textWhite,
                        sorting.rating && sorting.rating === 'high'
                          ? cs.textOrange
                          : cs.textWhite,
                      ]}>
                      High
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sortRow}>
                <View style={styles.sortField}>
                  <Text
                    style={[
                      cs.font12,
                      cs.textBold,
                      cs.textWhite,
                      sorting.restaurant ? cs.textOrange : cs.textWhite,
                    ]}>
                    Restaurant
                  </Text>
                </View>
                <View style={styles.sortFieldOptions}>
                  <TouchableOpacity
                    onPress={() => this.changeSort('restaurant', 'ascending')}>
                    <Text
                      style={[
                        styles.sortOption,
                        cs.font12,
                        cs.textWhite,
                        sorting.restaurant && sorting.restaurant === 'ascending'
                          ? cs.textOrange
                          : cs.textWhite,
                      ]}>
                      Ascending
                    </Text>
                  </TouchableOpacity>
                  <Text style={[cs.textWhite, styles.textSeparator]}>|</Text>
                  <TouchableOpacity
                    onPress={() => this.changeSort('restaurant', 'descending')}>
                    <Text
                      style={[
                        styles.sortOption,
                        cs.font12,
                        cs.textWhite,
                        sorting.restaurant &&
                        sorting.restaurant === 'descending'
                          ? cs.textOrange
                          : cs.textWhite,
                      ]}>
                      Descending
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[cs.marginB10, {alignItems: 'center', marginTop: 20}]}>
                <TouchableOpacity
                  style={styles.sortButton}
                  onPress={() => this.handleSorting()}>
                  <Text
                    style={[cs.font13, cs.textWhite, cs.textBold]}
                    fontVisby={true}>
                    SORT
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ModalWrapper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d1c',
    paddingLeft: 25,
    paddingRight: 25,
  },
  modalContainer: {
    backgroundColor: '#1d1d1c',
    marginRight: 80,
  },
  sortRow: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
  },
  sortField: {
    width: 90,
  },
  sortFieldOptions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  sortButton: {
    padding: 6,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: '#F2910A',
    borderRadius: 20,
  },
  textSeparator: {
    width: 6,
    textAlign: 'center',
  },
  sortOption: {
    width: 80,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    padding: 8,
    color: '#fff',
    paddingRight: 40,
  },
});

function mapStateToProps(state) {
  return {
    appState: state.appState,
  };
}

export default connect(mapStateToProps, {
  fetchRestaurantList: fetchRestaurants,
  setAppStateData: setAppState,
  clearAppStateData: clearAppState,
})(RestaurantList);
