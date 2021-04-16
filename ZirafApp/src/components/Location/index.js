import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapView from 'react-native-map-clustering';
import { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
	StyleSheet,
	Image,
	Linking,
	TouchableOpacity,
	Dimensions,
	View
} from 'react-native';

import { setAppState, fetchRestaurants } from '../../js/actions/actionCreators';
import Text from './../common/Text';
import LoadingIndicator from './../common/LoadingIndicator';
import cs from './../../styles/common-styles';
import Geolocation from '@react-native-community/geolocation';

const { height, width } = Dimensions.get('window');

const INITIAL_REGION = {
	latitude: 51.51,
	longitude: -0.12,
	latitudeDelta: 5,
	longitudeDelta: 5,
};

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;//0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Location extends Component {
	constructor(args) {
		super(args);
		this.state = {
			region: null,
			origin: null,
			destination: null,
			loading: false
		};
		this.reg = null;
	}

	componentDidMount() {
		const { appState, navigation } = this.props;
		
		this.setSearch();

		// const address = navigation.getParam('address');
		// const locations = navigation.getParam('location');
		// let location = {};
		// if (locations) {
		// 	location['latitude'] = parseFloat(locations.lat.toFixed(4));
		// 	location['longitude'] = parseFloat(locations.lon.toFixed(4));

		// 	if (appState && appState.CURRENT_LOCATION) {
		// 		const data = {
		// 			origin: {
		// 				...location
		// 			},
		// 			destination: {
		// 				latitude: appState.CURRENT_LOCATION.coords.latitude,
		// 				longitude: appState.CURRENT_LOCATION.coords.longitude
		// 			}
		// 		};
		// 		this.setState({ ...data }, () => {
		// 			this.setNewLocation({
		// 				latitude: appState.CURRENT_LOCATION.coords.latitude,
		// 				longitude: appState.CURRENT_LOCATION.coords.longitude
		// 			});
		// 		});
		// 	} else {
		// 		this.setNewLocation(location);
		// 	}
		// } else if (appState && appState.CURRENT_LOCATION) {
		// 	location['latitude'] = appState.CURRENT_LOCATION.coords.latitude;
		// 	location['longitude'] = appState.CURRENT_LOCATION.coords.longitude;
		// 	this.setNewLocation(location);
		// }
	}

	updateMap() {
		const { appState, navigation } = this.props;
		const locations = navigation.getParam('location');
		let location = {};
		location['latitude'] = appState.CURRENT_LOCATION.coords.latitude;
		location['longitude'] = appState.CURRENT_LOCATION.coords.longitude;

		if (locations) {
			location['latitude'] = parseFloat(locations.lat.toFixed(4));
			location['longitude'] = parseFloat(locations.lon.toFixed(4));

			if (appState && appState.CURRENT_LOCATION) {
				const data = {
					origin: {
						...location
					},
					destination: {
						latitude: appState.CURRENT_LOCATION.coords.latitude,
						longitude: appState.CURRENT_LOCATION.coords.longitude
					}
				};

				this.setState({ ...data }, () => {
					this.setNewLocation({
						latitude: appState.CURRENT_LOCATION.coords.latitude,
						longitude: appState.CURRENT_LOCATION.coords.longitude
					});
				});
			} else {
				// this.setNewLocation(location);
			}
		} else {
			// this.setNewLocation(location);
		}
	}

	handleLoadMore() {
		const { restaurantList, appState, fetchRestaurantList } = this.props;

		if (
			restaurantList &&
			restaurantList.data &&
			restaurantList.data.length < restaurantList.count
		) {
			let filters = {};
			if (appState.FILTERS) {
				filters = appState.FILTERS;
			}
			this.setState({ loading: true });
			fetchRestaurantList(
				filters,
				'',
				appState.CURRENT_LOCATION,
				{ location: 'near' },
				restaurantList.page + 1
			)
				.then(res => this.setState({ loading: false }))
				.catch(err => this.setState({ loading: false }));
		}
	}

	setSearch() {
		const { appState, navigation } = this.props;
		const locations = navigation.getParam('location');
		let location = {};

		if (locations) {
			location['latitude'] = parseFloat(locations.lat.toFixed(4));
			location['longitude'] = parseFloat(locations.lon.toFixed(4));

			if (appState && appState.CURRENT_LOCATION) {
				const data = {
					origin: {
						...location
					},
					destination: {
						latitude: appState.CURRENT_LOCATION.coords.latitude,
						longitude: appState.CURRENT_LOCATION.coords.longitude
					}
				};
				this.setState({ ...data }, () => {
					this.setNewLocation(location);
				});
			} else {
				this.setNewLocation(location);
			}
		} else {
		}
	}

	handleDefaultInput() {
		return '';
	}

	setNewLocation(location) {
		const { fetchRestaurantList, appState } = this.props;

		if (location.latitude && location.longitude) {
			let region = {
				latitude: location.latitude,
				longitude: location.longitude,
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA
			};

			let filters = {};
			if (appState.FILTERS) {
				filters = appState.FILTERS;
			}

			this.setState(
				{
					region: this.reg ? this.reg : region
				},
				() => {
					const { region } = this.state;
					let location = {
						coords: {
							latitude: region.latitude,
							longitude: region.longitude
						}
					};
					this.moveToCurrentLocation();
					// fetchRestaurantList(filters, '', location);
				}
			);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { appState, navigation } = this.props;

		//this.moveToCurrentLocation();
		if (
			prevProps.navigation &&
			prevProps.navigation.getParam('location') !==
				navigation.getParam('location')
		) {
			// this.updateMap();
		}

		if (
			prevProps.appState &&
			prevProps.appState.FILTERS !== appState.FILTERS
		) {
			// this.updateMap();
		}
		// this.updateMap();

		if (this.props.navigation !== prevProps.navigation) {
			this.setSearch();
		}
	}

	handleOpenURL(url) {
		if (url) {
			Linking.canOpenURL(url)
				.then(supported => {
					if (supported) {
						Linking.openURL(url).catch(err =>
							alert('cannot open url')
						);
					} else {
						//console.log(
						// 	"Don't know how to open URI: " + this.props.url
						// );
					}
				})
				.catch(err => {
					alert('cannot open url');
				});
		}
	}

	handleNavigation(navigateData) {
		const { navigation } = this.props;

		navigation.navigate('RestaurantDetail', navigateData);
	}

	moveToCurrentLocation() {
		Geolocation.getCurrentPosition(
			({ coords }) => {
				if (this.map) {
					this.map.animateToRegion({
						latitude: coords.latitude,
						longitude: coords.longitude,
						latitudeDelta: LATITUDE_DELTA,
						longitudeDelta: LONGITUDE_DELTA
					});
				}
			},
			error => alert('Error: Are location services on?'),
			{ enableHighAccuracy: true }
		);
	}

	render() {
		const {
			appState,
			setAppStateData,
			navigation,
			restaurantList
		} = this.props;
		const { region, origin, destination, loading } = this.state;

		const direction = navigation.getParam('direction');
		let restaurantLocations = [];
		if (restaurantList && restaurantList.data) {
			restaurantList.data.map(restaurant => {
				if (restaurant.location) {
					restaurantLocations.push({
						latitude: restaurant.location.lat,
						longitude: restaurant.location.lon,
						latitudeDelta: LATITUDE_DELTA,
						longitudeDelta: LONGITUDE_DELTA,
						title: restaurant.title,
						description: restaurant.address,
						id: restaurant.id
					});
				}
			});
		}

		return (
			<View style={styles.container}>
				<MapView
					// ref={map => {
					// 	this.map = map;
					// }}
					mapRef={map => this.map = map}
					clusterColor={"#F2910A"}
					initialRegion={INITIAL_REGION}
					onRegionChangeComplete={region => {
						this.reg = region;
					}}
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					// region={
					// 	this.reg
					// 		? this.reg
					// 		: region
					// 		? region
					// 		: {
					// 				latitude: 51.507351,
					// 				longitude: -0.127758,
					// 				latitudeDelta: LATITUDE_DELTA,
					// 				longitudeDelta: LONGITUDE_DELTA
					// 		  }
					// }
					showsUserLocation={true}
					//loadingEnabled={true}>
					>
					{restaurantLocations.length
						? restaurantLocations
								.filter(rest => {
									return origin && destination
										? rest.id ===
												navigation.getParam(
													'restaurantId'
												)
										: true;
								})
								.map((reg, idx) => (
									<Marker
										key={idx}
										coordinate={reg}
										icon={require('../../images/icons/ziraf-map-pin.png')}
										title={reg.title}
										description={reg.description}
										tracksViewChanges={false}
										onPress={() => {}}>
										<Callout
											onPress={() => {
												this.handleNavigation({
													id: reg.id,
													origin: 'Location'
												});
											}}>
											<View
												style={{
													width: 200,
													margin: 5
												}}>
												<Text
													style={[
														cs.textBold,
														cs.textGray,
														cs.font18
													]}>
													{reg.title}
												</Text>
												<Text
													style={[
														cs.textGray,
														cs.font12,
														{ marginBottom: 5 }
													]}>
													{reg.description}
												</Text>
												<Text
													style={[
														cs.textOrange,
														cs.font12,
														cs.textCenter
													]}>
													Click for restaurant details
												</Text>
											</View>
										</Callout>
									</Marker>
								))
						: null}

					{origin && destination ? (
						<MapViewDirections
							origin={origin}
							destination={destination}
							apikey={`AIzaSyBPv9YaScdysg8NOEyGfeI9v7oyDGxQerg`}
							strokeWidth={5}
							strokeColor={'#F2910A'}
						/>
					) : null}
				</MapView>

				<View style={[styles.googlePlacesSearchContainer]}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={{
							alignSelf: 'center',
							position: 'absolute',
							left: 5
						}}>
						<Image
							source={require('../../images/icons/ChevronLeftOrange.png')}
							style={{
								height: 18,
								resizeMode: 'contain',
								alignSelf: 'center',
								marginLeft: 5
							}}
						/>
					</TouchableOpacity>
					<GooglePlacesAutocomplete
						placeholderTextColor="#fff"
						placeholder="Craving for a restaurant?"
						minLength={2} // minimum length of text to search
						autoFocus={false}
						// returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
						keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
						listViewDisplayed={false} // true/false/undefined
						fetchDetails={true}
						renderDescription={row => row.description} // custom description render
						onPress={(data, details = null) => {
							// 'details' is provided when fetchDetails = true
							if (details && details.geometry) {
								const newLocation = {
									latitude: details.geometry.location.lat,
									longitude: details.geometry.location.lng
								};
								this.setNewLocation(newLocation);
							}
						}}
						getDefaultValue={this.handleDefaultInput.bind(this)}
						query={{
							// available options: https://developers.google.com/places/web-service/autocomplete
							key: 'AIzaSyBqhPI_mfwexM54nxLF3N_zoEMo1JiL0vQ',
							language: 'en', // language of the results
							types: ['address', '(regions)'] // default: 'geocode'
						}}
						styles={{
							textInputContainer: {
								width: '70%',
								backgroundColor: '#F2910A',
								alignSelf: 'center',
								borderColor: '#fff',
								borderTopWidth: 2,
								borderBottomWidth: 2,
								borderWidth: 2,
								borderBottomColor: '#fff',
								borderTopColor: '#fff',
								borderRadius: 20
							},
							textInput: {
								marginLeft: 0,
								marginRight: 0,
								color: '#fff',
								backgroundColor: '#F2910A',
								borderRadius: 25,
								padding: 10,
								paddingLeft: 20,
								paddingRight: 20,
								fontSize: 12
							},

							description: {
								fontWeight: 'bold'
							},
							predefinedPlacesDescription: {
								color: '#1faadb',
								marginLeft: 5,
								marginRight: 5
							},
							listView: {
								backgroundColor: '#fff',
								borderRadius: 6,
								marginRight: 50,
								marginLeft: 50
							}
						}}
						currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
						currentLocationLabel="Current location"
						nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
						GoogleReverseGeocodingQuery={
							{
								// available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
							}
						}
						GooglePlacesSearchQuery={{
							// available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
							rankby: 'distance',
							type: 'cafe'
						}}
						GooglePlacesDetailsQuery={{
							// available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
							fields: 'formatted_address'
						}}
						filterReverseGeocodingByTypes={[
							'locality',
							'administrative_area_level_3'
						]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
						predefinedPlaces={[]}
						debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
						renderLeftButton={() => null}
						renderRightButton={() => null}
					/>
					{appState.FILTERS ? (
						<TouchableOpacity
							style={[styles.clearButton, { marginTop: 20 }]}
							onPress={() => {
								setAppStateData('FILTERS', null);
								setAppStateData('SHOW_FILTER_VIEW', false);
							}}>
							<Text
								style={[cs.textBold, cs.textOrange, cs.font12]}>
								Clear Filter
							</Text>
						</TouchableOpacity>
					) : null}
				</View>

				<View style={[styles.clearButtonContainer]}>
					{origin === null &&
					destination === null &&
					restaurantList &&
					restaurantList.data ? (
						restaurantList.data.length < restaurantList.count ? (
							<View style={[styles.bottomButtonContainer]}>
								<Text
									style={[
										cs.textBold,
										cs.textOrange,

										cs.font12,
										{
											marginLeft: 20,
											marginRight: 20
										}
									]}>
									Showing {restaurantList.data.length} /{' '}
									{restaurantList.count} Restaurants
								</Text>
								<TouchableOpacity
									disabled={loading}
									style={[
										styles.directionButton,
										{ marginTop: 10, marginBottom: 20 }
									]}
									onPress={this.handleLoadMore.bind(this)}>
									<Text style={[cs.textBold, cs.font12]}>
										Load more
									</Text>
								</TouchableOpacity>
							</View>
						) : (
							<View style={[styles.bottomButtonContainer]}>
								<Text
									style={[
										cs.textBold,
										cs.textOrange,

										cs.font12,
										{
											marginLeft: 20,
											marginRight: 20
										}
									]}>
									Showing {restaurantList.data.length}{' '}
									Restaurants
								</Text>
							</View>
						)
					) : null}

					<View style={[styles.cornerButtonContainer]}>
						<TouchableOpacity
							style={[styles.clearButton]}
							onPress={this.moveToCurrentLocation.bind(this)}>
							<Image
								source={require('../../images/icons/icon-target.png')}
								style={{
									width: 30,
									height: 30,
									resizeMode: 'contain',
									alignSelf: 'center'
								}}
							/>
						</TouchableOpacity>
					</View>

					{origin && destination ? (
						<View style={[styles.bottomButtonContainer]}>
							<Text
								style={[
									cs.textBold,
									cs.textOrange,
									{
										marginBottom: 10,
										marginLeft: 20,
										marginRight: 20
									}
								]}>
								{navigation.getParam('address')}
							</Text>
							{navigation.getParam('direction') ? (
								<TouchableOpacity
									style={[styles.directionButton]}
									onPress={() => {
										this.handleOpenURL(
											navigation.getParam('direction')
										);
									}}>
									<Text style={[cs.textBold, cs.textWhite]}>
										Get Directions
									</Text>
								</TouchableOpacity>
							) : null}
							<TouchableOpacity
								style={[styles.clearButton]}
								onPress={() => {
									this.setState({
										origin: null,
										destination: null
									});
								}}>
								<Text
									style={[
										cs.textBold,
										cs.textOrange,
										cs.font12
									]}>
									Clear Direction Line
								</Text>
							</TouchableOpacity>
						</View>
					) : null}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	googlePlacesSearchContainer: {
		marginTop: 80,
		width: '100%',
		position: 'absolute',
		top: 0,
		zIndex: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
	clearButtonContainer: {
		position: 'absolute',
		width: '100%',
		bottom: 0,
		marginBottom: 80,
		alignItems: 'center'
	},

	bottomButtonContainer: {
		alignItems: 'center'
	},

	directionButton: {
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		borderWidth: 2,
		borderColor: '#FFF',
		backgroundColor: '#F2910A',
		borderRadius: 20,
		marginBottom: 20
	},
	clearButton: {
		padding: 5,
		paddingLeft: 10,
		paddingRight: 10,
		borderWidth: 2,
		borderColor: '#F2910A',
		backgroundColor: '#FFF',
		borderRadius: 15
	},
	cornerButtonContainer: {
		position: 'absolute',
		zIndex: 100,
		width: 40,
		height: 40,
		bottom: 0,
		right: 20
	}
});

function mapStateToProps(state) {
	return {
		restaurantList: state.restaurantList,
		userDetail: state.userDetail,
		appState: state.appState
	};
}

export default connect(
	mapStateToProps,
	{
		fetchRestaurantList: fetchRestaurants,
		setAppStateData: setAppState
	}
)(Location);
