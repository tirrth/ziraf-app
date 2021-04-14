import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	ScrollView,
	StyleSheet,
	View,
	FlatList,
	SectionList,
	Dimensions,
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

class ZiraferSpecialities extends Component {
	constructor(props) {
		super(props);

		this.state = {
			favouriteZirafers: [],
			filter: ''
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
			
			if(this._isMounted) {
				this.setState({ favouriteZirafers });
			}
		} catch (err) {
			//console.log('Something went wrong');
		}
	};

	renderItem({ section, index }) {
		const { navigation } = this.props;

		const numColumns = 2;

		if (index % numColumns !== 0) return null;

		const items = [];

		for (let i = index; i < index + numColumns; i++) {
			if (i >= section.data.length) {
				break;
			}

			section.data[i].navigate = 'ZiraferDetail';

			items.push(
				<ZiraferCard
					data={section.data[i]}
					navigation={navigation}
					key={`zirafer-${section.title}-${section.data[i].id}`}
					style={{marginLeft: 10, marginRight: 10}}
					small
				/>
			);
		}

		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-start'
				}}>
				{items}
			</View>
		);
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

		const formatData = data => {
			const specialities = [];
			const sections = {};
			const output = [];
			data.forEach(d => {
				d.speciality.forEach(speciality => {
					if (specialities.indexOf(speciality) === -1) {
						specialities.push(speciality);
						sections[speciality] = [];
					}

					sections[speciality].push(d);
				});
			});

			specialities.sort().forEach(speciality => {
				output.push({ title: speciality, data: sections[speciality] });
			});

			return output;
		};

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
								<SectionList
									renderSectionHeader={({
										section: { title }
									}) => (
										<Text
											style={[
												cs.font20,
												cs.textBold,
												styles.sectionTitle
											]}
											fontVisby={true}>
											{title}
										</Text>
									)}
									sections={formatData(
										ziraferList.data
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
															favouriteZirafers.indexOf(
																zirafer.id
															) > -1
													};
												} else {
													return {
														...zirafer,
														isFavourite: false
													};
												}
											})
									)}
									renderItem={this.renderItem.bind(this)}
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
	},
	sectionTitle: {
		color: '#F09006'
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
)(ZiraferSpecialities);
