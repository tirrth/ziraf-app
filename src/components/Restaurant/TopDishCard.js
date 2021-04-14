import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Text from '../common/Text';
import cs from '../../styles/common-styles';
import FastImage from 'react-native-fast-image';

class TopDishCard extends Component {
	constructor(args) {
		super(args);
		this.state = {};
	}

	render() {
		const { data } = this.props;
		if (!data) {
			return null;
		}

		return (
			<TouchableOpacity
				style={styles.container}
				onPress={() => {
					const { onPress } = this.props;
					if (onPress) {
						onPress();
					}
				}}>
				<View style={{ flex: 1 }}>
					<View>
						<FastImage
							resizeMode={FastImage.resizeMode.cover}
							style={styles.dishCardImage}
							source={{ uri: data.image.preview }}
						/>
						<View style={styles.dishPrice}>
							<Text
								allowFontScaling={false}
								style={[
									cs.textWhite,
									cs.textCenter,
									{ fontSize: 12 }
								]}>
								&#163;{data.price}
							</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#1d1d1c',
		marginBottom: 10,
		marginLeft: 8,
		marginRight: 8,
		marginTop: 5
	},
	dishCardImage: {
		width: 90,
		height: 90,
		borderRadius: 45
	},
	dishPrice: {
		alignSelf: 'center',
		width: 55,
		height: 35,
		borderRadius: 20,
		backgroundColor: '#1d1d1c',
		position: 'absolute',
		bottom: -15,
		padding: 5,
		justifyContent: 'center'
	}
});

export default TopDishCard;
