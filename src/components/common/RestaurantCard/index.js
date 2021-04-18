import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, Image, Linking} from 'react-native';
import FastImage from 'react-native-fast-image';
import AlertTransport from '../AlertTransport';
import Text from './../Text';
import {restaurantSendAnalytics} from '../../../js/utils';

class RestaurantCard extends React.PureComponent {
  constructor(args) {
    super(args);
    this.state = {
      alertTransport: false,
    };
  }

  handleNavigation(restaurantId) {
    const {data, navigation} = this.props;
    navigation.navigate('RestaurantDetail', {id: restaurantId});
  }

  handleMap(address, location, direction, restaurantId) {
    const {data, navigation} = this.props;
    navigation.navigate('Location', {
      address,
      location,
      direction,
      restaurantId,
    });
  }

  handleRestaurantAnalytics(restaurantName, type, url) {
    const {isSignedIn, onLoggedInUserOnly} = this.props;
    if (isSignedIn) {
      let data = {
        restaurant: restaurantName,
        redirect_type: type,
        link: url,
      };

      restaurantSendAnalytics(data).then(resp => {
        this.handleOpenURL(url);
      });
    } else {
      onLoggedInUserOnly();
    }
  }

  handleOpenURL(url) {
    if (url) {
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url).catch(err => alert('cannot open url'));
          } else {
            // //console.log(
            // 	"Don't know how to open URI: " + this.props.url
            // );
          }
        })
        .catch(err => {
          alert('cannot open url');
        });
    }
  }

  handleRating(ratingBreakdown) {
    const {onRating} = this.props;
    if (onRating) {
      // alert(JSON.stringify(ratingBreakdown));
      onRating(ratingBreakdown);
    }
  }

  handleDiscount(discountData) {
    const {onDiscount} = this.props;
    if (onDiscount) {
      onDiscount(discountData);
    }
  }

  render() {
    const {data, navigation, isFavourite} = this.props;
    const {alertTransport, alertOnClose} = this.state;

    if (!data) {
      return null;
    }

    return (
      <View
        style={[
          styles.container,
          data.isSuspended ? styles.opacityTranslucent : styles.opacityVisible,
        ]}>
        <AlertTransport
          data={data}
          visible={alertTransport}
          onClose={() => this.setState({alertTransport: false})}
        />

        <TouchableOpacity onPress={this.handleNavigation.bind(this, data.id)}>
          <View style={{flex: 1}}>
            <View>
              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                style={styles.cardImage}
                source={{uri: data.image.preview}}
              />
              <TouchableOpacity
                style={styles.rating}
                onPress={this.handleRating.bind(this, data.ratingBreakdown)}>
                <Text
                  allowFontScaling={false}
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                  fontVisby={true}>
                  {data.rating ? data.rating.toFixed(1) : '0.0'}
                </Text>
              </TouchableOpacity>

              {isFavourite ? (
                <View style={styles.favouriteContainer}>
                  <Image
                    style={{
                      height: 20,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                      marginRight: 5,
                    }}
                    source={require('../../../images/icons/favourite_active.png')}
                  />
                </View>
              ) : null}

              {data.offers ? (
                <View style={styles.discountContainer}>
                  {data.offers.percentage && data.offers.description ? (
                    <TouchableOpacity
                      onPress={this.handleDiscount.bind(this, data.offers)}>
                      <Image
                        style={{
                          height: 22,
                          width: 50,
                          resizeMode: 'contain',
                          alignSelf: 'center',
                          marginRight: 5,
                        }}
                        source={require('../../../images/icons/discount_offer.png')}
                      />
                      <Text
                        allowFontScaling={false}
                        style={{
                          position: 'absolute',
                          top: 2,
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 'bold',
                          alignSelf: 'center',
                        }}
                        fontVisby={true}>
                        {!isNaN(data.offers.percentage) &&
                        (data.offers.percentage > 0 &&
                          data.offers.percentage < 101)
                          ? data.offers.percentage + '% '
                          : 'DEAL '}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  position: 'absolute',
                  bottom: -12,
                  alignSelf: 'center',
                }}>
                {data.delivery ? (
                  <TouchableOpacity
                    onPress={this.handleRestaurantAnalytics.bind(
                      this,
                      data.title,
                      'delivery',
                      data.delivery,
                    )}>
                    <View style={styles.ctaBg}>
                      <Image
                        source={require('../../../images/icons/take-away-icon.png')}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ) : null}

                {data.reservation ? (
                  <TouchableOpacity
                    onPress={this.handleRestaurantAnalytics.bind(
                      this,
                      data.title,
                      'reservation',
                      data.reservation,
                    )}>
                    <View style={styles.ctaBg}>
                      <Image
                        source={require('../../../images/icons/reservation-icon.png')}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ) : null}

                {data.transport ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        alertTransport: true,
                      });
                    }}>
                    <View style={styles.ctaBg}>
                      <Image
                        source={require('../../../images/icons/taxi-icon.png')}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text
                allowFontScaling={false}
                style={styles.name}
                fontVisby={true}>
                {data.title}
              </Text>
              {data.distance ? (
                <TouchableOpacity
                  // onPress={this.handleMap.bind(
                  // 	this,
                  // 	data.address,
                  // 	data.location && {
                  // 		lat: data.location.lat,
                  // 		lon: data.location.lon
                  // 	},
                  // 	data.direction,
                  // 	data.id
                  // )}
                  onPress={this.handleOpenURL.bind(
                    this,
                    'https://www.google.com/maps/dir/?api=1&destination=' +
                      data.location.lat +
                      ',' +
                      data.location.lon,
                  )}
                  style={styles.distanceContainer}>
                  <Image
                    style={{
                      height: 20,
                      width: 30,
                      resizeMode: 'contain',
                      marginTop: 5,
                    }}
                    source={require('../../../images/icons/NavigationCircle.png')}
                  />

                  <View style={{alignItems: 'flex-end'}}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 12,
                        color: '#F2910A',
                      }}>
                      Directions
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: '#fff',
                        fontSize: 10,
                      }}>{`${data.distance.toFixed(2)} Mi`}</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1d1d1c',
    marginBottom: 15,
  },
  opacityVisible: {
    opacity: 1,
  },
  opacityTranslucent: {
    opacity: 0.3,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  name: {
    color: '#F2910A',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    width: '70%',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
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
  favouriteContainer: {
    position: 'absolute',
    right: 0,
    marginTop: 40,
  },
  discountContainer: {
    position: 'absolute',
    right: 0,
    marginTop: 70,
  },
  ctaBg: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d1d1c',
    padding: 8,
    borderRadius: 30,
    margin: 5,
  },
});

export default RestaurantCard;
