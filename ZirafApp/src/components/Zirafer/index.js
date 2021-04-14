import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Image,
	Linking,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
	SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Text from './../common/Text';
import {
	fetchZiraferDetail,
	clearZiraferDetail,
	clearAppState,
	setAppState
} from '../../js/actions/actionCreators';
import LoadingIndicator from './../common/LoadingIndicator';
import ReviewItem from '../common/ReviewItem';
import RatingBreakdown from '../common/RatingBreakdown';
import Alert from '../common/Alert';
import cs from './../../styles/common-styles';
import FastImage from 'react-native-fast-image';

class Zirafer extends Component {
	constructor(args) {
		super(args);
		this.state = {
			zirafer: {},
			isFavourite: false,

			alertSuccess: false,
			alertTitle: 'Hi',
			alertDetail: '',
			alertButton: 'GOT IT',
			alertChildren: null,
			alertOnClose: () => {}
		};
	}

	componentDidMount() {
		const { fetchZiraferDetailData, navigation } = this.props;
		const id = navigation.getParam('id');
		fetchZiraferDetailData(id);
		this.checkFavourite();
	}

	componentDidUpdate(prevProps) {
		if (this.props.zirafer !== prevProps.zirafer) {
			this.setState({ zirafer: this.props.zirafer });
		}
	}

	componentWillUnmount() {
		const { clearZiraferDetailData } = this.props;

		clearZiraferDetailData();
	}

	checkFavourite = async () => {
		const { navigation } = this.props;
		const resId = navigation.getParam('id');

		let favouriteZirafers = await AsyncStorage.getItem(
			'@Ziraf:favouriteZirafers'
		);
		if (!favouriteZirafers) {
			return;
		} else {
			favouriteZirafers = JSON.parse(favouriteZirafers);
		}
		let isFavourite = false;
		if (favouriteZirafers.indexOf(resId) !== -1) {
			isFavourite = true;
		}
		this.setState({
			isFavourite
		});
	};

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

	toggleFavourite = async () => {
		try {
			const { zirafer } = this.state;
			const { userDetail, setAppStateData } = this.props;

			let isSignedIn = false;
			if (userDetail) {
				isSignedIn = true;
			}

			if(isSignedIn){
				const resId = zirafer.data.id;
				let favouriteZirafers = await AsyncStorage.getItem(
					'@Ziraf:favouriteZirafers'
				);

				if (!favouriteZirafers) {
					favouriteZirafers = [];
				} else {
					favouriteZirafers = JSON.parse(favouriteZirafers);
				}
				let idx = favouriteZirafers.indexOf(resId);
				if (idx != -1) {
					favouriteZirafers.splice(idx, 1);
				} else {
					favouriteZirafers.push(resId);
				}
				await AsyncStorage.setItem(
					'@Ziraf:favouriteZirafers',
					JSON.stringify(favouriteZirafers)
				);
				let isFavourite = false;

				if (favouriteZirafers.indexOf(resId) !== -1) {
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

	handleGoBack() {
		const { navigation } = this.props;
		navigation.goBack();
	}

	handleReviewImagePress(state) {
		this.setState({
			...state,
			alertSize: false,
			alertOnClose: () => {
				this.setState({
					alertSuccess: false
				});
			}
		});
	}

	render() {
		const {
			isFavourite,
			zirafer,
			alertSuccess,
			alertTitle,
			alertDetail,
			alertButton,
			alertOnClose,
			alertChildren,
			alertSize
		} = this.state;

		const { userDetail, setAppStateData, navigation } = this.props;

		// if (!zirafer || zirafer.isFetching) {
		// 	return <LoadingIndicator />;
		// }

		let isSignedIn = false;
		if (userDetail) {
			isSignedIn = true;
		}

		if (!zirafer) {
			return <LoadingIndicator />;
		}

		if (!zirafer.data) {
			return <LoadingIndicator />;
		}

		let favouriteIcon = require('../../images/icons/favourite_default.png');
		if (isFavourite && isSignedIn) {
			favouriteIcon = require('../../images/icons/favourite_active.png');
		}

		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#1d1d1c' }}>
				<View style={styles.container}>
					<ScrollView>
						<View style={[{ minHeight: 100 }]}>
							{zirafer && zirafer.data && zirafer.data.image && (
								<FastImage
									resizeMode={FastImage.resizeMode.cover}
									style={styles.imageBanner}
									source={{
										uri:
											zirafer.data &&
											zirafer.data.image &&
											zirafer.data.image.detail
									}}
								/>
							)}
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
									zIndex: 5
								}}
							/>
						</View>
						<View
							style={[
								styles.displayNameContainer,
								{ padding: 15 }
							]}>
							<Text allowFontScaling={false} style={styles.displayName} fontVisby={true}>
								{zirafer.data && zirafer.data.displayName}
							</Text>

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
						</View>
						{zirafer.data && zirafer.data.about ? (
							<View style={[styles.aboutContainer]}>
								<Text allowFontScaling={false} style={styles.about}>
									"{zirafer.data && zirafer.data.about}"
								</Text>
							</View>
						) : null}

						<View style={[styles.infoContainer]}>
							<View style={[styles.userContainer]}>
								{/* <Text allowFontScaling={false} style={styles.name}>
									{zirafer.data && zirafer.data.name}
								</Text> */}
								{zirafer.data &&
								zirafer.data.speciality &&
								zirafer.data.speciality.length > 0 ? (
									<Text allowFontScaling={false} style={styles.info}>
										Speciality:{' '}
										{zirafer.data &&
											zirafer.data.speciality.join(', ')}
									</Text>
								) : null}
								{zirafer.data &&
								zirafer.data.favouriteRestaurant &&
								zirafer.data.favouriteRestaurant.length > 0 ? (
									<Text allowFontScaling={false} style={styles.info}>
										Favourite Restaurant:{' '}
										{zirafer.data &&
											zirafer.data.favouriteRestaurant}
									</Text>
								) : null}

								{/* {zirafer.data && zirafer.data.location ? (
									<Text allowFontScaling={false} style={styles.info}>
										location:{' '}
										{zirafer.data && zirafer.data.location}
									</Text>
								) : null} */}
							</View>

							<View style={[styles.socialContainer]}>
								<View style={{ flexDirection: 'row' }}>
									<TouchableOpacity
										style={[styles.socialLinks]}
										onPress={this.handleOpenURL.bind(
											this,
											zirafer.data &&
												zirafer.data.social &&
												zirafer.data.social.facebook
										)}>
										<Image
											source={
												zirafer.data &&
												zirafer.data.social &&
												zirafer.data.social.facebook
													? require('../../images/icons/social-facebook-active.png')
													: require('../../images/icons/social-facebook-inactive.png')
											}
											style={{
												width: 29,
												height: 29
											}}
										/>
									</TouchableOpacity>

									<TouchableOpacity
										style={[styles.socialLinks]}
										onPress={this.handleOpenURL.bind(
											this,
											zirafer.data &&
												zirafer.data.social &&
												zirafer.data.social.instagram
										)}>
										<Image
											source={
												zirafer.data &&
												zirafer.data.social &&
												zirafer.data.social.instagram
													? require('../../images/icons/social-instagram-active.png')
													: require('../../images/icons/social-instagram-inactive.png')
											}
											style={{
												width: 29,
												height: 29
											}}
										/>
									</TouchableOpacity>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<TouchableOpacity
										style={[styles.socialLinks]}
										onPress={this.handleOpenURL.bind(
											this,
											zirafer.data &&
												zirafer.data.social &&
												zirafer.data.social.youtube
										)}>
										<Image
											source={
												zirafer.data &&
												zirafer.data.social &&
												zirafer.data.social.youtube
													? require('../../images/icons/social-youtube-active.png')
													: require('../../images/icons/social-youtube-inactive.png')
											}
											style={{
												width: 29,
												height: 29
											}}
										/>
									</TouchableOpacity>

									<TouchableOpacity
										style={[styles.socialLinks]}
										onPress={this.handleOpenURL.bind(
											this,
											zirafer.data &&
												zirafer.data.social &&
												zirafer.data.social.website
										)}>
										<Image
											source={
												zirafer.data &&
												zirafer.data.social &&
												zirafer.data.social.website
													? require('../../images/icons/social-website-active.png')
													: require('../../images/icons/social-website-inactive.png')
											}
											style={{
												width: 29,
												height: 29
											}}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>
						<View style={[styles.reviewContainer]}>
							<Text
								style={[
									{
										textAlign: 'center',
										padding: 10,
										paddingBottom: 20,
										fontWeight: 'bold'
									}
								]}>
								Review
							</Text>
							{zirafer.data &&
							zirafer.data.reviews &&
							zirafer.data.reviews.length > 0 ? (
								zirafer.data.reviews.map((review, idx) => (
									<ReviewItem
										data={review}
										key={`review-${idx}`}
										onPress={this.handleReviewImagePress.bind(
											this
										)}
										onRating={ratingBreakdown =>
											this.setState({
												alertSize: 'small',
												alertSuccess: true,
												alertTitle:
													review.restaurantName,
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
											})
										}
										navigation={navigation}
									/>
								))
							) : (
								<Text style={[cs.textCenter, cs.textOrange]}>
									Zirafer has not left any review yet
								</Text>
							)}
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
	displayName: {
		color: '#F2910A',
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		zIndex: 10
	},
	about: {
		color: '#737373',
		fontSize: 14,
		fontStyle: 'italic',
		textAlign: 'center',
		fontWeight: 'normal'
	},
	name: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: 'bold'
	},
	info: {
		color: '#FFFFFF',
		fontSize: 12
	},
	displayNameContainer: {
		marginBottom: 8,
		marginTop: 8
	},
	aboutContainer: {
		marginBottom: 8
	},
	infoContainer: {
		marginLeft: 25,
		marginRight: 25,
		paddingBottom: 10,
		paddingTop: 10,
		flexDirection: 'row',
		marginBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#FFFFFF'
	},
	userContainer: {
		flex: 1,
		marginBottom: 8,
		marginTop: 8
	},
	socialContainer: {
		marginTop: 5
	},
	socialLinks: {
		padding: 2
	},
	reviewContainer: {
		flex: 1,
		marginLeft: 25,
		marginRight: 25
	},
	backNavContainer: {
		position: 'absolute',
		left: 0,
		paddingRight: 5,
		borderRadius: 20,
		paddingLeft: 8,
		paddingTop: 8
	},
	favouriteContainer: {
		position: 'absolute',
		right: 10,
		marginTop: 20,
		zIndex: 10
	}
});

function mapStateToProps(state) {
	return {
		userDetail: state.userDetail,
		zirafer: state.zirafer,
		reviews: state.reviews
	};
}

export default connect(
	mapStateToProps,
	{
		fetchZiraferDetailData: fetchZiraferDetail,
		clearZiraferDetailData: clearZiraferDetail,
		setAppStateData: setAppState
	}
)(Zirafer);
