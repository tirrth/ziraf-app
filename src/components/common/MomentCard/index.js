import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Text from './../Text';
import cs from './../../../styles/common-styles';
import FastImage from 'react-native-fast-image';

class MomentCard extends React.PureComponent {
	constructor(args) {
		super(args);
		this.state = {};
	}

	handleNavigation() {
		const { data, navigation } = this.props;
		if (data) {
			navigation.navigate(data.navigate, data);
		}
	}

	render() {
		const { data, navigation, isFavourite, onInfo } = this.props;
		if (!data) {
			return null;
		}

		return (
			<View style={styles.container}>
				<TouchableOpacity
					onPress={this.handleNavigation.bind(this, data)}>
					<View style={{ flex: 1 }}>
						<View>
							<FastImage
								resizeMode={FastImage.resizeMode.cover}
								style={styles.cardImage}
								source={{ uri: data.image.preview }}
							/>
							{data.info ? (
								<TouchableOpacity
									style={styles.info}
									onPress={() => onInfo && onInfo(data.info)}>
									<Image
										style={{
											height: 17,
											resizeMode: 'contain',
											alignSelf: 'center'
										}}
										source={require('../../../images/icons/information-icon.png')}
									/>
								</TouchableOpacity>
							) : (
								''
							)}
						</View>
						<View style={styles.infoContainer}>
							<Text
								style={[
									styles.name,
									cs.textCenter,
									cs.textBold,
									cs.font20
								]}
								fontVisby={true}>
								{data.title && data.title.toUpperCase()}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 45
	},
	cardImage: {
		width: '100%',
		height: 180,
		borderRadius: 10
	},
	name: {
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
	}
});

export default MomentCard;
