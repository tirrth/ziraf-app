import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Image,
	StyleSheet,
	Modal,
	Platform,
	KeyboardAvoidingView,
	SafeAreaView
} from 'react-native';
import Slider from '@react-native-community/slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Autocomplete from 'react-native-autocomplete-input';
import ImagePicker from 'react-native-image-picker';
import { fetchRestaurantAutoComplete } from '../../js/actions/actionCreators';
import { api, imageUpload } from '../../js/utils/index';
import Text from '../common/Text';
import LoadingIndicator from '../common/LoadingIndicator';
import cs from '../../styles/common-styles';
import Alert from '../common/Alert';

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
				values={values}
				unselectedStyle={{
					backgroundColor: '#737373'
				}}
				containerStyle={{
					height: 30
				}}
				selectedStyle={{
					backgroundColor: '#F2910A'
				}}
				markerStyle={{
					height: 10,
					width: 10,
					borderRadius: 5,
					backgroundColor: '#F2910A',
					borderColor: '#F2910A'
				}}
			/>
		);
	}
}

class ReviewForm extends Component {
	constructor(args) {
		super(args);
		this.state = {
			dishImageSource: null,
			restaurantQuery: '',
			reviewText: '',
			ratings: {
				food: 5,
				service: 5,
				price: 5,
				ambiance: 5
			},
			topDishes: [
				{
					name: '',
					price: '',
					imageId: '',
					dishImage: {
						source: null
					}
				}
			],
			selectedRestaurant: null,
			successModalVisible: false,
			errors: {
				restaurant: '',
				reviewText: '',
				topDishPrice: ''
			},
			restaurantList: [],
			showRestaurantOptions: false,

			alertSuccess: false,
			alertTitle: 'Hi',
			alertDetail: '',
			alertButton: 'GOT IT',
			alertOnClose: () => {}
		};
	}

	selectPhotoTapped(idx) {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true
			}
		};

		ImagePicker.showImagePicker(options, response => {
			if (response.didCancel) {
				//console.log('User cancelled photo picker');
			} else if (response.error) {
				//console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				//console.log(
				// 	'User tapped custom button: ',
				// 	response.customButton
				// );
			} else {
				let { topDishes } = this.state;
				topDishes[idx].dishImage['isUploading'] = true;
				this.setState({
					topDishes
				});

				let formData = new FormData();
				formData.append('file', {
					name: response.fileName,
					type: response.type,
					uri:
						Platform.OS === 'android'
							? response.uri
							: response.uri.replace('file://', '')
				});

				imageUpload(
					'/api/v1/medias/upload/image/review',
					formData
				).then(resp => {
					let { topDishes } = this.state;
					if (resp && resp.success && resp.data) {
						topDishes[idx].dishImage['isUploading'] = false;
						topDishes[idx]['imageId'] = resp.data[0]['_id'];
						topDishes[idx].dishImage = {
							source: { uri: response.uri }
						};
					} else {
						topDishes[idx].dishImage['isUploading'] = false;
					}
					this.setState({
						topDishes
					});
				});
			}
		});
	}

	sliderValuesChange(name, values) {
		const { ratings } = this.state;
		ratings[name] = values;
		this.setState({
			ratings
		});
	}

	handleDishNameChange(idx, value) {
		let { topDishes } = this.state;
		topDishes[idx].name = value;
		this.setState({
			topDishes
		});
	}

	handleDishPriceChange(idx, value) {
		let { topDishes } = this.state;
		topDishes[idx].price = value;
		this.setState({
			topDishes
		});
	}

	handleAddTopDishes() {
		const { topDishes } = this.state;
		topDishes.push({
			name: '',
			price: '',
			imageId: '',
			dishImage: {
				source: null
			}
		});
		this.setState({ topDishes });
	}

	getFilterData(query) {
		const { fetchRestaurantAutoCompleteData } = this.props;
		fetchRestaurantAutoCompleteData(query).then(resp => {
			let data = [];
			if (resp && resp.data) {
				data = resp.data;
			}
			this.setState(
				{
					restaurantList: query !== '' ? data : []
				},
				() => this.showRestaurantOptions()
			);
		});
	}

	handleReveiwSubmit() {
		const { userDetail } = this.props;
		const {
			restaurantQuery,
			reviewText,
			ratings,
			topDishes,
			selectedRestaurant
		} = this.state;

		let { errors } = this.state;
		let hasError = false;

		if (!restaurantQuery) {
			hasError = true;
			errors['restaurant'] = 'Restaurant is required.';
		}
		if (!reviewText) {
			hasError = true;
			errors['reviewText'] = 'Review is required.';
		}

		topDishes.forEach(dish => {
			if (!dish.price) {
				hasError = true;
				errors['topDishPrice'] = 'One or more top dish does not contain an estimate price';
			}
		});

		if (hasError) {
			this.setState({
				errors: errors
			});
			return;
		}

		// let ratingsData = {};
		// Object.keys(ratings).forEach(key => {
		// 	ratingsData[key] = ratings[key].join();
		// });

		let topDishesData = [];
		topDishes.forEach(dish => {
			if (dish.imageId) {
				topDishesData.push({
					name: dish.name,
					price: parseFloat(dish.price),
					image: dish.imageId
				});
			}
		});

		let data = {
			review: reviewText,
			ratings,
			topDishes: topDishesData,
			ziraferId: userDetail.zirafer._id
		};

		if (selectedRestaurant) {
			data['restaurantId'] = selectedRestaurant.id;
		} else {
			data['restaurantName'] = restaurantQuery;
		}

		api.post('/api/v1/reviews', data).then(resp => {
			if (resp && resp.success) {
				this.setSuccessModalVisible(true);
				// this.setState({
				// 	isSubmitting: false,
				// 	alertSuccess: true,
				// 	alertTitle: `Thank You`,
				// 	alertDetail: 'Review added successfully!',
				// 	alertOnClose: () => {
				// 		this.setState(
				// 			{
				// 				alertSuccess: false
				// 			},
				// 			() => {
				// 				const { setModalVisible } = this.props;
				// 				setModalVisible(false);
				// 			}
				// 		);
				// 	}
				// });
			} else {
				this.setState({
					isSubmitting: false,
					alertSuccess: true,
					alertTitle: `Error`,
					alertDetail:
						'Something went wrong. Please try again later.',
					alertOnClose: () => {
						this.setState({
							alertSuccess: false
						});
					}
				});
				// alert('Something went wrong. Please try again later.');
			}
		});
	}

	handleClearImage(idx) {
		let { topDishes } = this.state;
		topDishes[idx].dishImage['isUploading'] = false;
		topDishes[idx]['imageId'] = '';
		topDishes[idx].dishImage = {
			source: null
		};
		this.setState({
			topDishes
		});
	}

	setSuccessModalVisible(visible) {
		this.setState(
			{
				successModalVisible: visible
			},
			() => {
				const { successModalVisible, setModalVisible } = this.state;
				if (!successModalVisible) {
					const { setModalVisible } = this.props;
					setModalVisible(false);
				}
			}
		);
	}

	showRestaurantOptions() {
		// this.refs.AutoCompleteDropdown.measure(
		// 	(x, y, width, height, pageX, pageY) => {
		// this.setState(
		// 	{
		// 		offsetX: pageX,
		// 		offsetY: pageY + height,
		// 		dWidth: width,
		// 		dHeight: height
		// 	},
		// 	() => {
		this.setState({
			showRestaurantOptions: true
		});
		// 			}
		// 		);
		// 	}
		// );
	}

	render() {
		const { setModalVisible, restaurantAutocomplete } = this.props;
		const {
			restaurantQuery,
			reviewText,
			errors,
			restaurantList,
			ratings,
			foodName,
			price,
			topDishes,
			showRestaurantOptions,

			alertButton,
			alertSuccess,
			alertTitle,
			alertDetail,
			alertOnClose
		} = this.state;

		let data = [];
		if (restaurantAutocomplete && restaurantAutocomplete.data) {
			data = restaurantAutocomplete.data;
		}

		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
				<KeyboardAvoidingView
					style={styles.container}
					keyboardVerticalOffset={10}
					behavior={Platform.OS === 'android' ? null : 'padding'}
					enabled>
					<ScrollView>
						<View style={styles.backNavContainer}>
							<TouchableOpacity
								onPress={() => {
									setModalVisible(false);
								}}>
								<Image
									style={{
										height: 16,
										resizeMode: 'contain',
										alignSelf: 'center',
										marginRight: 5
									}}
									source={require('../../images/icons/ChevronLeftGrey.png')}
								/>
							</TouchableOpacity>
						</View>

						<View
							style={{
								paddingLeft: 20,
								paddingRight: 20,
								paddingTop: 15
							}}>
							<Text
								style={[
									cs.textOrange,
									cs.textCenter,
									cs.font20,
									cs.textBold
								]}
								fontVisby={true}>
								Restaurant Name
							</Text>
							<View style={[cs.paddingT15]}>
								<TouchableOpacity
									ref="AutoCompleteDropdown"
									style={styles.autocompleteSelect}>
									<TextInput
										style={styles.textInput}
										placeholderTextColor={'#737373'}
										keyboardType="default"
										placeholder="Select restaurant"
										onChangeText={text => {
											let { errors } = this.state;
											errors['restaurant'] = '';
											this.getFilterData(text);
											this.setState({
												restaurantQuery: text,
												selectedRestaurant: null,
												errors
											});
										}}
										value={restaurantQuery}
									/>
								</TouchableOpacity>
								{errors.restaurant ? (
									<Text
										style={[
											cs.errorText,
											cs.textCenter,
											{ marginLeft: 0 }
										]}>
										{`*${errors.restaurant}`}
									</Text>
								) : (
									<Text>&nbsp;</Text>
								)}

								{/* <Modal
								animationType="none"
								transparent={true}
								visible={}
								onRequestClose={() => {}}> */}
								{showRestaurantOptions && (
									<View
										style={{
											width: '100%',
											left: 0,
											right: 0,
											zIndex: 100
										}}>
										<View
											style={[
												styles.optionContainer,
												{
													width: '100%'
												}
											]}>
											<ScrollView>
												{restaurantList.map(
													(option, idx) => (
														<TouchableOpacity
															key={idx}
															style={[
																styles.option
															]}
															onPress={() => {
																let {
																	errors
																} = this.state;
																errors[
																	'restaurant'
																] = '';
																this.setState(
																	{
																		restaurantQuery:
																			option.title,
																		selectedRestaurant: option,
																		errors
																	},
																	() => {
																		this.setState(
																			{
																				restaurantList: [],
																				showRestaurantOptions: false
																			}
																		);
																	}
																);
															}}>
															<Text
																style={[
																	cs.textCenter,
																	cs.textWhite,
																	cs.textBold
																]}>
																{option.title}
															</Text>
														</TouchableOpacity>
													)
												)}
											</ScrollView>
										</View>
									</View>
								)}
								{/* </Modal> */}
							</View>
						</View>

						<View style={{ paddingLeft: 20, paddingRight: 20 }}>
							<View style={styles.sectionContainer}>
								<View style={styles.sectionTitleContainer}>
									<Text
										style={[
											cs.textOrange,
											cs.font14,
											cs.textBold
										]}
										fontVisby={true}>
										Write your review here
									</Text>
								</View>
								<View>
									<TextInput
										onChangeText={text => {
											let { errors } = this.state;
											errors['reviewText'] = '';
											this.setState({
												reviewText: text,
												errors
											});
										}}
										style={styles.reviewInput}
										placeholder="Type here..."
										multiline={true}
										value={reviewText}
									/>
									{errors.reviewText ? (
										<Text style={[cs.errorText]}>
											{`*${errors.reviewText}`}
										</Text>
									) : (
										<Text>&nbsp;</Text>
									)}
								</View>
							</View>

							<View style={styles.sectionContainer}>
								<View style={styles.sectionTitleContainer}>
									<Text
										style={[
											cs.textOrange,
											cs.font14,
											cs.textBold
										]}
										fontVisby={true}>
										Ratings
									</Text>
								</View>
								<View>
									<View style={styles.ratingContainer}>
										<Text
											style={[
												cs.textBold,
												{
													color: '#737373',
													width: '30%'
												}
											]}>
											Food
										</Text>
										<View style={{ width: '55%' }}>
											<Slider
												step={1}
												value={ratings.food}
												minimumValue={0}
												maximumValue={10}
												minimumTrackTintColor="#F2910A"
												thumbTintColor="#F2910A"
												onSlidingComplete={this.sliderValuesChange.bind(
													this,
													'food'
												)}
											/>
										</View>
										<Text
											style={[
												cs.textBold,
												cs.textOrange,
												{
													width: '15%',
													paddingLeft: 15
												}
											]}>{`${ratings.food}`}</Text>
									</View>

									<View style={styles.ratingContainer}>
										<Text
											style={[
												cs.textBold,
												{
													color: '#737373',
													width: '30%'
												}
											]}>
											Service
										</Text>
										<View style={{ width: '55%' }}>
											<Slider
												step={1}
												value={ratings.service}
												minimumValue={0}
												maximumValue={10}
												minimumTrackTintColor="#F2910A"
												thumbTintColor="#F2910A"
												onSlidingComplete={this.sliderValuesChange.bind(
													this,
													'service'
												)}
											/>
										</View>
										<Text
											style={[
												cs.textBold,
												cs.textOrange,
												{
													width: '15%',
													paddingLeft: 15
												}
											]}>{`${ratings.service}`}</Text>
									</View>

									<View style={styles.ratingContainer}>
										<Text
											style={[
												cs.textBold,
												{
													color: '#737373',
													width: '30%'
												}
											]}>
											Price
										</Text>
										<View style={{ width: '55%' }}>
											<Slider
												step={1}
												value={ratings.price}
												minimumValue={0}
												maximumValue={10}
												minimumTrackTintColor="#F2910A"
												thumbTintColor="#F2910A"
												onSlidingComplete={this.sliderValuesChange.bind(
													this,
													'price'
												)}
											/>
										</View>
										<Text
											style={[
												cs.textBold,
												cs.textOrange,
												{
													width: '15%',
													paddingLeft: 15
												}
											]}>{`${ratings.price}`}</Text>
									</View>

									<View style={styles.ratingContainer}>
										<Text
											style={[
												cs.textBold,
												{
													color: '#737373',
													width: '30%'
												}
											]}>
											Ambiance
										</Text>
										<View style={{ width: '55%' }}>
											<Slider
												step={1}
												value={ratings.ambiance}
												minimumValue={0}
												maximumValue={10}
												minimumTrackTintColor="#F2910A"
												thumbTintColor="#F2910A"
												onSlidingComplete={this.sliderValuesChange.bind(
													this,
													'ambiance'
												)}
											/>
										</View>
										<Text
											style={[
												cs.textBold,
												cs.textOrange,
												{
													width: '15%',
													paddingLeft: 15
												}
											]}>{`${ratings.ambiance}`}</Text>
									</View>
								</View>
							</View>

							<View style={styles.sectionContainer}>
								<View style={styles.sectionTitleContainer}>
									<Text
										style={[
											cs.textOrange,
											cs.font14,
											cs.textBold
										]}
										fontVisby={true}>
										Top Dishes
									</Text>
									{errors.topDishPrice ? (
												<Text style={[cs.errorText]}>
													{`*${errors.topDishPrice}`}
												</Text>
											) : (
												<Text>&nbsp;</Text>
											)}
								</View>
								<View>
									{topDishes.map((dish, idx) => (
										<View key={idx}>
											<View
												style={{
													flexDirection: 'row',
													alignItems: 'center',
													marginTop: 15
												}}>
												<View
													style={{
														width: '60%',
														flexDirection: 'row',
														alignItems: 'center'
													}}>
													<Text
														style={[
															cs.font14,
															{
																color:
																	'#737373',
																width: '40%'
															}
														]}>
														Food name:
													</Text>
													<View
														style={{
															width: '60%',
															paddingRight: 20
														}}>
														<TextInput
															onChangeText={text =>
																this.handleDishNameChange(
																	idx,
																	text
																)
															}
															style={
																styles.inputSecondary
															}
															placeholder="Type here..."
															value={dish.name}
														/>
													</View>
												</View>

												<View
													style={{
														width: '40%',
														flexDirection: 'row',
														alignItems: 'center'
													}}>
													<Text
														style={[
															cs.font14,
															{
																color:
																	'#737373',
																width: '30%'
															}
														]}>
														Price:
													</Text>
													<View
														style={{
															width: '70%'
														}}>
														<TextInput
															onChangeText={text => {
																let { errors } = this.state;
																errors['topDishPrice'] = '';
																this.setState({
																	errors
																});
																this.handleDishPriceChange(
																	idx,
																	text
																);
															}}
															style={
																styles.inputSecondary
															}
															placeholder="Estimate"
															value={price}
														/>
													</View>
												</View>
											</View>

											<View
												style={{
													alignItems: 'center'
												}}>
												{dish.dishImage.source ===
												null ? (
													<View
														style={{
															alignItems: 'center'
														}}>
														{dish.dishImage
															.isUploading !==
														true ? (
															<TouchableOpacity
																onPress={() =>
																	this.selectPhotoTapped(
																		idx
																	)
																}>
																<View
																	style={{
																		flexDirection:
																			'row',
																		paddingBottom: 8,
																		borderBottomWidth: 1,
																		borderColor:
																			'#F2910A',
																		paddingRight: 6,
																		marginTop: 15
																	}}>
																	<Image
																		style={{
																			height: 16,
																			resizeMode:
																				'contain',
																			alignSelf:
																				'center'
																		}}
																		source={require('../../images/icons/upload-icon.png')}
																	/>
																	<Text
																		style={[
																			cs.textOrange
																		]}>
																		Upload
																		photo
																	</Text>
																</View>
															</TouchableOpacity>
														) : (
															<Text
																style={[
																	cs.textOrange,
																	cs.textCenter,
																	cs.textBold,
																	cs.marginT10
																]}>
																uploading..
															</Text>
														)}
													</View>
												) : (
													<View
														style={[
															styles.dishImage,
															styles.dishImageContainer,
															cs.marginTB15
														]}>
														<Image
															style={
																styles.dishImage
															}
															source={
																dish.dishImage
																	.source
															}
														/>
														<TouchableOpacity
															onPress={() =>
																this.handleClearImage(
																	idx
																)
															}
															style={{
																position:
																	'absolute',
																top: 3,
																right: 3
															}}>
															<Image
																style={
																	styles.closeImage
																}
																source={require('../../images/icons/icon-close-orange.png')}
															/>
														</TouchableOpacity>
													</View>
												)}
											</View>
										</View>
									))}
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											marginTop: 30
										}}>
										<TouchableOpacity
											onPress={this.handleAddTopDishes.bind(
												this
											)}
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center'
											}}>
											<Image
												style={{
													height: 16,
													resizeMode: 'contain',
													alignSelf: 'center',
													marginRight: 5
												}}
												source={require('../../images/icons/CircleAdd.png')}
											/>
											<Text
												style={[
													cs.textBold,
													cs.textOrange,
													{ paddingBottom: 3 }
												]}
												fontVisby={true}>
												add new
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</View>

						<View
							style={{ alignItems: 'center', paddingBottom: 80 }}>
							<TouchableOpacity
								onPress={() => this.handleReveiwSubmit()}
								style={styles.submitBtn}>
								<Text
									style={[
										cs.textWhite,
										cs.textBold,
										cs.font18
									]}
									fontVisby={true}>
									SUBMIT
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>

					<Alert
						title={alertTitle}
						detail={alertDetail}
						button={alertButton ? alertButton : 'GOT IT'}
						visible={alertSuccess}
						onClose={alertOnClose}
					/>

					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.successModalVisible}
						onRequestClose={() => {}}>
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
								padding: 15,
								backgroundColor: 'rgba(0,0,0,0.6)'
							}}>
							<View style={styles.modal}>
								{/* <TouchableOpacity style={{position: 'absolute', right: 10, top: 10}} onPress={() => {
                                    this.setSuccessModalVisible(false);
                                }}>
                                <Image style={styles.closeImage} 
                                    source={require('../../images/icons/icon-close-white.png')} />
                            </TouchableOpacity> */}

								<Text
									style={{
										textAlign: 'center',
										fontWeight: 'bold',
										fontSize: 30,
										marginBottom: 10
									}}
									fontVisby={true}>
									Thank you!
								</Text>
								<Text
									style={{
										textAlign: 'center',
										fontSize: 14
									}}>
									Review added successfully. Your review will
									be moderated first before it is published on
									the app.
								</Text>

								<TouchableOpacity
									style={{
										width: 80,
										borderWidth: 2,
										borderColor: '#fff',
										alignSelf: 'center',
										marginTop: 25,
										marginBottom: 5,
										borderRadius: 20,
										padding: 5
									}}
									onPress={() => {
										this.setSuccessModalVisible(false);
									}}>
									<Text
										style={[
											cs.textBold,
											cs.textWhite,
											cs.font18,
											cs.textCenter
										]}>
										OK
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1,
		marginLeft: 15,
		marginRight: 15
	},
	submitBtn: {
		backgroundColor: '#F2910A',
		padding: 5,
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: 50,
		marginBottom: 50,
		borderRadius: 20
	},
	autocompleteContainerStyle: {
		marginBottom: 25
	},
	listContainerStyle: {},
	listStyle: {
		padding: 5,
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: '#fff',
		zIndex: 100
	},
	separator: {
		height: 1,
		width: '40%',
		alignSelf: 'center',
		backgroundColor: '#F2910A'
	},
	sectionContainer: {
		paddingTop: 30
	},
	sectionTitleContainer: {
		marginBottom: 15
	},
	reviewInput: {
		borderWidth: 1,
		borderRadius: 20,
		borderColor: '#1D1D1C',
		height: 160,
		padding: 20,
		paddingTop: 15,
		textAlignVertical: 'top'
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	backNavContainer: {
		alignItems: 'flex-start',
		paddingRight: 5,
		paddingLeft: 8,
		paddingTop: 8
	},
	submitBtn: {
		backgroundColor: '#F2910A',
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: 50,
		marginBottom: 50,
		borderRadius: 20
	},
	inputSecondary: {
		borderBottomWidth: 1,
		borderColor: '#707070',
		fontSize: 12,
		width: '100%',
		paddingTop: 3,
		paddingBottom: 3,
		color: '#000'
	},
	modal: {
		backgroundColor: '#F2910A',
		padding: 25,
		width: '100%',
		paddingTop: 25,
		paddingBottom: 25,
		borderRadius: 20
	},
	closeImage: {
		width: 12,
		height: 12,
		resizeMode: 'contain',
		alignSelf: 'flex-end'
	},
	dishImageContainer: {
		borderColor: '#9B9B9B',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	dishImage: {
		borderRadius: 5,
		width: 100,
		height: 100
	},
	autocompleteSelect: {
		height: 38,
		borderColor: '#1D1D1C',
		borderRadius: 20,
		borderWidth: 1,
		paddingLeft: 20,
		paddingRight: 20
	},
	textInput: {
		height: 38,
		padding: 8,
		paddingLeft: 0,
		paddingRight: 0,
		backgroundColor: 'transparent',
		color: '#000',
		fontFamily: 'Niramit',
		marginLeft: 5,
		marginRight: 5
	},
	optionContainer: {
		backgroundColor: '#F2910A',
		borderRadius: 8,
		marginTop: 5
	},
	option: {
		borderBottomWidth: 1,
		borderColor: '#fff',
		padding: 5
	}
});

function mapStateToProps(state) {
	return {
		restaurantAutocomplete: state.restaurantAutocomplete,
		userDetail: state.userDetail
	};
}

export default connect(
	mapStateToProps,
	{
		fetchRestaurantAutoCompleteData: fetchRestaurantAutoComplete
	}
)(ReviewForm);
