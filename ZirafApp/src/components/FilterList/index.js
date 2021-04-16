import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Image,
	StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { setAppState } from '../../js/actions/actionCreators';
import Text from '../common/Text';
import Collapsable from '../common/Collapsable';
import LoadingIndicator from '../common/LoadingIndicator';
import cs from '../../styles/common-styles';

const FILTER_NAME_MAP = {
	cuisines: 'Cuisine',
	locationRange: 'Location',
	moments: 'Moments',
	priceRange: 'Price',
	ratingRange: 'Rating',
	zirafers: 'Zirafers',
	delivery: 'Takeaway',
	reservation: 'Reservation'
};

class CheckBoxList extends Component {
	render() {
		const { data, keyName, selectedFilters } = this.props;
		return (
			<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
				{data.map((item, idx) => {
					let checkBoxImage = require('../../images/icons/SquareCheckmark.png');
					if (selectedFilters.indexOf(item.id) !== -1) {
						checkBoxImage = require('../../images/icons/SquareCheckmark_selected.png');
					}
					return (
						<TouchableOpacity
							onPress={() =>
								this.props.toggleSelect(keyName, item.id)
							}
							key={idx}
							style={{
								width: '33%',
								flexDirection: 'row',
								paddingTop: 5,
								paddingBottom: 5,
								paddingRight: 10
							}}>
							<Image
								source={checkBoxImage}
								style={{
									height: 10,
									resizeMode: 'contain',
									alignSelf: 'flex-start',
									marginTop: 3
								}}
							/>
							<Text
								allowFontScaling={false}
								style={{ fontSize: 10, paddingRight: 10 }}>
								{item.name}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}
}

class RangeSlider extends Component {
	render() {
		const { values, filterName, sliderValuesChange, data } = this.props;

		return (
			<MultiSlider
				sliderLength={150}
				step={1}
				min={data.min}
				max={data.max}
				onValuesChange={values =>
					sliderValuesChange(filterName, values)
				}
				values={
					values && values.length > 1
						? values
						: data && data.min && data.max && [data.min, data.max]
				}
				unselectedStyle={{
					backgroundColor: '#737373'
				}}
				selectedStyle={{
					backgroundColor: '#F2910A'
				}}
				markerStyle={{
					height: 20,
					width: 20,
					borderRadius: 10,
					backgroundColor: '#F2910A',
					borderColor: '#F2910A'
				}}
			/>
		);
	}
}

class FilterList extends Component {
	constructor(args) {
		super(args);
		this.state = {
			filters: {},
			selected: []
		};
	}

	componentDidMount() {
		const { appConfig } = this.props;
		if (appConfig && appConfig.data && appConfig.data.filters) {
			const { appState } = this.props;
			if (appState.SHOW_MY_VIEW) {
				this.setMyView();
			} else {
				this.setDefaultValues(appConfig.data.filters);
			}
		}
	}

	setDefaultValues(type) {
		let filters = this.getDefaultFilterValues(type);
		if (!filters) {
			return;
		}
		this.setState({ filters });
	}

	getDefaultFilterValues(type) {
		const { appConfig, appState } = this.props;
		if (type != 'reset' && appState && appState.FILTERS) {
			return appState.FILTERS;
		}
		let filters = {};
		let filterData = null;
		if (appConfig && appConfig.data && appConfig.data.filters) {
			filterData = appConfig.data.filters;
		}
		if (!filterData) {
			return null;
		}
		Object.keys(filterData).map(filter => {
			if (!Array.isArray(filterData[filter])) {
				filters[filter] = [];
				filters[filter][0] = filterData[filter].min
					? filterData[filter].min
					: 0;
				filters[filter][1] = filterData[filter].max
					? filterData[filter].max
					: 0;
			} else {
				filters[filter] = [];
			}
		});

		return filters;
	}

	sliderValuesChange(filterName, values) {
		const { filters } = this.state;
		filters[filterName] = values;

		this.setState({
			filters
		});
	}

	toggleSelect(filterName, id) {
		let { filters } = this.state;
		let idx = filters[filterName] ? filters[filterName].indexOf(id) : 0;
		if (idx != -1) {
			filters[filterName] && filters[filterName].splice(idx, 1);
		} else {
			filters[filterName] && filters[filterName].push(id);
		}
		this.setState({ filters });
	}

	setMyView = async () => {
		const { userDetail, setAppStateData } = this.props;
		let isSignedIn = false;
		if (userDetail) {
			isSignedIn = true;
		}

		if (isSignedIn) {
			setAppStateData('SHOW_MY_VIEW', true);
			const myFilters = await this.getMyViewFilters();
			const selected = [];
			for (var i in myFilters) {
				selected.push(i);
			}

			this.setState({
				filters: myFilters,
				selected
			});
		} else {
			setAppStateData('PROMPT_ONLY_USER_ALLOWED_ALERT', true);
		}
	};

	getMyViewFilters = async () => {
		let myViewFilters = await AsyncStorage.getItem('@Ziraf:MyViewFilters');

		if (!myViewFilters) {
			myViewFilters = [];
			// this.getDefaultFilterValues();
		} else {
			myViewFilters = JSON.parse(myViewFilters);
		}
		return myViewFilters;
	};

	handleFilterSubmit = async () => {
		const { setAppStateData, navigation, appState } = this.props;
		const { filters, selected } = this.state;

		const filtered = {};
		selected.forEach(select => {
			filtered[select] = filters[select];
		});

		setAppStateData('FILTERS', filtered);

		if (appState.SHOW_MY_VIEW) {
			await AsyncStorage.setItem(
				'@Ziraf:MyViewFilters',
				JSON.stringify(filtered)
			);
		} else {
			setAppStateData('SHOW_FILTER_VIEW', true);
		}
		setAppStateData('FETCH_FILTERED_DATA', true);
		navigation.navigate('RestaurantList');
	};

	handleCollapsableToggle(filter, toggle) {
		const { filters, selected } = this.state;
		if (!toggle) {
			filters[filter] && filters[filter].length > 0
				? ''
				: (filters[filter] = []);
			selected.push(filter);
			this.setState({ selected });
		} else {
			const updatedSelected = selected
				? selected.filter(select => select !== filter)
				: [];

			this.setState({ selected: updatedSelected });
		}
	}

	getFilterContent(filter, data) {
		const { filters } = this.state;
		let filterContent = null;
		switch (filter) {
			case 'cuisines':
			case 'zirafers':
			case 'moments':
				filterContent = (
					<CheckBoxList
						data={data[filter]}
						keyName={filter}
						toggleSelect={this.toggleSelect.bind(this)}
						selectedFilters={filters[filter] ? filters[filter] : []}
					/>
				);
				break;

			case 'locationRange':
				filterContent = (
					<View
						style={{
							flexDirection: 'row',
							width: '100%',
							alignItems: 'center'
						}}>
						<Text
							allowFontScaling={false}
							style={[
								cs.textBold,
								cs.font12,
								{ width: '25%' }
							]}>{`${
							filters[filter] && filters[filter][0]
								? filters[filter][0]
								: data[filter].min
						}mi`}</Text>
						<View style={{ width: '50%', alignItems: 'center' }}>
							<RangeSlider
								values={filters[filter]}
								filterName={filter}
								data={data[filter]}
								sliderValuesChange={this.sliderValuesChange.bind(
									this
								)}
							/>
						</View>
						<Text
							allowFontScaling={false}
							style={[
								cs.textBold,
								cs.font12,
								{ width: '25%', textAlign: 'right' }
							]}>{`${
							filters[filter] && filters[filter][1]
								? filters[filter][1]
								: data[filter].max
						}mi`}</Text>
					</View>
				);
				break;

			case 'priceRange':
				filterContent = (
					<View
						style={{
							flexDirection: 'row',
							width: '100%',
							alignItems: 'center'
						}}>
						<Text
							allowFontScaling={false}
							style={[cs.textBold, cs.font12, { width: '25%' }]}>
							&#163;
							{`${
								filters[filter] && filters[filter][0]
									? filters[filter][0]
									: data[filter].min
							}`}
						</Text>
						<View
							style={{
								width: '50%',
								alignItems: 'center'
							}}>
							<RangeSlider
								values={filters[filter]}
								filterName={filter}
								data={data[filter]}
								sliderValuesChange={this.sliderValuesChange.bind(
									this
								)}
							/>
						</View>
						<Text
							allowFontScaling={false}
							style={[
								cs.textBold,
								cs.font12,
								{ width: '25%', textAlign: 'right' }
							]}>
							&#163;
							{`${
								filters[filter] && filters[filter][1]
									? filters[filter][1]
									: data[filter].max
							}`}
						</Text>
					</View>
				);
				break;

			case 'ratingRange':
				filterContent = (
					<View
						style={{
							flexDirection: 'row',
							width: '100%',
							alignItems: 'center'
						}}>
						<Text
							allowFontScaling={false}
							style={[
								cs.textBold,
								cs.font12,
								{ width: '25%' }
							]}>{`${
							filters[filter] && filters[filter][0]
								? filters[filter][0]
								: data[filter].min
						}`}</Text>
						<View style={{ width: '50%', alignItems: 'center' }}>
							<RangeSlider
								values={filters[filter]}
								filterName={filter}
								data={data[filter]}
								sliderValuesChange={this.sliderValuesChange.bind(
									this
								)}
							/>
						</View>
						<Text
							allowFontScaling={false}
							style={[
								cs.textBold,
								cs.font12,
								{ width: '25%', textAlign: 'right' }
							]}>{`${
							filters[filter] && filters[filter][1]
								? filters[filter][1]
								: data[filter].max
						}`}</Text>
					</View>
				);
				break;

			default:
				filterContent = <Text>{filter}</Text>;
		}

		return <View style={[styles.filterContent]}>{filterContent}</View>;
	}

	render() {
		const { appConfig, appState, setAppStateData } = this.props;
		const { filters, selected } = this.state;

		if (!appConfig || appConfig.isFetching) {
			return <LoadingIndicator />;
		}

		let currentView = 'default';
		if (appState && appState.SHOW_MY_VIEW) {
			currentView = 'my-view';
		}

		return (
			<View style={styles.container}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						margin: 20
					}}>
					<TouchableOpacity onPress={() => this.setMyView()}>
						<Text
							style={[
								cs.font12,
								cs.textBold,
								currentView === 'my-view'
									? cs.textOrange
									: cs.textWhite
							]}>
							{currentView === 'my-view'
								? 'Your View'
								: 'Create Your View'}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => {
							this.setDefaultValues('reset');
							setAppStateData('SHOW_MY_VIEW', false);
						}}>
						<Text style={[cs.textWhite, cs.font12, cs.textBold]}>
							Clear Selection
						</Text>
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View
						style={[
							cs.paddingTB15,
							{ paddingLeft: 20, paddingRight: 20 }
						]}>
						{appConfig && appConfig.data && appConfig.data.filters
							? Object.keys(appConfig.data.filters).map(
									(filter, idx) => (
										<Collapsable
											onToggle={this.handleCollapsableToggle.bind(
												this,
												filter
											)}
											key={'acc_' + idx}
											item={{
												title: FILTER_NAME_MAP[filter]
													? FILTER_NAME_MAP[filter]
													: filter
											}}
											isSelected={true}
											isCollapsed={
												!(
													selected &&
													selected.length > 0 &&
													selected.indexOf(filter) >
														-1
												)
											}
											isCollapseable={
												filter !== 'delivery' &&
												filter !== 'reservation'
											}
											iconActive={
												filter === 'delivery'
													? require('../../images/icons/takeaway-icon-active.png')
													: filter === 'reservation'
													? require('../../images/icons/reservation-icon-active.png')
													: undefined
											}
											iconInactive={
												filter === 'delivery'
													? require('../../images/icons/takeaway-icon-inactive.png')
													: filter === 'reservation'
													? require('../../images/icons/reservation-icon-inactive.png')
													: undefined
											}
											content={this.getFilterContent(
												filter,
												appConfig.data.filters
											)}
										/>
									)
							  )
							: null}
					</View>

					<View style={{ alignItems: 'center' }}>
						<TouchableOpacity
							onPress={this.handleFilterSubmit.bind(this)}
							style={styles.filterSubmitBtn}>
							<Text
								style={[cs.textWhite, cs.textBold]}
								fontVisby={true}>
								GO
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#1d1d1c',
		flex: 1
	},
	filterContent: {
		padding: 15,
		paddingLeft: 40
	},
	filterSubmitBtn: {
		backgroundColor: '#F2910A',
		padding: 5,
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: 50,
		marginBottom: 50,
		borderRadius: 20
	}
});

function mapStateToProps(state) {
	return {
		userDetail: state.userDetail,
		appConfig: state.appConfig,
		appState: state.appState
	};
}

export default connect(
	mapStateToProps,
	{
		setAppStateData: setAppState
	}
)(FilterList);
