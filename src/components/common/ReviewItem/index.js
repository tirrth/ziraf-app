import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Text from './../Text';
import cs from './../../../styles/common-styles';
import FastImage from 'react-native-fast-image';

class ReviewItem extends React.PureComponent {
	constructor(args) {
		super(args);
		this.state = {};
	}

	handleImagePress(image) {
		const { onPress } = this.props;

		if (onPress) {
			onPress({
				alertSuccess: true,
				alertTitle: '',
				alertDetail: '',
				alertChildren: (
					<View>
						<FastImage
							style={{
								width: '100%',
								height: 200,
								borderRadius: 5
							}}
							source={{
								uri: image.detail
							}}
						/>
						<Text allowFontScaling={false} style={[cs.textCenter, cs.marginT15]}>
							{image.name} - {image.symbol}
							{image.price}
						</Text>
					</View>
				)
			});
		}
	}

	handleNavigation(navigateData) {
		const { navigation } = this.props;

		navigation.navigate('RestaurantDetail', navigateData);
	}

	handleRating(ratingBreakdown) {
		const { onRating } = this.props;
		if (onRating) {
			// alert(JSON.stringify(ratingBreakdown));
			onRating(ratingBreakdown);
		}
	}

	render() {
		const { data, navigation, isFavourite } = this.props;
		if (!data) {
			return null;
		}

		return (
			<View style={{ alignItems: 'center', marginBottom: 25 }}>
				<View style={[styles.imageContainer]}>
					{data.images.map((image, idx) => (
						<TouchableOpacity
							onPress={this.handleImagePress.bind(this, image)}
							key={`image-top-dish-${idx}`}>
							<FastImage
								resizeMode={FastImage.resizeMode.cover}
								style={styles.ziraferImage}
								source={{ uri: image.detail }}
							/>
						</TouchableOpacity>
					))}
				</View>
				<TouchableOpacity
					onPress={this.handleNavigation.bind(this, {
						id: data.restaurantId
					})}>
					<Text
						allowFontScaling={false}
						style={[
							cs.font22,
							cs.textOrange,
							cs.marginTB10,
							cs.textBold
						]}
						fontVisby={true}>
						{data.restaurantName}
					</Text>
				</TouchableOpacity>
				<View style={{ flexDirection: 'row' }}>
					<View style={[styles.reviewTextContainer]}>
						<Text allowFontScaling={false} style={[cs.font12]}>{data.review}</Text>
					</View>
					<TouchableOpacity
						style={[styles.rating]}
						onPress={this.handleRating.bind(
							this,
							data.ratingBreakdown
						)}>
						<Text
							allowFontScaling={false}
							style={[
								cs.textOrange,
								cs.textCenter,
								cs.font18,
								cs.textBold
							]}
							fontVisby={true}>
							{data.rating ? data.rating.toFixed(1) : 0.0}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	imageContainer: {
		flexDirection: 'row'
	},
	ziraferImage: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginLeft: 10,
		marginRight: 10
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

export default ReviewItem;
