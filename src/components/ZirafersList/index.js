import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Image,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';
import Text from './../common/Text';
import { fetchZirafers, clearAppState } from '../../js/actions/actionCreators';
import LoadingIndicator from './../common/LoadingIndicator';
import ZiraferProfiles from './Profiles';
import ZiraferSpecialities from './Speciality';
import ZiraferFavourites from './Favourites';
import cs from './../../styles/common-styles';

class Zirafers extends Component {
	constructor(args) {
		super(args);
		this.state = {
			currentTab: 'profiles',
			searchText: '',
			refreshing: false
		};
	}

	componentDidMount() {
		const { ziraferList, fetchZiraferList, navigation } = this.props;
		if (!ziraferList) {
			fetchZiraferList({});
		}

		const tab = navigation.getParam('tab');
		if (tab) {
			this.handleTabChange(tab);
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.navigation !== prevProps.navigation) {
			const { navigation } = this.props;
			const tab = navigation.getParam('tab');
			if (tab) {
				this.handleTabChange(tab);
			}
		}
	}

	handleTabChange(tab) {
		this.setState({
			currentTab: tab
		});
	}

	handleGoBack() {
		const { navigation } = this.props;
		navigation.goBack();
	}

	triggerSearch() {
		const { searchText } = this.state;
		//console.log('Search Text : ', searchText);
	}

	handleRefresh() {
		const { fetchZiraferList } = this.props;
		this.setState({ refreshing: true });
		return fetchZiraferList({})
			.then(res => this.setState({ refreshing: false }))
			.catch(err => this.setState({ refreshing: false }));
	}

	render() {
		const { ziraferList, navigation } = this.props;
		const { currentTab, searchText } = this.state;

		// if (!ziraferList || ziraferList.isFetching) {
		// 	return <LoadingIndicator />;
		// }

		if (!ziraferList) {
			return <LoadingIndicator />;
		}

		return (
			<View style={[styles.container]}>
				<View
					style={{
						alignItems: 'flex-start',
						marginBottom: 10,
						marginTop: 10,
						flexDirection: 'row',
						alignItems: 'center'
					}}>
					<View
						style={{
							flex: 1,
							marginRight: 25,
							marginLeft: 60
						}}>
						<TextInput
							style={styles.searchInput}
							placeholderTextColor={'#737373'}
							keyboardType="default"
							placeholder="Type here..."
							onChangeText={text =>
								this.setState({ searchText: text })
							}
							value={searchText}
						/>
						<TouchableOpacity
							onPress={this.triggerSearch.bind(this)}
							style={{
								position: 'absolute',
								right: 0,
								top: 10
							}}>
							<Image
								source={require('../../images/icons/search.png')}
								style={{
									height: 15,
									resizeMode: 'contain'
								}}
							/>
						</TouchableOpacity>
					</View>
				</View>
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
				<View
					style={{
						flex: 1
					}}>
					<View
						style={[
							{
								flexDirection: 'row',
								justifyContent: 'space-around'
							},
							cs.paddingTB10
						]}>
						<TouchableOpacity
							onPress={() => this.handleTabChange('profiles')}>
							<Text
								style={[
									cs.font14,
									cs.textWhite,
									currentTab === 'profiles'
										? styles.activeTabText
										: styles.tabText
								]}>
								Profiles
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => this.handleTabChange('speciality')}>
							<Text
								style={[
									cs.font14,
									cs.textWhite,
									currentTab === 'speciality'
										? styles.activeTabText
										: styles.tabText
								]}>
								Speciality
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => this.handleTabChange('favourites')}
							style={[
								currentTab === 'favourites'
									? styles.activeTab
									: styles.tab
							]}>
							<Text
								style={[
									cs.font14,
									cs.textWhite,
									currentTab === 'favourites'
										? styles.activeTabText
										: styles.tabText
								]}>
								Favourites
							</Text>
						</TouchableOpacity>
					</View>
					<View
						style={{
							flex: 1,
							padding: 15
						}}>
						{currentTab === 'profiles' && (
							<ZiraferProfiles
								refreshing={this.state.refreshing}
								onRefresh={this.handleRefresh.bind(this)}
								navigation={navigation}
								filter={searchText}
							/>
						)}
						{currentTab === 'speciality' && (
							<ZiraferSpecialities
								refreshing={this.state.refreshing}
								onRefresh={this.handleRefresh.bind(this)}
								navigation={navigation}
								filter={searchText}
							/>
						)}
						{currentTab === 'favourites' && (
							<ZiraferFavourites
								refreshing={this.state.refreshing}
								onRefresh={this.handleRefresh.bind(this)}
								navigation={navigation}
								filter={searchText}
							/>
						)}
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#1D1D1C',
		flex: 1,
		paddingTop: 50
	},
	searchInput: {
		borderWidth: 1,
		borderColor: '#fff',
		borderRadius: 20,
		padding: 8,
		color: '#fff',
		paddingRight: 40
	},
	tabText: {
		color: '#FFFFFF'
	},
	activeTabText: {
		color: '#F2910A',
		fontWeight: 'bold'
	},
	backNavContainer: {
		position: 'absolute',
		left: 0,
		paddingRight: 5,
		borderRadius: 20,
		paddingLeft: 25,
		paddingTop: 70
	}
});

function mapStateToProps(state) {
	return {
		appConfig: state.appConfig,
		ziraferList: state.ziraferList
	};
}

export default connect(
	mapStateToProps,
	{ fetchZiraferList: fetchZirafers }
)(Zirafers);
