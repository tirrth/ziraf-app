import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
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

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const TOP_DISHES_STATIC_DATA = [
  {
    image: {
      detail: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
      preview: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
      width: 300,
      height: 300,
    },
    price: 5.2,
    name: 'Name of the dish',
  },
  {
    image: {
      detail: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
      preview: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
      width: 300,
      height: 300,
    },
    price: 5.2,
    name: 'Name of the dish',
  },
  {
    image: {
      detail: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
      preview: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
      width: 300,
      height: 300,
    },
    price: 5.2,
    name: 'Name of the dish',
  },
];

class MyOrders extends Component {
  constructor(args) {
    super(args);
    this.state = {
      currentTab: 'pending',
    };
  }

  handleTabChange(tab) {
    this.setState({
      currentTab: tab,
    });
  }

  handleGoBack() {
    const {navigation} = this.props;

    const origin = navigation.getParam('origin');
    if (origin) {
      navigation.goBack();
      navigation.navigate(origin);
    } else {
      navigation.goBack();
    }
  }

  render() {
    const {userDetail, navigation} = this.props;
    const {currentTab} = this.state;
    const isSignedIn = userDetail ? true : false;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#1d1d1c'}}>
        <View style={styles.container}>
          <ScrollView>
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

            <View style={{padding: 15}}>
              {currentTab === 'pending' && <PendingOrders />}
              {currentTab === 'accepted' && <AcceptedOrders />}
              {currentTab === 'rejected' && <RejectedOrders />}
            </View>
          </ScrollView>
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
    paddingLeft: 8,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  imageBanner: {
    width: '100%',
    height: 200,
  },
  name: {
    color: '#F2910A',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 8,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rating: {
    backgroundColor: '#F2910A',
    position: 'absolute',
    right: 0,
    paddingTop: 1,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
    marginRight: 8,
    marginTop: 6,
  },
  backNavContainer: {
    position: 'absolute',
    left: 0,
    paddingRight: 5,
    borderRadius: 20,
    paddingLeft: 8,
    paddingTop: 8,
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
  favouriteContainer: {
    position: 'absolute',
    right: 0,
    marginTop: 40,
  },
  moreInfoContainer: {
    flexDirection: 'row',
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

export default connect(
  mapStateToProps,
  {
    fetchRestaurantDetailData: fetchRestaurantDetail,
    clearRestaurantDetailData: clearRestaurantDetail,
    setAppStateData: setAppState,
  },
)(MyOrders);
