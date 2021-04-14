import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	View
} from 'react-native';
import Text from '../common/Text';
import {
	fetchDiscountRestaurants,
	clearAppState,
	setAppState
} from '../../js/actions/actionCreators';
import RestaurantList from '../common/RestaurantList';
import cs from '../../styles/common-styles';
import LoadingIndicator from '../common/LoadingIndicator';

const { height, width } = Dimensions.get('window');

class Discount extends Component {
	constructor(args) {
		super(args);
		this.state = {
			refreshing: false,
			sorting: {
				location: 'near'
			}
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		const { appState, fetchDiscountRestaurantsList, navigation } = this.props;
		const { sorting } = this.state;

		let location = Object.assign({}, appState.CURRENT_LOCATION);

		return fetchDiscountRestaurantsList(
			//navigation.state.params.id,
			{},
			location,
			sorting
		)
			.then(res => Promise.resolve(res))
			.catch(err => Promise.reject(err));
	}

	handleGoBack() {
		const { navigation } = this.props;
		navigation.goBack();
	}

	handleRefresh() {
		this.setState({ refreshing: true });
		const { appState, fetchDiscountRestaurantsList, navigation } = this.props;

		let location = Object.assign({}, appState.CURRENT_LOCATION);

		return this.fetchData()
			.then(res => this.setState({ refreshing: false }))
			.catch(err => this.setState({ refreshing: false }));
	}

	handleSorting(sorting) {
		this.setState({ sorting }, () => this.fetchData());
	}

	render() {
		const { userDetail, navigation, discountRestaurants } = this.props;
		const { region } = this.state;
		if (!discountRestaurants) {
			return <LoadingIndicator />;
		}

		let isSignedIn = false;
		if (userDetail) {
			isSignedIn = true;
		}

		return (
			<View style={styles.container}>
				<View style={styles.backNavContainer}>
					<TouchableOpacity onPress={this.handleGoBack.bind(this)}>
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
				<View style={[cs.padding15]}>
					<Text
						style={[
							cs.textCenter,
							cs.textBold,
							cs.font20,
							{ color: '#F09006', marginBottom: 10 }
						]}
						fontVisby={true}>
						{navigation.state.params.title &&
							navigation.state.params.title.toUpperCase()}
					</Text>
					<Text
						style={[
							cs.textCenter,
							cs.font12,
							cs.textItalic,
							{
								color: '#737373',
								marginLeft: 50,
								marginRight: 50
							}
						]}>
						{navigation.state.params.info}
					</Text>
				</View>
				<RestaurantList
					refreshing={this.state.refreshing}
					onRefresh={this.handleRefresh.bind(this)}
					onSorting={this.handleSorting.bind(this)}
					data={discountRestaurants.data}
					navigation={navigation}
					isSignedIn={isSignedIn}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1D1D1C',
		paddingTop: 50
	},
	backNavContainer: {
		position: 'absolute',
		left: 0,
		top: 50,
		paddingRight: 5,
		borderRadius: 20,
		paddingLeft: 25,
		paddingTop: 25,
		zIndex: 100
	}
});

function mapStateToProps(state) {
	return {
		userDetail: state.userDetail,
		discountRestaurants: state.discountRestaurants,
		appState: state.appState
	};
}

export default connect(
	mapStateToProps,
	{
		fetchDiscountRestaurantsList: fetchDiscountRestaurants
	}
)(Discount);
