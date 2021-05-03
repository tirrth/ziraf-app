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
  TextInput,
  RefreshControl,
  Modal,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalWrapper from '../common/ModalWrapper';
import {
  fetchRestaurants,
  clearAppState,
  setAppState,
} from '../../js/actions/actionCreators';
import {getSortedRestaurants, getAdPopupBanners} from '../../js/utils';

import Text from '../common/Text';
import LoadingIndicator from '../common/LoadingIndicator';
import RatingBreakdown from '../common/RatingBreakdown';
import RestaurantCard from '../common/RestaurantCard';
import cs from '../../styles/common-styles';
import Alert from '../common/Alert';
import OnboardingModal from './../Onboarding';
import PopupBanner from '../common/PopupBanner';
import DiscountModal from '../common/DiscountModal';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const getItemLayout = (data, index) => ({
  length: 205,
  offset: 205 * index,
  index,
});

class HomeScreen extends Component {
  constructor(args) {
    super(args);
    this.state = {
      visible: false,
      modalX: new Animated.Value(-deviceHeight),
      sorting: {
        location: 'near',
      },
      loading: false,
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

      onboardingModalVisible: false,
      popupBannerModalVisible: false,
      popups: [],
      showAutocompleteOptions: false,
      autocompleteList: [],
      previousSearchTermId: '',
      previousSearchTermType: '',
    };
    this.changeSort = this.changeSort.bind(this);
  }

  componentDidMount() {
    // this.fetchData();
    // this.fetchFavResList();

    //this.showOnboarding();
    this.showPopupBanners();
  }

  showPopupBanners = async () => {
    const {setAppStateData} = this.props;
    const {popups} = this.state;
    try {
      getAdPopupBanners().then(resp => {
        if (resp?.success) {
          let unfilteredpopuplist = resp.data.slice(0);
          const popupBannerList = [
            ...new Set(unfilteredpopuplist.map(obj => JSON.stringify(obj))),
          ].map(str => JSON.parse(str));

          this.setState({popups: popupBannerList});
          setAppStateData('POPUPS_AVAILABLE', true);
          setAppStateData('ALLOW_POPUP_TO_SHOW', true);
        }
      });
    } catch (err) {}
  };

  showOnboarding = async () => {
    try {
      let firstTimeOpeningApp = await AsyncStorage.getItem(
        '@Ziraf:firstTimeOpeningApp',
      );
      if (!firstTimeOpeningApp) {
        firstTimeOpeningApp = true;
        await AsyncStorage.setItem('@Ziraf:firstTimeOpeningApp', 'false');
        this.setOnboardingModalVisible(true);
      } else {
        firstTimeOpeningApp = false;
      }
    } catch (err) {
      alert(err);
    }
  };

  setOnboardingModalVisible(visible) {
    this.setState({
      onboardingModalVisible: visible,
    });
  }

  setPopupBannerDetailsVisible(visible) {
    this.setState({
      popupBannerModalVisible: visible,
    });
  }

  adPopupClickedEvent(external, link, appPage) {
    this.setPopupBannerDetailsVisible(false);
    if (external) {
      this.handleOpenURL(link);
    } else {
      //this part is for jumping to in app page
    }
  }

  handleOpenURL(url) {
    if (url) {
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url).catch(err => alert('cannot open url'));
          } else {
          }
        })
        .catch(err => {
          alert('cannot open url');
        });
    }
  }

  fetchModifiedFiltersAndSearchText(filters) {
    const {
      searchText,
      previousSearchTermId,
      previousSearchTermType,
      autocompleteList,
    } = this.state;

    let modifiedFilters = filters;
    let confirmedSearchText = '';

    if (autocompleteList) {
      let tempData = autocompleteList.filter(
        item => item.name.toLowerCase() === searchText.toLowerCase(),
      );

      if (tempData && tempData.length > 0) {
        //clear previous search text filter first regardless
        if (previousSearchTermId != '' || previousSearchTermType != '') {
          if (previousSearchTermType === 'Cuisines') {
            if (modifiedFilters['cuisines']) {
              const idx = modifiedFilters['cuisines'].indexOf(
                previousSearchTermId,
              );
              if (idx != -1) {
                modifiedFilters['cuisines'].splice(idx, 1);
                this.setState({
                  previousSearchTermId: '',
                  previousSearchTermType: '',
                });
              }
            }
          } else if (previousSearchTermType === 'Moments') {
            if (modifiedFilters['moments']) {
              const idx = modifiedFilters['moments'].indexOf(
                previousSearchTermId,
              );
              if (idx != -1) {
                modifiedFilters['moments'].splice(idx, 1);
                this.setState({
                  previousSearchTermId: '',
                  previousSearchTermType: '',
                });
              }
            }
          }
        }

        //begin search
        if (tempData[0].type === 'Cuisines') {
          if (modifiedFilters['cuisines']) {
            const idx = modifiedFilters['cuisines'].indexOf(tempData[0].id);
            if (idx == -1) {
              modifiedFilters['cuisines'].push(tempData[0].id);
              this.setState({
                previousSearchTermId: tempData[0].id,
                previousSearchTermType: tempData[0].type,
              });
            }
          } else {
            modifiedFilters.cuisines = [];
            modifiedFilters['cuisines'].push(tempData[0].id);
            this.setState({
              previousSearchTermId: tempData[0].id,
              previousSearchTermType: tempData[0].type,
            });
          }
        } else if (tempData[0].type === 'Moments') {
          if (modifiedFilters['moments']) {
            const idx = modifiedFilters['moments'].indexOf(tempData[0].id);
            if (idx == -1) {
              modifiedFilters['moments'].push(tempData[0].id);
              this.setState({
                previousSearchTermId: tempData[0].id,
                previousSearchTermType: tempData[0].type,
              });
            }
          } else {
            modifiedFilters.moments = [];
            modifiedFilters['moments'].push(tempData[0].id);
            this.setState({
              previousSearchTermId: tempData[0].id,
              previousSearchTermType: tempData[0].type,
            });
          }
        } else {
          confirmedSearchText = searchText;
          if (previousSearchTermType === 'Cuisines') {
            if (modifiedFilters['cuisines']) {
              const idx = modifiedFilters['cuisines'].indexOf(
                previousSearchTermId,
              );
              if (idx != -1) {
                modifiedFilters['cuisines'].splice(idx, 1);
                this.setState({
                  previousSearchTermId: '',
                  previousSearchTermType: '',
                });
              }
            }
          } else if (previousSearchTermType === 'Moments') {
            if (modifiedFilters['moments']) {
              const idx = modifiedFilters['moments'].indexOf(
                previousSearchTermId,
              );
              if (idx != -1) {
                modifiedFilters['moments'].splice(idx, 1);
                this.setState({
                  previousSearchTermId: '',
                  previousSearchTermType: '',
                });
              }
            }
          }
        }
      } else {
        confirmedSearchText = searchText;
        if (previousSearchTermType === 'Cuisines') {
          if (modifiedFilters['cuisines']) {
            const idx = modifiedFilters['cuisines'].indexOf(
              previousSearchTermId,
            );
            if (idx != -1) {
              modifiedFilters['cuisines'].splice(idx, 1);
              this.setState({
                previousSearchTermId: '',
                previousSearchTermType: '',
              });
            }
          }
        } else if (previousSearchTermType === 'Moments') {
          if (modifiedFilters['moments']) {
            const idx = modifiedFilters['moments'].indexOf(
              previousSearchTermId,
            );
            if (idx != -1) {
              modifiedFilters['moments'].splice(idx, 1);
              this.setState({
                previousSearchTermId: '',
                previousSearchTermType: '',
              });
            }
          }
        }
      }
    }

    if (modifiedFilters.cuisines && modifiedFilters.cuisines.length === 0) {
      delete modifiedFilters['cuisines'];
    }
    if (modifiedFilters.moments && modifiedFilters.moments.length === 0) {
      delete modifiedFilters['moments'];
    }

    if (
      modifiedFilters.cuisines == null &&
      modifiedFilters.locationRange == null &&
      modifiedFilters.moments == null &&
      modifiedFilters.priceRange == null &&
      modifiedFilters.ratingRange == null &&
      modifiedFilters.zirafers == null &&
      modifiedFilters.delivery == null &&
      modifiedFilters.reservation == null
    ) {
      modifiedFilters = null;
    }

    return {
      modifiedFilters: modifiedFilters,
      confirmedSearchText: confirmedSearchText,
    };
  }

  fetchData() {
    const {appState, fetchRestaurantList} = this.props;
    const {sorting} = this.state;
    let filters = Object.assign({}, appState.FILTERS);
    let location = Object.assign({}, appState.CURRENT_LOCATION);

    const newSearchParams = this.fetchModifiedFiltersAndSearchText(filters);
    const modifiedFilters = newSearchParams.modifiedFilters;
    const confirmedSearchText = newSearchParams.confirmedSearchText;
    appState.FILTERS = modifiedFilters;

    //return fetchRestaurantList(filters, searchText, location, sorting);
    return fetchRestaurantList(
      modifiedFilters,
      confirmedSearchText,
      location,
      sorting,
    );
  }

  fetchFavResList = async () => {
    const {restaurants} = this.state;
    let favouriteRestaurants = await AsyncStorage.getItem(
      '@Ziraf:favouriteRestaurants',
    );
    if (!favouriteRestaurants) {
      favouriteRestaurants = [];
    } else {
      favouriteRestaurants = JSON.parse(favouriteRestaurants);
    }
    this.setState({
      favouriteRestaurants,
      restaurants: restaurants.slice(0),
    });
  };

  fetchFavResList = async () => {
    const {restaurants} = this.state;
    if (restaurants && restaurants.length > 0) {
      let favouriteRestaurants = await AsyncStorage.getItem(
        '@Ziraf:favouriteRestaurants',
      );
      if (!favouriteRestaurants) {
        favouriteRestaurants = [];
      } else {
        favouriteRestaurants = JSON.parse(favouriteRestaurants);
      }
      this.setState({
        favouriteRestaurants,
        restaurants: restaurants.slice(0),
      });
    }
  };

  componentDidUpdate(prevProps) {
    const {restaurantList, clearAppStateData, autoComplete} = this.props;
    if (restaurantList && restaurantList !== prevProps.restaurantList) {
      if (restaurantList.data) {
        this.setRestaurantData(restaurantList.data);
      } else {
        this.setState({
          restaurants: [],
        });
      }
    }

    if (
      this.props.appState &&
      this.props.appState.FETCH_FAVOURITE &&
      this.props.appState.FETCH_FAVOURITE !== prevProps.appState.FETCH_FAVOURITE
    ) {
      this.fetchFavResList();
    }

    if (
      this.props.appState &&
      this.props.appState.FETCH_FILTERED_DATA &&
      this.props.appState.FETCH_FILTERED_DATA !=
        prevProps.appState.FETCH_FILTERED_DATA
    ) {
      clearAppStateData('FETCH_FILTERED_DATA');
    }

    if (this.props.appState !== prevProps.appState) {
      this.fetchData();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.autoComplete &&
      nextProps.autoComplete !== prevState.autoComplete
    ) {
      return {autoComplete: nextProps.autoComplete};
    }
    return null;
  }

  setRestaurantData(data) {
    //alert(JSON.stringify(data));
    let unfilteredrestaurantList = data.slice(0);

    const restaurantList = [
      ...new Set(unfilteredrestaurantList.map(obj => JSON.stringify(obj))),
    ].map(str => JSON.parse(str));

    const {sorting} = this.state;
    // restaurantList = getSortedRestaurants(restaurantList, sorting);
    this.setState(
      {
        restaurants: restaurantList,
      },
      () => {
        this.fetchFavResList();
      },
    );

    //console.log('SET RESTAURANT DATA', restaurantList);
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
    this.setState({
      sorting: {
        [sortType]: value,
      },
    });
  }

  handleSorting() {
    // const { restaurants, sorting } = this.state;
    //console.log('SORTING', restaurants);
    // let restaurantList = restaurants.slice(0);
    // restaurantList = getSortedRestaurants(restaurantList, sorting);
    this.fetchData().then(restaurants => {
      this.setState(
        {
          // restaurants
        },
        () => {
          this.fetchFavResList();
        },
      );
      this.closeModal();
    });

    //console.log('SORTING', restaurantList);
  }

  triggerSearch() {
    const {fetchRestaurantList, appState} = this.props;
    const {sorting} = this.state;
    const filters = appState.FILTERS ? appState.FILTERS : {};
    this.setState({
      showAutocompleteOptions: false,
    });

    const newSearchParams = this.fetchModifiedFiltersAndSearchText(filters);
    const modifiedFilters = newSearchParams.modifiedFilters;
    const confirmedSearchText = newSearchParams.confirmedSearchText;
    appState.FILTERS = modifiedFilters;

    // fetchRestaurantList(
    // 	filters,
    // 	searchText,
    // 	appState.CURRENT_LOCATION,
    // 	sorting
    // );

    fetchRestaurantList(
      modifiedFilters,
      confirmedSearchText,
      appState.CURRENT_LOCATION,
      sorting,
    );
  }

  changeAutocompleteFilters = async () => {
    const {autoComplete} = this.props;
    const {searchText, autocompleteList} = this.state;
    if (!autoComplete.data) {
      return;
    }
    if (!searchText) {
      this.setState({showAutocompleteOptions: false});
      return;
    } else {
      this.setState({showAutocompleteOptions: true});
    }
    let tempArray = autoComplete.data.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    this.setState({autocompleteList: tempArray});
  };

  _keyExtractor(item) {
    return item.id;
  }

  handleLoadMore() {
    const {restaurantList, appState, fetchRestaurantList} = this.props;
    const {sorting, restaurants, loading} = this.state;
    if (
      restaurantList &&
      restaurantList.data &&
      restaurants.length < restaurantList.count
    ) {
      let filters = {};
      if (appState.FILTERS) {
        filters = appState.FILTERS;
      }

      const newSearchParams = this.fetchModifiedFiltersAndSearchText(filters);
      const modifiedFilters = newSearchParams.modifiedFilters;
      const confirmedSearchText = newSearchParams.confirmedSearchText;
      appState.FILTERS = modifiedFilters;

      if (!loading) {
        this.setState({loading: true}, () => {
          if (this.state.loading) {
            fetchRestaurantList(
              // filters,
              // searchText,
              modifiedFilters,
              confirmedSearchText,
              appState.CURRENT_LOCATION,
              sorting,
              restaurantList.page + 1,
            ).then(res => {
              this.setState({loading: false});
            });
          }
        });
      }
    }
  }

  handleRefresh() {
    this.setState({refreshing: true});
    this.fetchData()
      .then(res => this.setState({refreshing: false}))
      .catch(err => this.setState({refreshing: false}));
  }

  render() {
    const {
      userDetail,
      restaurantList,
      navigation,
      appState,
      autoComplete,
    } = this.props;
    const {
      modalX,
      sorting,
      searchText,
      restaurants,
      favouriteRestaurants,
      refreshing,

      alertSize,
      alertSuccess,
      alertTitle,
      alertDetail,
      alertButton,
      alertOnClose,
      alertChildren,

      onboardingModalVisible,
      popupBannerModalVisible,
      popups,
      showAutocompleteOptions,
      autocompleteList,
    } = this.state;

    // if (!restaurantList || restaurantList.isFetching) {
    // 	return <LoadingIndicator />;
    // }

    if (!restaurantList) {
      return <LoadingIndicator />;
    }

    let isSignedIn = false;
    if (userDetail) {
      isSignedIn = true;
    }

    return (
      <View style={styles.container}>
        {appState && (appState.SHOW_FILTER_VIEW || appState.SHOW_MY_VIEW) ? (
          <View
            style={{
              marginBottom: 10,
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: '30%'}} />
            {appState &&
            (appState.SHOW_FILTER_VIEW || appState.SHOW_MY_VIEW) ? (
              <View style={{width: '40%', alignItems: 'center'}}>
                <Text
                  allowFontScaling={false}
                  style={[cs.textBold, cs.font16]}
                  fontVisby={true}>
                  {appState.SHOW_MY_VIEW ? 'Your View' : 'Your Search'}
                </Text>
              </View>
            ) : null}

            {appState &&
            (appState.SHOW_FILTER_VIEW || appState.SHOW_MY_VIEW) ? (
              <View
                style={{
                  width: '30%',
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    const {fetchRestaurantList} = this.props;
                    this.props.clearAppStateData('SHOW_FILTER_VIEW');
                    this.props.clearAppStateData('SHOW_MY_VIEW');
                    this.props.setAppStateData('FILTERS', null);
                    // fetchRestaurantList(
                    // 	{},
                    // 	searchText,
                    // 	appState.CURRENT_LOCATION,
                    // 	sorting
                    // );
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={[cs.font12, cs.textBold, {color: '#737373'}]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : null}

        <View
          style={{
            alignItems: 'flex-start',
            marginBottom: 10,
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={this.openModal.bind(this)}
            style={{
              flexDirection: 'row',
              width: '17%',
              alignItems: 'flex-start',
            }}>
            <Text
              allowFontScaling={false}
              style={[cs.textWhite, cs.font12, cs.textBold, {paddingRight: 5}]}>
              Sort
            </Text>
            <Image
              source={require('../../images/icons/dropdown_arrow.png')}
              style={{
                height: 5,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginTop: 3,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <TextInput
              style={styles.searchInput}
              placeholderTextColor={'#737373'}
              placeholder=""
              onChangeText={text =>
                this.setState(
                  {searchText: text},
                  //this.triggerSearch.bind(this)
                  this.changeAutocompleteFilters.bind(this),
                )
              }
              value={searchText}
              onSubmitEditing={this.triggerSearch.bind(this)}
            />
            <TouchableOpacity
              onPress={this.triggerSearch.bind(this)}
              style={{
                alignItems: 'center',
                position: 'absolute',
                right: 0,
              }}>
              <Image
                source={require('../../images/icons/search.png')}
                style={{height: 15, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            {/* where autocomplete view used to be */}
          </View>
        </View>

        {/* <ScrollView
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.handleRefresh.bind(this)}
						/>
					}> */}

        {showAutocompleteOptions && (
          <View
            style={
              appState.SHOW_FILTER_VIEW || appState.SHOW_MY_VIEW
                ? {
                    position: 'absolute',
                    width: '100%',
                    left: 25,
                    right: 0,
                    top: 90,
                    zIndex: 100,
                  }
                : {
                    position: 'absolute',
                    width: '100%',
                    left: 25,
                    right: 0,
                    top: 45,
                    zIndex: 100,
                  }
            }>
            <View
              style={[
                styles.autocompleteContainer,
                {
                  width: '100%',
                },
              ]}>
              <ScrollView>
                {autocompleteList.map((option, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.autocompleteOption]}
                    onPress={() => {
                      this.setState(
                        {
                          searchText: option.name,
                        },
                        this.triggerSearch.bind(this),
                        // () => {
                        // 	this.triggerSearch.bind(this)
                        // }
                      );
                    }}>
                    <Text style={[cs.textCenter, cs.textWhite, cs.textBold]}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
        <View
          style={{
            paddingTop: 15,
            paddingBottom:
              appState && (appState.SHOW_FILTER_VIEW || appState.SHOW_MY_VIEW)
                ? 100
                : 50,
          }}>
          {restaurants && restaurants.length ? (
            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                onRefresh={this.handleRefresh.bind(this)}
                refreshing={this.state.refreshing}
                data={restaurants}
                keyExtractor={this._keyExtractor.bind(this)}
                initialNumToRender={1000} //fix for the sudden empty data when scrolling fast
                //removeClippedSubviews={true} //this line is supposedly buggy for iOS, so dont use for now
                getItemLayout={getItemLayout}
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
                      onRating={ratingBreakdown =>
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
                        })
                      }
                      isFavourite={
                        favouriteRestaurants &&
                        favouriteRestaurants.indexOf(event.item.id) !== -1 &&
                        isSignedIn
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
                onEndReached={this.handleLoadMore.bind(this)}
                onEndReachedThreshold={0.8}
              />
              {popups &&
              popups.length &&
              appState.ALLOW_POPUP_TO_SHOW &&
              appState.POPUPS_AVAILABLE ? (
                <View style={styles.popupButton}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setPopupBannerDetailsVisible(true);
                      }}
                      style={{flex: 9}}>
                      <Text
                        style={{
                          paddingTop: 10,
                          paddingLeft: 10,
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        {popups.length == 1
                          ? popups[0].summary
                          : popups.length + ' new events/offers available'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.clearAppStateData('ALLOW_POPUP_TO_SHOW');
                      }}
                      style={{flex: 1}}>
                      <Text
                        style={{
                          paddingTop: 10,
                          paddingLeft: 10,
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        X
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
          ) : (
            <Text style={[cs.paddingTB30, cs.textCenter, cs.textOrange]}>
              {restaurantList.isFetching
                ? 'Get ready to be hungry.. Looking for honest restaurant recommendations nearby you'
                : 'No restaurants found!'}
            </Text>
          )}
        </View>
        {/* </ScrollView> */}

        <Alert
          title={alertTitle}
          size={alertSize}
          detail={alertDetail}
          button={alertButton ? alertButton : 'GOT IT'}
          visible={alertSuccess}
          onClose={alertOnClose}>
          {alertChildren}
        </Alert>

        <Alert
          title="Logged In Users Only"
          size="small"
          detail="You need to log in to use this feature"
          button="OK"
          visible={appState.PROMPT_ONLY_USER_ALLOWED_ALERT}
          onClose={() => {
            this.props.clearAppStateData('PROMPT_ONLY_USER_ALLOWED_ALERT');
          }}
        />

        <ModalWrapper modalX={modalX}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[cs.padding20, styles.modalContainer]}>
              <View style={styles.sortRow}>
                <View style={styles.sortField}>
                  <Text
                    allowFontScaling={false}
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
                      allowFontScaling={false}
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
                  <Text
                    allowFontScaling={false}
                    style={[cs.textWhite, styles.textSeparator]}>
                    |
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.changeSort('location', 'far')}>
                    <Text
                      allowFontScaling={false}
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

              {/*
                            <View style={styles.sortRow}>
                                <View style={styles.sortField}>
                                    <Text style={[cs.font12, cs.textBold, cs.textWhite, (sorting.price) ? cs.textOrange : cs.textWhite]}>
                                        Price
                                    </Text>
                                </View>
                                <View style={styles.sortFieldOptions}>
                                    <TouchableOpacity onPress={() => this.changeSort('price', 'low')}>
                                        <Text style={[styles.sortOption, cs.font12, cs.textWhite, (sorting.price && sorting.price === 'low') ? cs.textOrange : cs.textWhite]}>
                                            Low
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={[cs.textWhite, styles.textSeparator]}>|</Text>
                                    <TouchableOpacity onPress={() => this.changeSort('price', 'high')}>
                                        <Text style={[styles.sortOption, cs.font12, cs.textWhite, (sorting.price && sorting.price === 'high') ? cs.textOrange : cs.textWhite]}>
                                            High
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            */}

              <View style={styles.sortRow}>
                <View style={styles.sortField}>
                  <Text
                    allowFontScaling={false}
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
                      allowFontScaling={false}
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
                  <Text
                    allowFontScaling={false}
                    style={[cs.textWhite, styles.textSeparator]}>
                    |
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.changeSort('rating', 'high')}>
                    <Text
                      allowFontScaling={false}
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
                    allowFontScaling={false}
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
                      allowFontScaling={false}
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
                  <Text
                    allowFontScaling={false}
                    style={[cs.textWhite, styles.textSeparator]}>
                    |
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.changeSort('restaurant', 'descending')}>
                    <Text
                      allowFontScaling={false}
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

        <Modal
          animationType="slide"
          transparent={false}
          visible={onboardingModalVisible}
          onRequestClose={() => {}}>
          <View style={{flex: 1}}>
            <OnboardingModal
              setModalVisible={this.setOnboardingModalVisible.bind(this)}
              navigation={navigation}
            />
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={popupBannerModalVisible}
          onRequestClose={() => {}}>
          <View style={{flex: 1}}>
            <PopupBanner
              setModalVisible={this.setPopupBannerDetailsVisible.bind(this)}
              data={popups}
              adPopupClickedEvent={this.adPopupClickedEvent.bind(this)}
            />
          </View>
        </Modal>
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
    borderRadius: 30,
    padding: 8,
    fontSize: 11,
    color: '#fff',
    paddingRight: 40,
    paddingLeft: 15,
  },
  secondaryButton: {
    borderWidth: 2,
    borderRadius: 6,
    paddingTop: 4,
    paddingBottom: 8,
    paddingLeft: 25,
    paddingRight: 25,
    borderColor: '#fff',
    marginTop: 20,
  },
  popupButton: {
    height: 60,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 6,
    backgroundColor: '#F2910A',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  autocompleteContainer: {
    backgroundColor: '#F2910A',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 150,
  },
  autocompleteOption: {
    borderBottomWidth: 1,
    borderColor: '#fff',
    padding: 5,
  },
});

function mapStateToProps(state) {
  return {
    userDetail: state.userDetail,
    restaurantList: state.restaurantList,
    appState: state.appState,
    autoComplete: state.autocomplete,
  };
}

export default connect(mapStateToProps, {
  fetchRestaurantList: fetchRestaurants,
  setAppStateData: setAppState,
  clearAppStateData: clearAppState,
})(HomeScreen);
