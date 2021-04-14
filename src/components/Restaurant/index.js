import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	ScrollView,
	StyleSheet,
	View,
	Animated,
	TouchableWithoutFeedback,
	Dimensions,
	TouchableOpacity,
	Image,
	Linking,
	SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Swiper from 'react-native-swiper';
import {
	fetchRestaurantDetail,
	clearRestaurantDetail,
	setAppState
} from '../../js/actions/actionCreators';
import { getSortedReviews } from '../../js/utils';
import ModalWrapper from '../common/ModalWrapper';
import Text from '../common/Text';
import OperatingHours from './OperatingHours';
import TopDishCard from './TopDishCard';
import RestaurantReview from './Reviews';
import RestaurantMenu from './Menus';
import LoadingIndicator from '../common/LoadingIndicator';
import RatingBreakdown from '../common/RatingBreakdown';
import cs from '../../styles/common-styles';
import Alert from '../common/Alert';
import AlertTransport from '../common/AlertTransport';
import DiscountModal from '../common/DiscountModal';
import FastImage from 'react-native-fast-image';
import { restaurantSendAnalytics } from '../../js/utils';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const TOP_DISHES_STATIC_DATA = [
	{
		image: {
			detail: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
			preview: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
			width: 300,
			height: 300
		},
		price: 5.2,
		name: 'Name of the dish'
	},
	{
		image: {
			detail: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
			preview: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
			width: 300,
			height: 300
		},
		price: 5.2,
		name: 'Name of the dish'
	},
	{
		image: {
			detail: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
			preview: 'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
			width: 300,
			height: 300
		},
		price: 5.2,
		name: 'Name of the dish'
	}
];

class RestaurantDetail extends Component {
	constructor(args) {
		super(args);
		this.state = {
			currentTab: 'reviews',
			visible: false,
			modalX: new Animated.Value(-deviceHeight),
			sorting: {
				updates: 'latest'
			},
			isFavourite: false,
			reviews: [],
			alertTransport: false,

			alertSize: false,
			alertSuccess: false,
			alertTitle: 'Hi',
			alertDetail: '',
			alertButton: 'GOT IT',
			alertChildren: null,
			alertOnClose: () => {}
		};
		this.changeSort = this.changeSort.bind(this);
	}

	componentDidMount() {
		this.initData();
	}

	componentWillUnmount() {
		const { clearRestaurantDetailData } = this.props;
		clearRestaurantDetailData();
	}

	initData() {
		const {
			fetchRestaurantDetailData,
			navigation,
			restaurantDetail,
			restaurantReview,
			appState
		} = this.props;
		const id = navigation.getParam('id');

		if (
			!restaurantDetail ||
			!restaurantDetail.data ||
			restaurantDetail.data.id !== id
		) {
			fetchRestaurantDetailData(id, appState.CURRENT_LOCATION);
		}

		if (restaurantReview && restaurantReview.data) {
			this.setRestaurantReviewData(restaurantReview.data);
		}
		this.checkFavourite();
	}

	componentDidUpdate(prevProps) {
		const { restaurantReview } = this.props;
		if (
			restaurantReview &&
			restaurantReview !== prevProps.restaurantReview
		) {
			if (restaurantReview.data) {
				this.setRestaurantReviewData(restaurantReview.data);
			}
		}

		if (this.props.navigation !== prevProps.navigation) {
			this.initData();
		}
	}

	setRestaurantReviewData(data) {
		let reviewList = data.slice(0);
		const { sorting } = this.state;
		reviewList = getSortedReviews(reviewList, sorting);
		this.setState({
			reviews: reviewList
		});
	}

	checkFavourite = async () => {
		const { navigation } = this.props;
		const resId = navigation.getParam('id');

		let favouriteRestaurants = await AsyncStorage.getItem(
			'@Ziraf:favouriteRestaurants'
		);
		if (!favouriteRestaurants) {
			return;
		} else {
			favouriteRestaurants = JSON.parse(favouriteRestaurants);
		}
		let isFavourite = false;
		if (favouriteRestaurants.indexOf(resId) !== -1) {
			isFavourite = true;
		}
		this.setState({
			isFavourite
		});
	};

	handleTabChange(tab) {
		this.setState({
			currentTab: tab
		});
	}

	handleGoBack() {
		const { navigation } = this.props;

		const origin = navigation.getParam('origin');
		if (origin) {
			navigation.goBack();
			navigation.navigate(origin);
		} else {
			navigation.goBack();
		}
	}

	openSortModal() {
		const { modalX } = this.state;
		Animated.timing(modalX, {
			duration: 300,
			toValue: 0
		}).start();
	}

	closeModal() {
		const { modalX } = this.state;
		Animated.timing(modalX, {
			duration: 300,
			toValue: -deviceHeight
		}).start();
	}

	changeSort(sortType, value) {
		this.setState({
			sorting: {
				[sortType]: value
			}
		});
	}

	handleSorting() {
		const { reviews, sorting } = this.state;
		let reviewsList = reviews.slice(0);
		reviewsList = getSortedReviews(reviewsList, sorting);
		this.setState({
			reviews: reviewsList
		});
		this.closeModal();
	}

	handleRestaurantAnalytics(restaurantName, type, url) {
		const { userDetail, setAppStateData } = this.props;
		let isSignedIn = false;
		if (userDetail) {
			isSignedIn = true;
		}
		if (isSignedIn) {
			let data = {
				restaurant: restaurantName,
				redirect_type: type,
				link: url
			}

			restaurantSendAnalytics(data).then(resp => {
				this.handleOpenURL(url);
			});
		} else {
			setAppStateData('PROMPT_ONLY_USER_ALLOWED_ALERT', true);
		}
	}

	handleOpenURL(url) {
		const { userDetail, setAppStateData } = this.props;
		let isSignedIn = false;
		if (userDetail) {
			isSignedIn = true;
		}
		if (isSignedIn) {
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
		} else {
			setAppStateData('PROMPT_ONLY_USER_ALLOWED_ALERT', true);
		}
	}

	toggleFavourite = async () => {
		try {
			const {
				userDetail,
				restaurantDetail,
				setAppStateData
			} = this.props;
			const resId = restaurantDetail.data.id;
			let isSignedIn = false;
			if (userDetail) {
				isSignedIn = true;
			}

			if (isSignedIn) {
				let favouriteRestaurants = await AsyncStorage.getItem(
					'@Ziraf:favouriteRestaurants'
				);

				if (!favouriteRestaurants) {
					favouriteRestaurants = [];
				} else {
					favouriteRestaurants = JSON.parse(favouriteRestaurants);
				}
				let idx = favouriteRestaurants.indexOf(resId);
				if (idx != -1) {
					favouriteRestaurants.splice(idx, 1);
				} else {
					favouriteRestaurants.push(resId);
				}
				await AsyncStorage.setItem(
					'@Ziraf:favouriteRestaurants',
					JSON.stringify(favouriteRestaurants)
				);
				let isFavourite = false;

				if (favouriteRestaurants.indexOf(resId) !== -1) {
					isFavourite = true;
				}
				this.setState(
					{
						isFavourite
					},
					() => {
						setAppStateData('FETCH_FAVOURITE', true);
					}
				);
			} else {
				setAppStateData('PROMPT_ONLY_USER_ALLOWED_ALERT', true);
			}
		} catch (err) {
			//console.log('Something went wrong');
		}
	};

	handleMap(address, location, direction, restaurantId) {
		const { data, navigation } = this.props;
		navigation.navigate('Location', {
			address,
			location,
			direction,
			restaurantId
		});
	}

	render() {
		const { userDetail, restaurantDetail, navigation } = this.props;
		const {
			modalX,
			sorting,
			currentTab,
			isFavourite,
			reviews,

			alertTransport,

			alertSize,
			alertSuccess,
			alertTitle,
			alertDetail,
			alertButton,
			alertOnClose,
			alertChildren
		} = this.state;

		// if (!restaurantDetail || restaurantDetail.isFetching) {
		// 	return <LoadingIndicator />;
		// }

		let isSignedIn = false;
		if (userDetail) {
			isSignedIn = true;
		}

		if (!restaurantDetail) {
			return <LoadingIndicator />;
		}

		if (!restaurantDetail.data) {
			return <LoadingIndicator />;
		}

		let favouriteIcon = require('../../images/icons/favourite_default.png');
		if (isFavourite && isSignedIn) {
			favouriteIcon = require('../../images/icons/favourite_active.png');
		}

		// alert(JSON.stringify(restaurantDetail.data['operatingHours']))

		let openStatus = 'Opening Hours';
		let today = new Date();
		let time = parseInt(
			`${today.getHours()}${
				today.getMinutes().length === 1 ? '00' : today.getMinutes()
			}`
		);
		let day = today.getDay() - 1;
		if (restaurantDetail.data && restaurantDetail.data.operatingHours) {
			if (day < 0) {
				day = 6;
			}

			const d = restaurantDetail.data.operatingHours[day];
			if (d) {
				openStatus = 'Closed';
				d['timingsRaw'].forEach(timing => {
					// alert(JSON.stringify(timing));
					// alert(time);
					if (timing.from <= time && timing.to >= time) {
						openStatus = 'Open Now';
					}
				});
			}
		}

		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#1d1d1c' }}>
				<View style={styles.container}>
					<ScrollView>
						<View style={[]}>
							{restaurantDetail.data &&
							restaurantDetail.data.imageBanners &&
							restaurantDetail.data.imageBanners.length ? (
								<Swiper
									height={200}
									style={styles.wrapper}
									autoplay={true}
									paginationStyle={{ bottom: 10 }}
									activeDotStyle={{
										backgroundColor: '#a3a3a2'
									}}
									dotStyle={{
										borderColor: '#a3a3a2',
										borderWidth: 1,
										width: 8,
										height: 8
									}}>
									{restaurantDetail.data &&
									restaurantDetail.data.imageBanners &&
									restaurantDetail.data.imageBanners.length
										? restaurantDetail.data.imageBanners.map(
												(imageBanner, idx) => (
													<FastImage
														style={
															styles.imageBanner
														}
														resizeMode={FastImage.resizeMode.cover}
														key={idx}
														source={{
															uri:
																imageBanner.preview
														}}
													/>
												)
										  )
										: null}
								</Swiper>
							) : (
								<View style={{ height: 200 }} />
							)}
							<TouchableOpacity
								style={styles.rating}
								onPress={() => {
									this.setState({
										alertSize: 'small',
										alertSuccess: true,
										alertTitle: 'Rating',
										alertDetail: '',
										alertChildren: (
											<RatingBreakdown
												data={
													restaurantDetail.data
														.ratingBreakdown
												}
											/>
										),
										alertOnClose: () => {
											this.setState({
												alertSuccess: false
											});
										}
									});
								}}>
								<Text
									style={{
										color: '#fff',
										fontSize: 15,
										fontWeight: 'bold'
									}}
									fontVisby={true}>
									{restaurantDetail.data &&
										restaurantDetail.data.rating.toFixed(1)}
								</Text>
							</TouchableOpacity>

							<View style={styles.favouriteContainer}>
								<TouchableOpacity
									onPress={this.toggleFavourite.bind(this)}>
									<Image
										style={{
											height: 20,
											resizeMode: 'contain',
											alignSelf: 'center',
											marginRight: 5
										}}
										source={favouriteIcon}
									/>
								</TouchableOpacity>
							</View>

							<View style={styles.backNavContainer}>
								<TouchableOpacity
									onPress={this.handleGoBack.bind(this)}>
									<Image
										style={{
											height: 18,
											resizeMode: 'contain',
											alignSelf: 'center',
											marginRight: 5
										}}
										source={require('../../images/icons/ChevronLeft.png')}
									/>
								</TouchableOpacity>
							</View>

							<Image
								source={require('../../images/bg/restaurant_detail_pattern-bg.png')}
								style={{
									width: '100%',
									resizeMode: 'stretch',
									height: 100,
									position: 'absolute',
									bottom: -30,
									zIndex: 100
								}}
							/>
						</View>

						<View style={[styles.infoContainer, { padding: 15 }]}>
							<View style={{ width: 60 }} />
							<View style={{ flex: 1 }}>
								<Text
									allowFontScaling={false}
									style={styles.name}
									fontVisby={true}>
									{restaurantDetail.data.title}
								</Text>
							</View>
							{restaurantDetail.data.distance ? (
								<TouchableOpacity
									style={styles.distanceContainer}
									// onPress={this.handleMap.bind(
									// 	this,
									// 	restaurantDetail.data.address,
									// 	restaurantDetail.data.location && {
									// 		lat:
									// 			restaurantDetail.data.location
									// 				.lat,
									// 		lon:
									// 			restaurantDetail.data.location
									// 				.lon
									// 	},
									// 	restaurantDetail.data.direction,
									// 	restaurantDetail.data.id
									// )}>
									onPress={this.handleOpenURL.bind(
										this,
										"https://www.google.com/maps/dir/?api=1&destination=" 
										+ restaurantDetail.data.location.lat
										+ ","
										+ restaurantDetail.data.location.lon
									)}>
									<Image
										style={{
											height: 20,
											width: 20,
											resizeMode: 'contain',
											marginRight: 5,
											marginTop: 5
										}}
										source={require('../../images/icons/NavigationCircle.png')}
									/>
									<View style={{ alignItems: 'flex-end' }}>
										<Text
											allowFontScaling={false}
											style={{
												fontSize: 12,
												color: '#F2910A'
											}}>
											Directions
										</Text>
										<Text
											allowFontScaling={false}
											style={{
												color: '#fff',
												fontSize: 10
											}}>{`${restaurantDetail.data.distance.toFixed(
											2
										)} Mi`}</Text>
									</View>
								</TouchableOpacity>
							) : (
								<View style={{ width: 60 }} />
							)}
						</View>

						<View>
							<View
								style={[
									{
										flexDirection: 'row',
										justifyContent: 'space-around'
									},
									cs.paddingTB10
								]}>
								<TouchableOpacity
									onPress={() => this.handleTabChange('info')}
									style={[
										currentTab === 'info'
											? styles.activeTab
											: styles.tab
									]}>
									<Text
										allowFontScaling={false}
										style={[
											cs.font17,
											cs.textWhite,
											styles.tabText
										]}>
										Info
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() =>
										this.handleTabChange('reviews')
									}
									style={[
										currentTab === 'reviews'
											? styles.activeTab
											: styles.tab
									]}>
									<Text
										allowFontScaling={false}
										style={[
											cs.font17,
											cs.textWhite,
											styles.tabText
										]}>
										Reviews
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() => this.handleTabChange('menu')}
									style={[
										currentTab === 'menu'
											? styles.activeTab
											: styles.tab
									]}>
									<Text
										allowFontScaling={false}
										style={[
											cs.font17,
											cs.textWhite,
											styles.tabText
										]}>
										Menu
									</Text>
								</TouchableOpacity>
							</View>

							<View style={{ padding: 15 }}>
								{currentTab === 'info' ? (
									<View>
										{restaurantDetail.data.description ? (
											<Text
												allowFontScaling={false}
												style={{
													fontStyle: 'italic',
													color: '#737373',
													textAlign: 'center'
												}}>
												{`"${restaurantDetail.data.description}"`}
											</Text>
										) : null}
										<View style={{ marginTop: 30 }}>
											{restaurantDetail.data.topDishes
												.length > 0 && (
												<React.Fragment>
													<Text
														allowFontScaling={false}
														style={[
															cs.font16,
															cs.textCenter,
															cs.textWhite,
															cs.textBold
														]}>
														Zirafer's Top Dish
													</Text>
													{restaurantDetail.data
														.topDishes &&
													restaurantDetail.data
														.topDishes.length ? (
														<View
															style={[
																cs.marginTB15,
																{
																	flexDirection:
																		'row',
																	justifyContent:
																		'center',
																	flexWrap:
																		'wrap'
																}
															]}>
															{restaurantDetail.data.topDishes.map(
																(
																	topDish,
																	idx
																) => (
																	<TopDishCard
																		data={
																			topDish
																		}
																		key={
																			idx
																		}
																		onPress={() => {
																			this.setState(
																				{
																					alertSize: false,
																					alertSuccess: true,
																					alertTitle:
																						'',
																					alertDetail:
																						'',
																					alertChildren: (
																						<View>
																							<FastImage
																								style={{
																									width:
																										'100%',
																									height: 250,
																									borderRadius: 5
																								}}
																								source={{
																									uri:
																										topDish
																											.image
																											.preview
																								}}
																							/>
																							<Text
																								allowFontScaling={
																									false
																								}
																								style={[
																									cs.textCenter,
																									cs.marginT15
																								]}>
																								{
																									topDish.name
																								}{' '}
																								-
																								{restaurantDetail.data &&
																									restaurantDetail
																										.data
																										.priceRange &&
																									restaurantDetail
																										.data
																										.priceRange
																										.symbol}
																								{
																									topDish.price
																								}
																							</Text>
																						</View>
																					),
																					alertOnClose: () => {
																						this.setState(
																							{
																								alertSuccess: false
																							}
																						);
																					}
																				}
																			);
																		}}
																	/>
																)
															)}
														</View>
													) : null}
												</React.Fragment>
											)}
											<View
												style={{
													flexDirection: 'row',
													borderBottomWidth: 1,
													borderColor: '#fff',
													paddingBottom: 15
												}}>
												<Text
													allowFontScaling={false}
													style={[
														cs.textBold,
														cs.font13,
														{ width: '60%' }
													]}
													selectable>
													{
														restaurantDetail.data
															.address
													}
												</Text>
												<Text
													allowFontScaling={false}
													style={[
														cs.font12,
														{
															width: '40%',
															textAlign: 'right',
															alignSelf:
																'flex-end'
														}
													]}>
													Price:{' '}
													{
														restaurantDetail.data
															.priceRange.symbol
													}
													{
														restaurantDetail.data
															.priceRange.min
													}{' '}
													-{' '}
													{
														restaurantDetail.data
															.priceRange.symbol
													}
													{
														restaurantDetail.data
															.priceRange.max
													}
												</Text>
											</View>
										</View>

										<View
											style={[
												cs.paddingTB30,
												styles.moreInfoContainer
											]}>
											{/* <View
											style={{
												borderRightWidth: 1,
												borderColor: '#fff',
												paddingRight: 20
											}}>
											<TouchableOpacity
												onPress={() => {}}>
												<Text
													style={[
														cs.textOrange,
														cs.textBold
													]}>
													Your
												</Text>
												<Text
													style={[
														cs.textOrange,
														cs.textBold
													]}>
													Feedback
												</Text>
											</TouchableOpacity>
										</View> */}
											<View
												style={{
													flex: 1,
													flexDirection: 'row',
													justifyContent:
														'space-between',
													paddingLeft: 20
												}}>
												
												{restaurantDetail.data &&
												restaurantDetail.data
													.offers.percentage && restaurantDetail.data.offers.description ? (
													<TouchableOpacity
														onPress={() => {
															this.setState({
																alertSize: false,
																alertSuccess: true,
																alertTitle: '',
																alertDetail: '',
																alertChildren: (
																	<DiscountModal
																		data={
																			restaurantDetail
																				.data
																				.offers
																		}
																	/>
																),
																alertOnClose: () => {
																	this.setState(
																		{
																			alertSuccess: false
																		}
																	);
																}
															});
														}}>
														<View
															style={{
																alignItems:
																	'center',
																justifyContent:
																	'flex-start'
															}}>
															<Image
																source={require('../../images/icons/discount_offer_inverted.png')}
																style={{
																	height: 20,
																	width: 50,
																	resizeMode:
																		'contain'
																}}
															/>
															<Text
																allowFontScaling={
																	false
																}
																style={[
																	cs.textOrange,
																	{
																		fontSize: 10
																	}
																]}>
																{!isNaN(restaurantDetail.data.offers.percentage) && (restaurantDetail.data.offers.percentage > 0 
																&& restaurantDetail.data.offers.percentage < 101)
																? restaurantDetail.data.offers.percentage + '% Off'
																: 'Special Offer'}
															</Text>
														</View>
													</TouchableOpacity>
												) : null}

												{restaurantDetail.data &&
												restaurantDetail.data
													.operatingHours ? (
													<TouchableOpacity
														onPress={() => {
															this.setState({
																alertSize: false,
																alertSuccess: true,
																alertTitle: '',
																alertDetail: '',
																alertChildren: (
																	<OperatingHours
																		data={
																			restaurantDetail
																				.data
																				.operatingHours
																		}
																	/>
																),
																alertOnClose: () => {
																	this.setState(
																		{
																			alertSuccess: false
																		}
																	);
																}
															});
														}}>
														<View
															style={{
																alignItems:
																	'center',
																justifyContent:
																	'flex-start'
															}}>
															<Image
																source={require('../../images/icons/clock-icon.png')}
																style={{
																	height: 20,
																	resizeMode:
																		'contain'
																}}
															/>
															<Text
																allowFontScaling={
																	false
																}
																style={[
																	cs.textOrange,
																	{
																		fontSize: 10
																	}
																]}>
																{openStatus}
															</Text>
														</View>
													</TouchableOpacity>
												) : null}
												{restaurantDetail.data &&
												restaurantDetail.data
													.delivery ? (
													<TouchableOpacity
														onPress={this.handleRestaurantAnalytics.bind(
															this,
															restaurantDetail.data.title,
															'delivery',
															restaurantDetail
																.data.delivery
														)}>
														<View
															style={{
																alignItems:
																	'center',
																justifyContent:
																	'flex-start'
															}}>
															<Image
																source={require('../../images/icons/take-away-icon.png')}
																style={{
																	height: 20,
																	resizeMode:
																		'contain'
																}}
															/>
															<Text
																allowFontScaling={
																	false
																}
																style={[
																	cs.textOrange,
																	{
																		fontSize: 10
																	}
																]}>
																Delivery
															</Text>
														</View>
													</TouchableOpacity>
												) : null}

												{restaurantDetail.data &&
												restaurantDetail.data
													.reservation ? (
													<TouchableOpacity
														onPress={this.handleRestaurantAnalytics.bind(
															this,
															restaurantDetail.data.title,
															'reservation',
															restaurantDetail
																.data
																.reservation
														)}>
														<View
															style={{
																alignItems:
																	'center',
																justifyContent:
																	'flex-start'
															}}>
															<Image
																source={require('../../images/icons/reservation-icon.png')}
																style={{
																	height: 20,
																	resizeMode:
																		'contain'
																}}
															/>
															<Text
																allowFontScaling={
																	false
																}
																style={[
																	cs.textOrange,
																	{
																		fontSize: 10
																	}
																]}>
																Reservation
															</Text>
														</View>
													</TouchableOpacity>
												) : null}
												{restaurantDetail.data &&
												restaurantDetail.data
													.transport ? (
													<TouchableOpacity
														onPress={() =>
															this.setState({
																alertTransport: true
															})
														}>
														<View
															style={{
																alignItems:
																	'center',
																justifyContent:
																	'flex-start'
															}}>
															<Image
																source={require('../../images/icons/taxi-icon.png')}
																style={{
																	height: 20,
																	resizeMode:
																		'contain'
																}}
															/>
															<Text
																allowFontScaling={
																	false
																}
																style={[
																	cs.textOrange,
																	{
																		fontSize: 10
																	}
																]}>
																Transport
															</Text>
														</View>
													</TouchableOpacity>
												) : null}
											</View>
										</View>
									</View>
								) : null}

								{currentTab === 'reviews' ? (
									<View>
										{restaurantDetail.data.topDishes
												.length > 0 && (
												<React.Fragment>
													<Text
														allowFontScaling={false}
														style={[
															cs.font16,
															cs.textCenter,
															cs.textWhite,
															cs.textBold
														]}>
														Zirafer's Top Dish
													</Text>
													{restaurantDetail.data
														.topDishes &&
													restaurantDetail.data
														.topDishes.length ? (
														<View
															style={[
																cs.marginTB15,
																{
																	flexDirection:
																		'row',
																	justifyContent:
																		'center',
																	flexWrap:
																		'wrap'
																}
															]}>
															{restaurantDetail.data.topDishes.map(
																(
																	topDish,
																	idx
																) => (
																	<TopDishCard
																		data={
																			topDish
																		}
																		key={
																			idx
																		}
																		onPress={() => {
																			this.setState(
																				{
																					alertSize: false,
																					alertSuccess: true,
																					alertTitle:
																						'',
																					alertDetail:
																						'',
																					alertChildren: (
																						<View>
																							<FastImage
																								style={{
																									width:
																										'100%',
																									height: 250,
																									borderRadius: 5
																								}}
																								source={{
																									uri:
																										topDish
																											.image
																											.preview
																								}}
																							/>
																							<Text
																								allowFontScaling={
																									false
																								}
																								style={[
																									cs.textCenter,
																									cs.marginT15
																								]}>
																								{
																									topDish.name
																								}{' '}
																								-
																								{restaurantDetail.data &&
																									restaurantDetail
																										.data
																										.priceRange &&
																									restaurantDetail
																										.data
																										.priceRange
																										.symbol}
																								{
																									topDish.price
																								}
																							</Text>
																						</View>
																					),
																					alertOnClose: () => {
																						this.setState(
																							{
																								alertSuccess: false
																							}
																						);
																					}
																				}
																			);
																		}}
																	/>
																)
															)}
														</View>
													) : null}
												</React.Fragment>
											)}
										<RestaurantReview
											restaurantId={restaurantDetail.data.id}
											openSortModal={this.openSortModal.bind(
												this
											)}
											reviews={reviews}
											navigation={navigation}
											onRating={ratingBreakdown => {
												this.setState({
													alertSize: 'small',
													alertSuccess: true,
													alertTitle: 'Review',
													alertDetail: '',
													alertChildren: (
														<RatingBreakdown
															data={ratingBreakdown}
														/>
													),
													alertOnClose: () => {
														this.setState({
															alertSuccess: false
														});
													}
												});
											}}
										/>
									</View>
								) : null}

								{currentTab === 'menu' ? (
									<RestaurantMenu
										restaurantId={restaurantDetail.data.id}
										restaurantData={restaurantDetail.data}
									/>
								) : null}
							</View>
						</View>
					</ScrollView>

					<ModalWrapper modalX={modalX} fullHeight={true}>
						<TouchableWithoutFeedback onPress={() => {}}>
							<View style={[cs.padding20, styles.modalContainer]}>
								<View style={styles.sortRow}>
									<View style={styles.sortField}>
										<Text
											style={[
												cs.font12,
												cs.textBold,
												cs.textWhite,
												sorting.name
													? cs.textOrange
													: cs.textWhite
											]}>
											Names
										</Text>
									</View>
									<View style={styles.sortFieldOptions}>
										<TouchableOpacity
											onPress={() =>
												this.changeSort(
													'name',
													'ascending'
												)
											}>
											<Text
												style={[
													styles.sortOption,
													cs.font12,
													cs.textWhite,
													sorting.name &&
													sorting.name === 'ascending'
														? cs.textOrange
														: cs.textWhite
												]}>
												A to Z
											</Text>
										</TouchableOpacity>
										<Text
											style={[
												cs.textWhite,
												styles.textSeparator
											]}>
											|
										</Text>
										<TouchableOpacity
											onPress={() =>
												this.changeSort(
													'name',
													'descending'
												)
											}>
											<Text
												style={[
													styles.sortOption,
													cs.font12,
													cs.textWhite,
													sorting.name &&
													sorting.name ===
														'descending'
														? cs.textOrange
														: cs.textWhite
												]}>
												Z to A
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
												sorting.updates
													? cs.textOrange
													: cs.textWhite
											]}>
											Updates
										</Text>
									</View>
									<View style={styles.sortFieldOptions}>
										<TouchableOpacity
											onPress={() =>
												this.changeSort(
													'updates',
													'latest'
												)
											}>
											<Text
												style={[
													styles.sortOption,
													cs.font12,
													cs.textWhite,
													sorting.updates &&
													sorting.updates === 'latest'
														? cs.textOrange
														: cs.textWhite
												]}>
												Latest
											</Text>
										</TouchableOpacity>
										<Text
											style={[
												cs.textWhite,
												styles.textSeparator
											]}>
											|
										</Text>
										<TouchableOpacity
											onPress={() =>
												this.changeSort(
													'updates',
													'oldest'
												)
											}>
											<Text
												style={[
													styles.sortOption,
													cs.font12,
													cs.textWhite,
													sorting.updates &&
													sorting.updates === 'oldest'
														? cs.textOrange
														: cs.textWhite
												]}>
												Oldest
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
												sorting.rating
													? cs.textOrange
													: cs.textWhite
											]}>
											Ratings
										</Text>
									</View>
									<View style={styles.sortFieldOptions}>
										<TouchableOpacity
											onPress={() =>
												this.changeSort('rating', 'low')
											}>
											<Text
												style={[
													styles.sortOption,
													cs.font12,
													cs.textWhite,
													sorting.rating &&
													sorting.rating === 'low'
														? cs.textOrange
														: cs.textWhite
												]}>
												Low
											</Text>
										</TouchableOpacity>
										<Text
											style={[
												cs.textWhite,
												styles.textSeparator
											]}>
											|
										</Text>
										<TouchableOpacity
											onPress={() =>
												this.changeSort(
													'rating',
													'high'
												)
											}>
											<Text
												style={[
													styles.sortOption,
													cs.font12,
													cs.textWhite,
													sorting.rating &&
													sorting.rating === 'high'
														? cs.textOrange
														: cs.textWhite
												]}>
												High
											</Text>
										</TouchableOpacity>
									</View>
								</View>

								<View
									style={[
										cs.marginB10,
										{ alignItems: 'center', marginTop: 20 }
									]}>
									<TouchableOpacity
										style={styles.sortButton}
										onPress={() => this.handleSorting()}>
										<Text
											style={[
												cs.font13,
												cs.textWhite,
												cs.textBold
											]}
											fontVisby={true}>
											SORT
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</ModalWrapper>

					<Alert
						size={alertSize}
						title={alertTitle}
						detail={alertDetail}
						button={alertButton ? alertButton : 'GOT IT'}
						visible={alertSuccess}
						onClose={alertOnClose}>
						{alertChildren}
					</Alert>

					<AlertTransport
						data={restaurantDetail.data}
						visible={alertTransport}
						onClose={() => this.setState({ alertTransport: false })}
					/>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1d1d1c'
	},
	imageBanner: {
		width: '100%',
		height: 200
	},
	name: {
		color: '#F2910A',
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	infoContainer: {
		flexDirection: 'row',
		marginBottom: 8,
		marginTop: 8,
		justifyContent: 'flex-end',
		zIndex: 100
	},
	distanceContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
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
		marginTop: 6
	},
	backNavContainer: {
		position: 'absolute',
		left: 0,
		paddingRight: 5,
		borderRadius: 20,
		paddingLeft: 8,
		paddingTop: 8
	},
	tabText: {
		fontWeight: '600'
	},
	tab: {
		backgroundColor: 'transparent',
		paddingTop: 0,
		paddingBottom: 4,
		paddingLeft: 18,
		paddingRight: 18,
		borderRadius: 20
	},
	activeTab: {
		backgroundColor: '#F2910A',
		paddingTop: 0,
		paddingBottom: 4,
		paddingLeft: 18,
		paddingRight: 18,
		borderRadius: 20
	},

	modalContainer: {
		backgroundColor: '#1d1d1c',
		marginRight: 80
	},
	sortRow: {
		flexDirection: 'row',
		paddingTop: 8,
		paddingBottom: 8
	},
	sortField: {
		width: 90
	},
	sortFieldOptions: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-evenly'
	},
	sortButton: {
		padding: 6,
		paddingLeft: 25,
		paddingRight: 25,
		backgroundColor: '#F2910A',
		borderRadius: 20
	},
	textSeparator: {
		width: 6,
		textAlign: 'center'
	},
	sortOption: {
		width: 80,
		textAlign: 'center',
		fontWeight: 'bold'
	},
	favouriteContainer: {
		position: 'absolute',
		right: 0,
		marginTop: 40
	},
	moreInfoContainer: {
		flexDirection: 'row'
	}
});

function mapStateToProps(state) {
	return {
		userDetail: state.userDetail,
		appState: state.appState,
		restaurantDetail: state.restaurantDetail,
		restaurantReview: state.restaurantReview
	};
}

export default connect(
	mapStateToProps,
	{
		fetchRestaurantDetailData: fetchRestaurantDetail,
		clearRestaurantDetailData: clearRestaurantDetail,
		setAppStateData: setAppState
	}
)(RestaurantDetail);
