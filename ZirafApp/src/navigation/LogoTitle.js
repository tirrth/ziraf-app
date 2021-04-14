import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	StyleSheet,
	Image,
	TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { setAppState } from '../js/actions/actionCreators';

class LogoTitle extends Component {
	constructor(args) {
		super(args);
		this.state = {};
	}

	handleLogoClick = async () => {
		const { userDetail, setAppStateData, appState, navigation } = this.props;
		let isSignedIn = false;
		if (userDetail) {
			isSignedIn = true;
		}

		if(isSignedIn){
			if (navigation.state.routeName !== 'RestaurantList') {
				navigation.navigate('RestaurantList');
			}
			if (appState && appState.SHOW_MY_VIEW) {
				setAppStateData('SHOW_MY_VIEW', false);
				setAppStateData('FILTERS', {});
			} else {
				const myFilters = await this.getMyViewFilters();
				setAppStateData('SHOW_MY_VIEW', true);
				setAppStateData('FILTERS', myFilters);
			}
			setAppStateData('FETCH_FILTERED_DATA', true);
		} else {
			setAppStateData('PROMPT_ONLY_USER_ALLOWED_ALERT', true);
		}
	};

	getMyViewFilters = async () => {
		let myViewFilters = await AsyncStorage.getItem('@Ziraf:MyViewFilters');
		if (!myViewFilters) {
			myViewFilters = {};
		} else {
			myViewFilters = JSON.parse(myViewFilters);
		}
		return myViewFilters;
	};

	render() {
		const { appState, navigation } = this.props;
		let appLogo = (
			<Image
				source={require('../images/ziraf_logo.png')}
				style={{
					height: 35,
					resizeMode: 'contain',
					alignSelf: 'center'
				}}
			/>
		);
		if (
			appState &&
			appState.SHOW_MY_VIEW &&
			navigation.state.routeName === 'RestaurantList'
		) {
			appLogo = (
				<Image
					source={require('../images/ziraf_logo_myview.png')}
					style={{
						height: 45,
						resizeMode: 'contain',
						alignSelf: 'center'
					}}
				/>
			);
		}

		return (
			<TouchableOpacity
				onPress={this.handleLogoClick.bind(this)}
				style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
				{appLogo}
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({});

function mapStateToProps(state) {
	return {
		userDetail: state.userDetail,
		appState: state.appState
	};
}

export default connect(
	mapStateToProps,
	{
		setAppStateData: setAppState
	}
)(LogoTitle);
