import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Modal,
	ScrollView,
	StyleSheet,
	View,
	TouchableOpacity,
	Image,
	Linking
} from 'react-native';
import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';
import { fetchRestaurantMenu } from '../../js/actions/actionCreators';
import Text from '../common/Text';
import LoadingIndicator from '../common/LoadingIndicator';
import cs from '../../styles/common-styles';

class RestaurantMenus extends Component {
	constructor(args) {
		super(args);
		this.state = {
			visible: false,
			content: {}
		};
	}
	
	componentDidMount() {
		const { fetchRestaurantMenuData, restaurantMenu } = this.props;
		const { restaurantId } = this.props;
		if (!restaurantMenu || restaurantMenu.restaurantId !== restaurantId) {
			fetchRestaurantMenuData(restaurantId);
		}
	}

	handleOpenModal() {
		const { openSortModal } = this.props;
		if (openSortModal) {
			openSortModal();
		}
	}

	handleOpenURL(url) {
		if (url) {
			Linking.canOpenURL(url)
				.then(supported => {
					if (supported) {
						Linking.openURL(url).catch(err =>
							alert('cannot open url')
						);
					} else {
						alert(url);
					}
				})
				.catch(err => {
					alert('cannot open url');
				});
		}
	}

	render() {
		const { restaurantMenu, restaurantData } = this.props;
		const { content, visible } = this.state;
		if (!restaurantMenu || restaurantMenu.isFetching) {
			return <LoadingIndicator />;
		}

		if(restaurantData.menulinksource) {
			return (
				<TouchableOpacity
					style={{ marginBottom: 20 }}
					onPress={this.handleOpenURL.bind(
						this,
						restaurantData.menulinksource
					)}>
					<View
						style={[
							{
								borderRadius: 20,
								padding: 10,
								backgroundColor: '#F2910A',
								borderColor: '#FFF',
								borderWidth: 3
							}
						]}>
						<Text
							style={[
								cs.textCenter,
								cs.textWhite,
								cs.textBold
							]}>
							{"Tap here to see the latest menu"}
						</Text>
					</View>
				</TouchableOpacity>
			);
		}

		if (restaurantData.menu && restaurantData.menu.length > 0) {
			return (
				<React.Fragment>
					<Modal
						animationType="slide"
						transparent={false}
						visible={visible}
						onRequestClose={() => {}}>
						<View
							style={{
								flex: 1,
								padding: 15,
								backgroundColor: '#1d1d1c'
							}}>
							<View style={styles.backNavContainer}>
								<TouchableOpacity
									onPress={() => {
										this.setState({
											visible: false,
											content: {}
										});
									}}>
									<Image
										style={{
											height: 18,
											resizeMode: 'contain',
											alignSelf: 'center',
											marginRight: 5,

											marginTop: 40
										}}
										source={require('../../images/icons/icon-close-white.png')}
									/>
								</TouchableOpacity>
							</View>
							<Text
								style={[
									cs.textCenter,
									cs.textBold,
									cs.font20,
									{
										color: '#fff',
										marginTop: 45,
										marginBottom: 20,
										marginLeft: 50,
										marginRight: 50
									}
								]}>
								{content.title}
							</Text>
							{content.type === 'pdf' ? (
								<Pdf
									source={{ uri: content.detail }}
									style={{ flex: 1 }}
								/>
							) : (
								<WebView
									originWhitelist={['*']}
									automaticallyAdjustContentInsets={false}
									source={{
										html: `<html><body style="margin:0;padding:0;"><img src="${
											content.detail
										}" /></body></html>`
									}}
									javaScriptEnabled={true}
									domStorageEnabled={true}
									startInLoadingState={true}
								/>
							)}
						</View>
					</Modal>
					{restaurantData.menu.map((men, index) => {
						return (
							<TouchableOpacity
								style={{ marginBottom: 20 }}
								key={`menu-${index}`}
								onPress={() =>
									this.setState({
										visible: true,
										content: {
											title: men.title,
											detail: men.detail,
											type: men.type
										}
									})
								}>
								<View
									style={[
										{
											borderRadius: 20,
											padding: 10,
											backgroundColor: '#F2910A',
											borderColor: '#FFF',
											borderWidth: 3
										}
									]}>
									<Text
										style={[
											cs.textCenter,
											cs.textWhite,
											cs.textBold
										]}>
										{men.title}
									</Text>
								</View>
							</TouchableOpacity>
						);
					})}
				</React.Fragment>
			);
		} else if (Object.keys(restaurantMenu.data).length === 0) {
			return (
				<Text style={[cs.paddingTB30, cs.textCenter, cs.textOrange]}>
					No menu found!
				</Text>
			);
		}

		return (
			<View style={styles.container}>
				<ScrollView style={{}}>
					<View style={[]}>
						{restaurantMenu.data ? (
							<View style={{ paddingLeft: 10, paddingRight: 10 }}>
								{Object.keys(restaurantMenu.data).map(
									(category, idx) => (
										<View key={idx}>
											<Text
												style={[
													cs.font14,
													cs.textBold,
													cs.marginB10
												]}>
												{category}
											</Text>
											<View style={{ marginBottom: 20 }}>
												{restaurantMenu.data[
													category
												].map((item, idx) => (
													<View
														style={{
															flexDirection:
																'row',
															marginBottom: 20
														}}
														key={idx}>
														<View
															style={{
																paddingLeft: 40,
																width: '80%'
															}}>
															<Text
																style={[
																	cs.font12,
																	{
																		marginBottom: 2
																	}
																]}>
																{item.dishName}
															</Text>
															<Text
																style={[
																	{
																		fontSize: 10
																	}
																]}>
																{
																	item.description
																}
															</Text>
															{item.isTopDish ? (
																<Image
																	style={
																		styles.topDishTag
																	}
																	source={require('../../images/icons/top-dish-tag.png')}
																/>
															) : null}
														</View>
														<View
															style={{
																flex: 1,
																alignItems:
																	'flex-end'
															}}>
															<Text
																style={
																	cs.font12
																}>
																&#163;
																{item.price}
															</Text>
														</View>
													</View>
												))}
											</View>
										</View>
									)
								)}
							</View>
						) : (
							<Text style={cs.textCenter}>No menu found</Text>
						)}
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#1d1d1c',
		paddingTop: 5
	},
	backNavContainer: {
		position: 'absolute',
		left: 0,
		top: 0,
		paddingRight: 5,
		borderRadius: 20,
		paddingLeft: 25,
		paddingTop: 25,
		zIndex: 100
	},
	ziraferImage: {
		width: 80,
		height: 80,
		resizeMode: 'cover',
		borderRadius: 45
	},
	reviewTextContainer: {
		width: '80%',
		paddingRight: 20,
		borderRightWidth: 2,
		borderColor: '#fff',
		paddingBottom: 5
	},
	rating: {
		width: '20%',
		alignSelf: 'center',
		paddingLeft: 15
	},
	topDishTag: {
		position: 'absolute',
		marginTop: 5,
		left: 5,
		height: 22,
		resizeMode: 'contain',
		alignSelf: 'center',
		marginRight: 5
	}
});

function mapStateToProps(state) {
	return {
		restaurantMenu: state.restaurantMenu
	};
}

export default connect(
	mapStateToProps,
	{
		fetchRestaurantMenuData: fetchRestaurantMenu
	}
)(RestaurantMenus);
