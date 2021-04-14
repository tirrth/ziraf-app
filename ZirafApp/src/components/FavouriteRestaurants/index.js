import React, { Component } from 'react';
import { connect } from 'react-redux';
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
	RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ModalWrapper from '../common/ModalWrapper';
import {
	fetchFavouriteRestaurants,
	setAppState
} from '../../js/actions/actionCreators';
import { getSortedRestaurants } from '../../js/utils';
import Text from '../common/Text';
import LoadingIndicator from '../common/LoadingIndicator';
import RestaurantCard from '../common/RestaurantCard';
import RatingBreakdown from '../common/RatingBreakdown';
import Alert from '../common/Alert';
import cs from '../../styles/common-styles';
import DiscountModal from '../common/DiscountModal';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class FavouriteRestaurants extends Component {
	constructor(args) {
		super(args);
		this.state = {
			visible: false,
			modalX: new Animated.Value(-deviceHeight),
			sorting: {
				location: 'near'
			},
			restaurants: [],
			refreshing: false,

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
		const { restaurantList } = this.props;
		this.fetchFavResList();

		if (restaurantList && restaurantList.data) {
			this.setRestaurantData(restaurantList.data);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { restaurantList } = this.props;
		if (
			restaurantList &&
			restaurantList !== prevProps.restaurantList
		) {
			if (restaurantList.data) {
				this.setRestaurantData(restaurantList.data);
			}
		}

		if (
			this.props.appState && this.props.appState.FETCH_FAVOURITE
			//If you remove below line, the favorite list updates correctly without refresh needed
			//but at the cost of performance
			//&& this.props.appState.FETCH_FAVOURITE !== prevProps.appState.FETCH_FAVOURITE
			) {
			this.fetchFavResList();
		}		
	}

	setRestaurantData(data) {
		let restaurantList = data.slice(0);
		const { sorting } = this.state;
		restaurantList = getSortedRestaurants(restaurantList, sorting);
		this.setState({
			restaurants: restaurantList
		});
	}

	fetchFavResList = async () => {
		const { fetchFavouriteRestaurantList, appState } = this.props;
		let favouriteRestaurants = await AsyncStorage.getItem(
			'@Ziraf:favouriteRestaurants'
		);
		if (!favouriteRestaurants) {
			favouriteRestaurants = [];
		} else {
			favouriteRestaurants = JSON.parse(favouriteRestaurants);
		}

		const { setAppStateData } = this.props;
		setAppStateData('FETCH_FAVOURITE', false);

		return fetchFavouriteRestaurantList(
			favouriteRestaurants,
			appState.CURRENT_LOCATION
		);
	};

	openModal() {
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
		const { restaurants, sorting } = this.state;
		let restaurantList = restaurants.slice(0);
		restaurantList = getSortedRestaurants(restaurantList, sorting);
		this.setState({
			restaurants: restaurantList
		});
		this.closeModal();
	}

	_keyExtractor(item) {
		return item.id;
	}

	handleRefresh() {
		this.setState({ refreshing: true });
		this.fetchFavResList()
			.then(res => this.setState({ refreshing: false }))
			.catch(err => this.setState({ refreshing: false }));
	}

	render() {
		const { userDetail, restaurantList, navigation } = this.props;
		const {
			modalX,
			sorting,
			restaurants,

			alertSize,
			alertSuccess,
			alertTitle,
			alertDetail,
			alertButton,
			alertOnClose,
			alertChildren
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
				<View
					style={{
						alignItems: 'flex-start',
						marginBottom: 10,
						marginTop: 10
					}}>
					<TouchableOpacity
						onPress={this.openModal.bind(this)}
						style={{ flexDirection: 'row', zIndex: 10 }}>
						<Text
							style={[
								cs.textWhite,
								cs.font12,
								cs.textBold,
								{ paddingLeft: 15, paddingRight: 5 }
							]}>
							Sort by
						</Text>
						<Image
							source={require('../../images/icons/dropdown_arrow.png')}
							style={{
								height: 5,
								resizeMode: 'contain',
								alignSelf: 'center',
								marginTop: 3
							}}
						/>
					</TouchableOpacity>
					<View
						style={{
							position: 'absolute',
							flex: 1,
							justifyContent: 'center',
							width: '100%'
						}}>
						<Text
							style={[cs.textCenter, cs.textBold, cs.font14]}
							fontVisby={true}>
							Your Favourites
						</Text>
					</View>
				</View>

				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.handleRefresh.bind(this)}
						/>
					}
					style={{}}>
					<View style={[cs.padding15]}>
						{restaurants && restaurants.length && isSignedIn ? (
							<FlatList
								data={restaurants}
								keyExtractor={this._keyExtractor.bind(this)}
								windowSize={11}
								renderItem={event => {
									return (
										<RestaurantCard
											data={event.item}
											navigation={navigation}
											isSignedIn={
												isSignedIn
													? true
													: false
											}
											onLoggedInUserOnly={() => {
												this.props.setAppStateData(
													'PROMPT_ONLY_USER_ALLOWED_ALERT', true
													);
											}}
											isFavourite={true}
											onRating={ratingBreakdown =>
												this.setState({
													alertSize: 'small',
													alertSuccess: true,
													alertTitle:
														event.item.title,
													alertDetail: '',
													alertChildren: (
														<RatingBreakdown
															data={
																ratingBreakdown
															}
														/>
													),
													alertOnClose: () => {
														this.setState({
															alertSuccess: false
														});
													}
												})
											}
											onDiscount={discountData => {
												this.setState({
													alertSize: 'small',
													alertSuccess: true,
													alertTitle:
														event.item.title,
													alertDetail: '',
													alertChildren: (
														<DiscountModal
															data={
																discountData
															}
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
									);
								}}
							/>
						) : (
							<Text
								style={[
									cs.paddingTB30,
									cs.textCenter,
									cs.textOrange
								]}>
								{ isSignedIn ? 'No favourites found!' : 'You need to log in to access the favorites feature'}
							</Text>
						)}
					</View>
					<Alert
						title={alertTitle}
						size={alertSize}
						detail={alertDetail}
						button={alertButton ? alertButton : 'GOT IT'}
						visible={alertSuccess}
						onClose={alertOnClose}>
						{alertChildren}
					</Alert>
				</ScrollView>

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
											sorting.location
												? cs.textOrange
												: cs.textWhite
										]}>
										Location
									</Text>
								</View>
								<View style={styles.sortFieldOptions}>
									<TouchableOpacity
										onPress={() =>
											this.changeSort('location', 'near')
										}>
										<Text
											style={[
												styles.sortOption,
												cs.font12,
												cs.textWhite,
												sorting.location &&
												sorting.location === 'near'
													? cs.textOrange
													: cs.textWhite
											]}>
											Near
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
											this.changeSort('location', 'far')
										}>
										<Text
											style={[
												styles.sortOption,
												cs.font12,
												cs.textWhite,
												sorting.location &&
												sorting.location === 'far'
													? cs.textOrange
													: cs.textWhite
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
										style={[
											cs.font12,
											cs.textBold,
											cs.textWhite,
											sorting.rating
												? cs.textOrange
												: cs.textWhite
										]}>
										Rating
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
											this.changeSort('rating', 'high')
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

							<View style={styles.sortRow}>
								<View style={styles.sortField}>
									<Text
										style={[
											cs.font12,
											cs.textBold,
											cs.textWhite,
											sorting.restaurant
												? cs.textOrange
												: cs.textWhite
										]}>
										Restaurant
									</Text>
								</View>
								<View style={styles.sortFieldOptions}>
									<TouchableOpacity
										onPress={() =>
											this.changeSort(
												'restaurant',
												'ascending'
											)
										}>
										<Text
											style={[
												styles.sortOption,
												cs.font12,
												cs.textWhite,
												sorting.restaurant &&
												sorting.restaurant ===
													'ascending'
													? cs.textOrange
													: cs.textWhite
											]}>
											Ascending
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
												'restaurant',
												'descending'
											)
										}>
										<Text
											style={[
												styles.sortOption,
												cs.font12,
												cs.textWhite,
												sorting.restaurant &&
												sorting.restaurant ===
													'descending'
													? cs.textOrange
													: cs.textWhite
											]}>
											Descending
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
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1d1d1c'
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
	}
});

function mapStateToProps(state) {
	return {
		userDetail: state.userDetail,
		restaurantList: state.favouriteRestaurants,
		appState: state.appState
	};
}

export default connect(
	mapStateToProps,
	{
		fetchFavouriteRestaurantList: fetchFavouriteRestaurants,
		setAppStateData: setAppState
	}
)(FavouriteRestaurants);
