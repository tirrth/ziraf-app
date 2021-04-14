import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

class HeaderLeft extends Component {
	constructor(args){
        super(args);
        this.state = {}
    }

	render() {
		return null;
		const { navState, navigation } = this.props;
		let activeState = false;
		if (navState && navState.routeName === "FavouriteRestaurants") {
			activeState = true;
		}
		return (
			<View style={{ flex: 1, flexDirection: 'row' }}>
				<TouchableOpacity onPress={() => {
					navigation.navigate('FavouriteRestaurants');
				}}>
					{(activeState)?
						<Image source={require('../images/icons/favourite_active.png')}
							style={styles.favouriteIcon} />
						:
						<Image source={require('../images/icons/favourite_default.png')}
							style={styles.favouriteIcon} />
					}
				</TouchableOpacity>
	    	</View>
		);
	}
}

const styles = StyleSheet.create({
	favouriteIcon: {
		height: 22,
		resizeMode: 'contain',
		alignSelf: 'center',
		marginLeft: 8
	}
});

export default HeaderLeft;