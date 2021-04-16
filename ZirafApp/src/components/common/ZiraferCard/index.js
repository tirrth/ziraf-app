import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Text from './../Text';
import cs from './../../../styles/common-styles';
import FastImage from 'react-native-fast-image';

class ZiraferCard extends React.PureComponent {
	constructor(args) {
		super(args);
		this.state = {};
	}

	handleNavigation(navigate, navigateData) {
		const { data, navigation } = this.props;
		if (navigate) {
			navigation.navigate(navigate, navigateData);
		}
	}

	render() {
		const { data, navigation, isFavourite, small, style } = this.props;
		if (!data) {
			return null;
		}

		return (
			<View
				style={[
					{
						justifyContent: 'center',
						alignItems: 'center',
						...styles.container
					},
					small && {
						marginBottom: 10,
						height: 130,
						width: '33%'
					},
					style && {...style}
				]}>
				<TouchableOpacity
					onPress={this.handleNavigation.bind(this, data.navigate, {
						id: data.id
					})}>
					<View style={{ flex: 1 }}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center'
							}}>
							{data.image && data.image.detail ? (
								<FastImage
									style={[
										styles.cardImage,
										small && {
											width: 90,
											height: 90,
											borderRadius: 45
										}
									]}
									source={{
										uri: data.image && data.image.detail
									}}
									resizeMode={FastImage.resizeMode.cover}
								/>
							) : (
								<FastImage
									source={require('../../../images/avatar-01.png')}
									style={[
										styles.cardImage,
										small && {
											width: 90,
											height: 90,
											borderRadius: 45
										}
									]}
									resizeMode={FastImage.resizeMode.cover}
								/>
							)}

							{data.isFavourite && (
								<View style={styles.favouriteContainer}>
									<Image
										style={{
											height: 20,
											resizeMode: 'contain',
											alignSelf: 'center',
											marginRight: small ? 0 : 5
										}}
										source={require('../../../images/icons/star-filled.png')}
									/>
								</View>
							)}
						</View>
						{small ? (
							<View style={styles.infoContainer}>
								<Text
									style={[
										styles.speciality,
										cs.textCenter,
										cs.font10
									]}
									fontVisby={true}>
									{data.displayName}
								</Text>
							</View>
						) : (
							<View style={styles.infoContainer}>
								<Text
									style={[
										styles.name,
										cs.textCenter,
										cs.textBold,
										cs.font13
									]}
									fontVisby={true}>
									{data.displayName}
								</Text>
								{data.speciality &&
								data.speciality.length > 0 ? (
									<Text
										style={[
											styles.speciality,
											cs.textCenter,
											cs.font10
										]}>
										Speciality: {data.speciality.join(', ')}
									</Text>
								) : null}
							</View>
						)}
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 45,
		width: '50%',
		padding: 10,
		height: 140
	},
	cardImage: {
		width: '100%',
		height: 115,
		width: 115,
		borderRadius: 60
	},
	name: {
		color: '#F2910A'
	},
	speciality: {
		color: '#FFFFFF'
	},
	infoContainer: {
		marginBottom: 8,
		marginTop: 8
	},
	distanceContainer: {
		flexDirection: 'row'
	},
	info: {
		position: 'absolute',
		left: 0,
		paddingTop: 1,
		paddingBottom: 3,
		paddingLeft: 10,
		paddingRight: 10,
		marginTop: 6
	},
	favouriteContainer: {
		position: 'absolute',
		right: 10,
		bottom: 5
	}
});

export default ZiraferCard;
