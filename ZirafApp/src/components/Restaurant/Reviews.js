import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	ScrollView,
	StyleSheet,
	View,
	TouchableOpacity,
	Image
} from 'react-native';
import { fetchRestaurantReview } from '../../js/actions/actionCreators';
import Text from '../common/Text';
import LoadingIndicator from '../common/LoadingIndicator';
import cs from '../../styles/common-styles';
import FastImage from 'react-native-fast-image';

class RestaurantReview extends Component {
	constructor(args) {
		super(args);
		this.state = {};
	}

	componentDidMount() {
		const { restaurantReview, fetchRestaurantReviewData } = this.props;
		const { restaurantId } = this.props;
		if (
			!restaurantReview ||
			restaurantReview.restaurantId !== restaurantId
		) {
			fetchRestaurantReviewData(restaurantId);
		}
	}

	handleOpenModal() {
		const { openSortModal } = this.props;
		if (openSortModal) {
			openSortModal();
		}
	}

	handleNavigation(navigateData) {
		const { navigation } = this.props;

		navigation.navigate('ZiraferDetail', navigateData);
	}

	handleRating(ratingBreakdown) {
		const { onRating } = this.props;

		if (onRating) {
			onRating(ratingBreakdown);
		}
	}

	render() {
		const { restaurantReview, reviews } = this.props;
		if (!restaurantReview || restaurantReview.isFetching) {
			return <LoadingIndicator />;
		}

		if (restaurantReview.data.length === 0) {
			return (
				<Text style={[cs.paddingTB30, cs.textCenter, cs.textOrange]}>
					No reviews found!
				</Text>
			);
		}

		return (
			<View style={styles.container}>
				<ScrollView style={{}}>
					<View style={[]}>
						<View
							style={{
								alignItems: 'flex-start',
								marginBottom: 20
							}}>
							<TouchableOpacity
								onPress={this.handleOpenModal.bind(this)}
								style={{ flexDirection: 'row' }}>
								<Text
									style={[
										cs.textWhite,
										cs.font12,
										cs.textBold,
										{ paddingLeft: 5, paddingRight: 5 }
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
						</View>
						{reviews && reviews.length ? (
							<View style={{ paddingLeft: 10, paddingRight: 10 }}>
								{reviews.map((review, idx) => (
									<View
										style={{
											alignItems: 'center',
											marginBottom: 25
										}}
										key={idx}>
										<TouchableOpacity
											onPress={this.handleNavigation.bind(
												this,
												{ id: review.zirafer.id }
											)}>
											{review.zirafer.image ? (
												<FastImage
													resizeMode={FastImage.resizeMode.cover}
													style={styles.ziraferImage}
													source={{
														uri:
															review.zirafer.image
													}}
												/>
											) : (
												<Image
													style={styles.ziraferImage}
													source={require('../../images/profile-default.png')}
												/>
											)}
										</TouchableOpacity>
										<TouchableOpacity
											onPress={this.handleNavigation.bind(
												this,
												{ id: review.zirafer.id }
											)}>
											<Text
												style={[
													cs.font22,
													cs.textOrange,
													cs.marginTB10,
													cs.textBold
												]}
												fontVisby={true}>
												{review.zirafer.displayName}
											</Text>
										</TouchableOpacity>
										<View style={{ flexDirection: 'row' }}>
											<View
												style={[
													styles.reviewTextContainer
												]}>
												<Text style={[cs.font12]}>
													{review.review}
												</Text>
											</View>
											<TouchableOpacity
												style={[styles.rating]}
												onPress={this.handleRating.bind(
													this,
													review.ratingBreakdown
												)}>
												<Text
													style={[
														cs.textOrange,
														cs.textCenter,
														cs.font18,
														cs.textBold
													]}
													fontVisby={true}>
													{review.rating
														? review.rating.toFixed(
																1
														  )
														: 0.0}
												</Text>
											</TouchableOpacity>
										</View>
									</View>
								))}
							</View>
						) : (
							<Text style={cs.textCenter}>No review found</Text>
						)}
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#1d1d1c',
		paddingTop: 5
	},
	ziraferImage: {
		width: 80,
		height: 80,
		borderRadius: 40
	},
	reviewTextContainer: {
		width: '80%',
		paddingRight: 20,
		borderRightWidth: 2,
		borderColor: '#fff',
		paddingBottom: 5
	},
	rating: {
		width: '20%',
		alignSelf: 'center',
		paddingLeft: 15
	}
});

function mapStateToProps(state) {
	return {
		restaurantReview: state.restaurantReview
	};
}

export default connect(
	mapStateToProps,
	{
		fetchRestaurantReviewData: fetchRestaurantReview
	}
)(RestaurantReview);
