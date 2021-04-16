import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	ScrollView,
	View,
	FlatList,
	Dimensions,
	StyleSheet,
	RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { clearAppState } from '../../js/actions/actionCreators';
import Text from '../common/Text';
import LoadingIndicator from '../common/LoadingIndicator';
import ZiraferCard from '../common/ZiraferCard';
import cs from '../../styles/common-styles';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ZiraferProfiles extends Component {
	constructor(props) {
		super(props);

		this.state = {
			favouriteZirafers: [],
			filter: '',
			refreshing: false
		};
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentDidMount() {
		this._isMounted = true;
		this.initData();
	}

	componentDidUpdate(prevProps) {
		if (
			this.props.appState && this.props.appState.FETCH_FAVOURITE
			) {
			this.initData();
		}

		if (this.props.filter !== prevProps.filter) {
			this.setState({ filter: this.props.filter });
		}
	}

	initData = async () => {
		try {
			let favouriteZirafers = await AsyncStorage.getItem(
				'@Ziraf:favouriteZirafers'
			);
			if (!favouriteZirafers) {
				favouriteZirafers = [];
			} else {
				favouriteZirafers = JSON.parse(favouriteZirafers);
			}
			if(this._isMounted){
				this.setState({ favouriteZirafers });
			}			
		} catch (err) {
			//console.log('Something went wrong');
		}
	};

	renderItem({ item, index }) {
		const { navigation } = this.props;
		item.navigate = 'ZiraferDetail';
		return <ZiraferCard data={item} navigation={navigation} />;
	}

	handleRefresh() {
		const { onRefresh } = this.props;

		if (onRefresh) {
			this.setState({ refreshing: true });
			onRefresh()
				.then(res => {
					this.setState({ refreshing: false }, () => {
						this.initData();
					});
				})
				.catch(err => this.setState({ refreshing: false }));
		}
	}

	render() {
		const { userDetail, ziraferList, navigation } = this.props;
		const { favouriteZirafers, filter } = this.state;

		let isSignedIn = false;
		if (userDetail) {
			isSignedIn = true;
		}

		return (
			<View style={[styles.container]}>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.handleRefresh.bind(this)}
						/>
					}>
					<View style={[cs.padding15]}>
						{ziraferList && ziraferList.data ? (
							ziraferList.data.filter(
								zirafer =>
									zirafer.displayName.indexOf(filter) > -1
							).length > 0 ? (
								<FlatList
									data={ziraferList.data
										.filter(
											zirafer =>
												zirafer.displayName.indexOf(
													filter
												) > -1
										)
										.map(zirafer => {
											if(isSignedIn){
												return {
													...zirafer,
													isFavourite:
														favouriteZirafers &&
														favouriteZirafers.indexOf(
															zirafer.id
														) > -1
												};
											} else {
												return {
													...zirafer,
													isFavourite:false
												};
											}
										})}
									numColumns={2}
									horizontal={false}
									renderItem={this.renderItem.bind(this)}
									windowSize={11}
									keyExtractor={zirafer => zirafer.id}
								/>
							) : (
								<Text
									style={[
										cs.paddingTB30,
										cs.textCenter,
										cs.textOrange
									]}>
									There is no Zirafer available
								</Text>
							)
						) : null}
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

function mapStateToProps(state) {
	return {
		userDetail: state.userDetail,
		ziraferList: state.ziraferList,
		appState: state.appState
	};
}

export default connect(
	mapStateToProps,
	{
		clearAppStateData: clearAppState
	}
)(ZiraferProfiles);
