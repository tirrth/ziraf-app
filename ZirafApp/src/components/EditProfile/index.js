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
import Text from '../common/Text';
import { api, imageUpload, userProfileUpdate, getAllRestaurantsSimple } from '../../js/utils';
import ImagePicker from 'react-native-image-picker';
import LoadingIndicator from '../common/LoadingIndicator';
import ModalOptions from '../common/ModalOptions';
import cs from '../../styles/common-styles';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
	fetchUserDetail,
	clearAppState
} from '../../js/actions/actionCreators';
import Alert from '../common/Alert';

const GENDER_OPTIONS = [
	{
		name: 'Male',
		value: 'male'
	},
	{
		name: 'Female',
		value: 'female'
	}
];

const GENDER_CAPITALIZE = {
	male: 'Male',
	female: 'Female'
};
const EMAIL_FILTER = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//const USER_NAME_FILTER = /^([a-zA-Z0-9]{8,15})+$/;
const USER_NAME_FILTER = /^([a-zA-Z0-9_.)(/\\&-\@^#+=!]{5,100})+$/;

class EditProfile extends Component {
	constructor(args) {
		super(args);
		this.state = {
			form: {},
			errors: {},
			profileImage: { isUploading: false },
			userDetail: args.userDetail ? args.userDetail : {},
			address: args.userDetail ? args.userDetail.address : null,
			location: args.userDetail ? args.userDetail.location : {},
			showGenderOptions: false,

			isValidUserName: true,
			isSubmitting: false,

			restaurantList: [],

			optionsModalVisible: false,
			modalOptionsTitle: '',
			modalOptionsData: [],
			modalOptionsSelected: null,
			restaurantSelected: [],
			restaurantSelectedLabel: [],
			specialitySelected: [],
			specialitySelectedLabel: [],
			modalOptionMultiple: false,

			alertSuccess: false,
			alertTitle: 'Hi',
			alertDetail: '',
			alertButton: 'GOT IT',
			alertOnClose: () => {}
		};

		this.scrollView = React.createRef();
	}

	componentDidMount() {
		const { restaurantList, userDetail, profileImage } = this.state;		

		if (userDetail) {
			const form = { ...userDetail };
			const zirafer = {};
			if (userDetail.zirafer) {
				form['description'] = userDetail.zirafer.description;
				form['location'] = userDetail.zirafer.location;
				form['address'] = userDetail.address;
				form['facebook'] =
					userDetail.zirafer.social &&
					userDetail.zirafer.social.facebook;
				form['instagram'] =
					userDetail.zirafer.social &&
					userDetail.zirafer.social.instagram;
				form['youtube'] =
					userDetail.zirafer.social &&
					userDetail.zirafer.social.youtube;
				form['website'] =
					userDetail.zirafer.social &&
					userDetail.zirafer.social.website;
				if (userDetail.zirafer.favouriteRestaurant) {
					zirafer['restaurantSelected'] = [
						userDetail.zirafer.favouriteRestaurant._id
					];

					zirafer['restaurantSelectedLabel'] = [
						userDetail.zirafer.favouriteRestaurant.name
					];
				}

				zirafer[
					'specialitySelected'
				] = userDetail.zirafer.specialities.map(
					speciality => speciality._id
				);

				zirafer[
					'specialitySelectedLabel'
				] = userDetail.zirafer.specialities.map(
					speciality => speciality.title
				);

				if (userDetail.zirafer && userDetail.zirafer.image) {
					profileImage['source'] = userDetail.zirafer.image.path;
					profileImage['imageId'] = userDetail.zirafer.image._id;
				}

				getAllRestaurantsSimple().then(resp => {
					if (resp.success) {
						let fullList = resp;
						this.setState({ restaurantList: fullList });
					}
				});
			}

			this.setState({ form, ...zirafer, profileImage }, () => {
				this.handleValidation('username');
			});
		}
	}

	componentDidUpdate(prevProps) {
		if (
			this.props.userDetail !== prevProps.userDetail &&
			this.props.userDetail !== null
		) {
			this.setState({ userDetail: this.props.userDetail });
		}
	}

	handleValueChange(key, value) {
		let { form, errors } = this.state;
		form[key] = value;
		errors[key] = '';
		this.setState({
			form: form
		});
	}

	toggleOptionsView() {
		this.refs.GenerDropdown.measure((x, y, width, height, pageX, pageY) => {
			this.setState(
				{
					offsetX: pageX,
					offsetY: pageY + height,
					dWidth: width,
					dHeight: height
				},
				() => {
					this.setState({
						showGenderOptions: !this.state.showGenderOptions
					});
				}
			);
		});
	}

	handleSubmit() {
		this.setState({
			isSubmitting: true
		});
		const { fetchUserDetailData } = this.props;
		const {
			form,
			specialitySelected,
			restaurantSelected,
			userDetail,
			profileImage,
			isValidUserName,
			address,
			location
		} = this.state;

		let { errors } = this.state;

		let hasError = false;

		let isZirafer = false;
		if (userDetail && userDetail.zirafer) {
			isZirafer = true;
		}

		if (!form.firstName) {
			hasError = true;
			errors['firstName'] = 'First Name is required';
		}

		if (!form.lastName) {
			hasError = true;
			errors['lastName'] = 'Last Name is required';
		}

		if (!form.username) {
			hasError = true;
			errors['username'] = 'UserName is required';
		} else if (!USER_NAME_FILTER.test(form.username)) {
			hasError = true;
			errors['username'] =
				'UserName must be of minimum 5 characters';
		}

		if (!form.gender) {
			hasError = true;
			errors['gender'] = 'required';
		}

		// if (!form.phone) {
		// 	hasError = true;
		// 	errors['phone'] = 'Phone Number is required';
		// }

		if (!isValidUserName) {
			hasError = true;
		}

		//FIX THIS BY REMOVING LOCATION. NO LONGER NEEDED
		if (!address) {// || !location) {
			hasError = true;
			errors['address'] = 'Please enter your address';
		}

		if (hasError) {
			this.setState({
				isSubmitting: false,
				errors: errors
			});
			return;
		}

		let data = {
			firstName: form.firstName,
			lastName: form.lastName,
			username: form.username,
			gender: form.gender,
			phone: form.phone,
			address,
			location,
			isZirafer
		};

		if (isZirafer) {
			data['isZirafer'] = true;
			data['ziraferId'] = userDetail.zirafer._id;
			data['description'] = form.description;
			data['specialities'] = specialitySelected;
			if (profileImage['imageId']) {
				data['image'] = profileImage['imageId'];
			}

			if (restaurantSelected && restaurantSelected.length > 0) {
				data['favouriteRestaurant'] = restaurantSelected[0];
			}

			data['social'] = {};

			if (form.facebook) {
				data['social']['facebook'] = form.facebook;
			}

			if (form.instagram) {
				data['social']['instagram'] = form.instagram;
			}

			if (form.youtube) {
				data['social']['youtube'] = form.youtube;
			}

			if (form.website) {
				if(!form.website.includes('http://') || !form.website.includes('https://')){
					form.website = 'http://' + form.website;
				}
				data['social']['website'] = form.website;
			}
		}

		userProfileUpdate(data)
			.then(resp => {
				if (resp.success) {
					const { navigation } = this.props;
					fetchUserDetailData()
						.then(res => {
							//console.log(res);
							this.scrollView.current.scrollTo({
								x: 0,
								y: 0,
								animated: true
							});
							this.setState({
								isSubmitting: false,
								alertSuccess: true,
								alertTitle: `Success`,
								alertDetail:
									'Your profile has been successfully updated',
								alertOnClose: () => {
									this.setState(
										{
											alertSuccess: false
										},
										() => {
											navigation.goBack();
										}
									);
								}
							});
						})
						.catch(err => {
							this.setState({
								isSubmitting: false,
								alertSuccess: true,
								alertTitle: `Warning`,
								alertDetail:
									'Your profile has been successfully updated but there were a problem fetching the latest user data',
								alertOnClose: () => {
									this.setState(
										{
											alertSuccess: false
										},
										() => {
											navigation.goBack();
										}
									);
								}
							});
						});
				} else {
					if (resp.message) {
						this.setState({
							isSubmitting: false,
							alertSuccess: true,
							alertTitle: `Error`,
							alertDetail: resp.message,
							alertOnClose: () => {
								this.setState({
									alertSuccess: false
								});
							}
						});
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
					}
				}
			})
			.catch(err => {
				this.setState({
					isSubmitting: false,
					alertSuccess: true,
					alertTitle: `Error`,
					alertDetail:
						'Something went wrong when updating your profile. Please try again later.',
					alertOnClose: () => {
						this.setState({
							alertSuccess: false
						});
					}
				});
			});
	}

	handleGoBack() {
		const { navigation } = this.props;
		navigation.goBack();
	}

	selectPhotoTapped() {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true
			}
		};

		ImagePicker.showImagePicker(options, response => {
			//console.log('Response = ', response);

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
				let { profileImage } = this.state;
				profileImage['isUploading'] = true;
				this.setState({
					profileImage
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

				imageUpload('/api/v1/medias/upload/image/zirafer', formData)
					.then(resp => {
						let { profileImage } = this.state;
						if (resp && resp.success && resp.data) {
							profileImage['isUploading'] = false;
							profileImage['imageId'] = resp.data[0]['_id'];
							profileImage['source'] = response.uri;
						} else {
							profileImage['isUploading'] = false;
						}
						this.setState({
							profileImage
						});
					})
					.catch(err => {
						let { profileImage } = this.state;
						profileImage['isUploading'] = false;
						this.setState({
							profileImage,
							alertSuccess: true,
							alertTitle: `Error`,
							alertDetail:
								'There was an error while uploading your profile photo. Please try again later.',
							alertOnClose: () => {
								this.setState({
									alertSuccess: false
								});
							}
						});
					});
			}
		});
	}

	setValue(values, labels) {
		const { modalOptionValues, modalOptionStateLabels } = this.state;
		const state = {};
		state[modalOptionValues] = values;
		state[modalOptionStateLabels] = labels;

		this.setState({ ...state, optionsModalVisible: false });
	}

	openModalOption(options) {
		const { restaurantList } = this.state;
		if(restaurantList.data){
			const state = { ...options, optionsModalVisible: true };
			this.setState(state);
		}		
	}

	handleValidation(type) {
		const { form } = this.state;
		let { errors } = this.state;
		let path = '/api/v1/users/verify/email/profile';
		let hasError = false;
		let data = {};

		if (type === 'email') {
			if (!form.email) {
				hasError = true;
				errors['email'] = 'Please enter your email';
			} else if (!EMAIL_FILTER.test(form.email)) {
				hasError = true;
				errors['email'] = 'Please enter a valid email';
			}
			data.emailId = form.email;
		} else if (type === 'username') {
			path = '/api/v1/users/verify/username/profile';
			if (!form.username) {
				hasError = true;
				errors['username'] = 'UserName is required';
			} else if (!USER_NAME_FILTER.test(form.username)) {
				hasError = true;
				errors['username'] =
					'UserName can be alphanumeric and must be more than 5 characters';
			}
			data.userName = form.username;
		}

		if (hasError) {
			this.setState({
				errors: errors
			});
			return;
		}

		api.get(`${path}`, data)
			.then(resp => {
				if (resp.success) {
					if (type === 'email') {
						this.setState({
							isValidEmail: true
						});
					} else if (type === 'username') {
						this.setState({
							isValidUserName: true
						});
					}
				} else {
					if (resp.message) {
						if (type === 'email') {
							errors['email'] = resp.message;
						} else if (type === 'username') {
							errors['username'] = resp.message;
						}
						this.setState({
							errors,
							isValidEmail: false,
							isValidUserName: false
						});
					}
				}
			})
			.catch(err => {
				alert(JSON.stringify(err));
			});
	}

	setNewLocation(address, location) {
		const { errors } = this.state;
		errors['address'] = '';
		this.setState({
			address,
			location,
			errors
		});
	}

	handleMapDefault() {
		const { address } = this.state;
		if (address) {
			return address;
		} else {
			return '';
		}
	}

	render() {
		const {
			appConfig,

			navigation,
			appState
		} = this.props;
		const {
			alertButton,
			alertSuccess,
			alertTitle,
			alertDetail,
			alertOnClose,

			restaurantList,

			form,
			address,
			errors,
			userDetail,
			profileImage,
			showGenderOptions,
			optionsModalVisible,
			modalOptionsTitle,
			modalOptionsData,
			modalOptionsSelected,
			modalOptionLabelField,
			modalOptionValueField,
			modalOptionMultiple,
			restaurantSelected,
			restaurantSelectedLabel,

			specialitySelected,
			specialitySelectedLabel,

			isValidUserName,
			isSubmitting
		} = this.state;

		let isZirafer = false;
		if (userDetail && userDetail.zirafer) {
			isZirafer = true;
		}

		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#F2910A' }}>
				<View style={styles.container}>
					<KeyboardAvoidingView
						style={styles.container}
						behavior={Platform.OS === 'android' ? null : 'padding'}
						enabled>
						<ScrollView ref={this.scrollView}>
							<View>
								<View style={{}}>
									<View style={styles.backNavContainer}>
										<TouchableOpacity
											onPress={this.handleGoBack.bind(
												this
											)}>
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

									{isZirafer ? (
										profileImage && profileImage.source ? (
											<View>
												<View>
													<View
														style={{
															marginBottom: 20
														}}>
														<Image
															style={[
																styles.profileImage
															]}
															source={{
																uri:
																	profileImage.source
															}}
														/>
													</View>
													<Image
														source={require('../../images/bg/zirafer-border.png')}
														style={{
															width: '100%',
															resizeMode:
																'stretch',
															height: 100,
															position:
																'absolute',
															bottom: -25,
															zIndex: 100
														}}
													/>
												</View>
												<View
													style={[
														{
															alignItems: 'center'
														}
													]}>
													{profileImage.isUploading ? (
														<View
															style={[
																styles.profileButton,
																{
																	marginTop: 10,
																	marginBottom: 20
																}
															]}
															onPress={this.selectPhotoTapped.bind(
																this
															)}>
															<Text
																style={[
																	cs.textCenter,
																	cs.font15,
																	cs.textBold,
																	{
																		color:
																			'white'
																	}
																]}>
																Uploading...
															</Text>
														</View>
													) : (
														<TouchableOpacity
															style={[
																styles.profileButton,
																{
																	marginTop: 30,
																	marginBottom: 20
																}
															]}
															onPress={this.selectPhotoTapped.bind(
																this
															)}>
															<Text
																style={[
																	cs.textCenter,
																	cs.font15,
																	cs.textBold,
																	{
																		color:
																			'white'
																	}
																]}
																fontVisby={
																	true
																}>
																Change profile
																picture
															</Text>
														</TouchableOpacity>
													)}
												</View>
											</View>
										) : (
											<View
												style={[
													{
														alignItems: 'center'
													}
												]}>
												{profileImage.isUploading ? (
													<View
														style={[
															styles.profileButton,
															{
																marginTop: 10,
																marginBottom: 20
															}
														]}
														onPress={this.selectPhotoTapped.bind(
															this
														)}>
														<Text
															style={[
																cs.textCenter,
																cs.font15,
																cs.textBold,
																{
																	color:
																		'white'
																}
															]}>
															Uploading...
														</Text>
													</View>
												) : (
													<TouchableOpacity
														style={[
															styles.profileButton,
															{
																marginTop: 10,
																marginBottom: 20
															}
														]}
														onPress={this.selectPhotoTapped.bind(
															this
														)}>
														<Text
															style={[
																cs.textCenter,
																cs.font15,
																cs.textBold,
																{
																	color:
																		'white'
																}
															]}
															fontVisby={true}>
															Upload profile
															picture
														</Text>
													</TouchableOpacity>
												)}
											</View>
										)
									) : (
										<View style={{ alignSelf: 'center' }}>
											<Text
												style={[
													cs.textBold,
													cs.font28,

													{
														marginTop: 5,
														marginBottom: 5
													}
												]}
												fontVisby={true}>
												Edit Profile
											</Text>
										</View>
									)}
									<View style={{ padding: 15 }}>
										<View
											style={[
												styles.fieldContainer,
												{ flexDirection: 'row' }
											]}>
											<View style={{ width: '50%' }}>
												<Text
													style={[styles.inputLabel]}>
													First Name
												</Text>
												<TextInput
													style={styles.textInput}
													placeholderTextColor={
														'#FFFFFF'
													}
													keyboardType="default"
													placeholder="First"
													onChangeText={text =>
														this.handleValueChange(
															'firstName',
															text
														)
													}
													onSubmitEditing={() => {
														this.lastNameInput.focus();
													}}
													returnKeyType={'next'}
													value={form.firstName}
												/>
												{errors.firstName ? (
													<Text
														style={[
															styles.errorText
														]}>
														{`*${errors.firstName}`}
													</Text>
												) : (
													<Text>&nbsp;</Text>
												)}
											</View>
											<View style={{ width: '50%' }}>
												<Text
													style={[styles.inputLabel]}>
													Last Name
												</Text>
												<TextInput
													ref={input => {
														this.lastNameInput = input;
													}}
													style={styles.textInput}
													placeholderTextColor={
														'#FFFFFF'
													}
													keyboardType="default"
													placeholder="Last"
													onChangeText={text =>
														this.handleValueChange(
															'lastName',
															text
														)
													}
													onSubmitEditing={() => {
														this.usernameInput.focus();
													}}
													returnKeyType={'next'}
													value={form.lastName}
												/>
												{errors.lastName ? (
													<Text
														style={[
															styles.errorText
														]}>
														{`*${errors.lastName}`}
													</Text>
												) : (
													<Text>&nbsp;</Text>
												)}
											</View>
										</View>

										<View style={[styles.fieldContainer]}>
											<Text style={[styles.inputLabel]}>
												Address
											</Text>
											<TextInput
												ref={input => {
													this.addressInput = input;
												}}
												style={styles.textInput}
												placeholderTextColor={
													'#FFFFFF'
												}
												keyboardType="default"
												placeholder="Type address here..."
												onChangeText={text =>
													this.setState({
														address: text
													})
												}
												onSubmitEditing={() => {
													this.usernameInput.focus();
												}}
												returnKeyType={'next'}
												value={address} 
											/>
											{/* <GooglePlacesAutocomplete
												placeholderTextColor="#FFF"
												placeholder="Type address here..."
												minLength={2} // minimum length of text to search
												autoFocus={false}
												// returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
												keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
												listViewDisplayed={false} // true/false/undefined
												fetchDetails={true}
												renderDescription={row =>
													row.description
												} // custom description render
												onPress={(
													data,
													details = null
												) => {
													// 'details' is provided when fetchDetails = true

													if (
														details &&
														details.geometry
													) {
														const newLocation = {
															latitude:
																details.geometry
																	.location
																	.lat,
															longitude:
																details.geometry
																	.location
																	.lng
														};

														const address =
															details.formatted_address;

														this.setNewLocation(
															address,
															newLocation
														);
													}
												}}
												getDefaultValue={this.handleMapDefault.bind(
													this
												)}
												query={{
													// available options: https://developers.google.com/places/web-service/autocomplete
													key:
														'AIzaSyBqhPI_mfwexM54nxLF3N_zoEMo1JiL0vQ',
													language: 'en', // language of the results
													types: 'address' // default: 'geocode'
												}}
												styles={{
													textInputContainer: {
														backgroundColor:
															'#F2910A',
														alignSelf: 'center',
														borderBottomWidth: 1,
														borderBottomColor:
															'#FFF',
														borderTopWidth: 1,
														borderTopColor:
															'#F2910A',
														marginLeft: 10,
														marginRight: 10
													},
													textInput: {
														marginLeft: 0,
														marginRight: 0,
														color: '#fff',
														fontFamily: 'Niramit',
														backgroundColor:
															'#F2910A',
														borderRadius: 25,
														padding: 10,
														paddingLeft: 0,
														paddingRight: 20
													},

													description: {
														fontWeight: 'bold'
													},
													predefinedPlacesDescription: {
														color: '#1faadb',
														marginLeft: 5,
														marginRight: 5
													},
													listView: {
														backgroundColor: '#fff',
														borderRadius: 0,
														marginLeft: 10,
														marginRight: 10
													}
												}}
												currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
												currentLocationLabel="Current location"
												nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
												GoogleReverseGeocodingQuery={
													{
														// available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
													}
												}
												GooglePlacesSearchQuery={{
													// available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
													rankby: 'distance',
													type: 'cafe'
												}}
												GooglePlacesDetailsQuery={{
													// available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
													fields: 'formatted_address'
												}}
												filterReverseGeocodingByTypes={[
													'locality',
													'administrative_area_level_3'
												]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
												predefinedPlaces={[]}
												debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
												renderLeftButton={() => null}
												renderRightButton={() => null}
											/> */}
											{errors.address ? (
												<Text
													style={[styles.errorText]}>
													{`*${errors.address}`}
												</Text>
											) : (
												<Text>&nbsp;</Text>
											)}
										</View>

										<View style={[styles.fieldContainer]}>
											<Text style={[styles.inputLabel]}>
												Username (at least 5 characters)
											</Text>
											<TextInput
												ref={input => {
													this.usernameInput = input;
												}}
												style={styles.textInput}
												placeholderTextColor={'#FFFFFF'}
												keyboardType="default"
												placeholder="Username"
												onChangeText={text =>
													this.handleValueChange(
														'username',
														text
													)
												}
												onBlur={this.handleValidation.bind(
													this,
													'username'
												)}
												onSubmitEditing={() => {
													this.phoneInput.focus();
												}}
												returnKeyType={'next'}
												value={form.username}
											/>
											{isValidUserName ? (
												<View
													style={
														styles.verifiedContainer
													}>
													<Image
														source={require('../../images/icons/checkmark.png')}
														style={[
															{
																height: 12,
																resizeMode:
																	'contain',
																marginRight: 3
															}
														]}
													/>
													<Text
														style={[cs.textWhite]}>
														Verified
													</Text>
												</View>
											) : null}
											{errors.username ? (
												<Text
													style={[styles.errorText]}>
													{`*${errors.username}`}
												</Text>
											) : (
												<Text>&nbsp;</Text>
											)}
										</View>

										<View
											style={[
												styles.fieldContainer,
												{ flexDirection: 'row' }
											]}>
											<View style={{ width: '30%' }}>
												<Text
													style={[styles.inputLabel]}>
													Gender
												</Text>
												<TouchableOpacity
													ref="GenerDropdown"
													onPress={this.toggleOptionsView.bind(
														this
													)}
													style={styles.genderSelect}>
													{form.gender ? (
														<Text
														allowFontScaling={false}
															style={[
																cs.textBold,
																cs.textWhite
															]}>
															{
																GENDER_CAPITALIZE[
																	form.gender
																]
															}
														</Text>
													) : (
														<Text
															style={{
																color: '#FFFFFF'
															}}>
															Choose
														</Text>
													)}
												</TouchableOpacity>
												{errors.gender ? (
													<Text
														style={[
															styles.errorText
														]}>
														{`*${errors.gender}`}
													</Text>
												) : (
													<Text>&nbsp;</Text>
												)}

												<Modal
													animationType="none"
													transparent={true}
													visible={
														!showGenderOptions
															? false
															: true
													}
													onRequestClose={() => {}}>
													<TouchableOpacity
														style={{ flex: 1 }}
														onPress={() =>
															this.setState({
																showGenderOptions: false
															})
														}>
														<View
															style={[
																styles.optionContainer,
																{
																	top: this
																		.state
																		.offsetY,
																	left: this
																		.state
																		.offsetX,
																	width: this
																		.state
																		.dWidth
																}
															]}>
															<ScrollView>
																{GENDER_OPTIONS.map(
																	(
																		option,
																		idx
																	) => (
																		<TouchableOpacity
																			key={
																				idx
																			}
																			style={
																				styles.option
																			}
																			onPress={() => {
																				this.handleValueChange(
																					'gender',
																					option.value
																				);
																				this.setState(
																					{
																						showGenderOptions: false
																					}
																				);
																			}}>
																			<Text
																				style={[
																					cs.textCenter,
																					cs.textOrange
																				]}>
																				{
																					option.name
																				}
																			</Text>
																		</TouchableOpacity>
																	)
																)}
															</ScrollView>
														</View>
													</TouchableOpacity>
												</Modal>
											</View>
											<View style={{ width: '70%' }}>
												<Text
													style={[styles.inputLabel]}>
													Phone Number
												</Text>
												<TextInput
													ref={input => {
														this.phoneInput = input;
													}}
													style={styles.textInput}
													placeholderTextColor={
														'#FFFFFF'
													}
													keyboardType="default"
													placeholder="Phone Number"
													keyboardType={'phone-pad'}
													onChangeText={text =>
														this.handleValueChange(
															'phone',
															text
														)
													}
													onSubmitEditing={() => {
														this.bioInput.focus();
													}}
													returnKeyType={'next'}
													value={form.phone}
												/>
												{errors.phone ? (
													<Text
														style={[
															styles.errorText
														]}>
														{`*${errors.phone}`}
													</Text>
												) : (
													<Text>&nbsp;</Text>
												)}
											</View>
										</View>

										{isZirafer && (
											<React.Fragment>
												<View
													style={[
														styles.fieldContainer
													]}>
													<Text
														style={[
															styles.inputLabel
														]}>
														Bio
													</Text>
													<TextInput
														ref={input => {
															this.bioInput = input;
														}}
														style={styles.textInput}
														placeholderTextColor={
															'#FFFFFF'
														}
														keyboardType="default"
														placeholder="Bio"
														onChangeText={text =>
															this.handleValueChange(
																'description',
																text
															)
														}
														onSubmitEditing={() => {
															this.locationInput.focus();
														}}
														returnKeyType={'next'}
														value={form.description}
													/>
													{errors.description ? (
														<Text
															style={[
																styles.errorText
															]}>
															{`*${
																errors.description
															}`}
														</Text>
													) : (
														<Text>&nbsp;</Text>
													)}
												</View>
												{/* <View
												style={[styles.fieldContainer]}>
												<Text
													style={[styles.inputLabel]}>
													Location
												</Text>
												<TextInput
													ref={input => {
														this.locationInput = input;
													}}
													style={styles.textInput}
													placeholderTextColor={
														'#FFFFFF'
													}
													keyboardType="default"
													placeholder="Location"
													onChangeText={text =>
														this.handleValueChange(
															'location',
															text
														)
													}
													onSubmitEditing={() => {
														this.facebookInput.focus();
													}}
													returnKeyType={'next'}
													value={form.location}
												/>
												{errors.location ? (
													<Text
														style={[
															styles.errorText
														]}>
														{`*${errors.location}`}
													</Text>
												) : (
													<Text>&nbsp;</Text>
												)}
											</View> */}
												<TouchableOpacity
													style={
														styles.fieldContainer
													}
													onPress={this.openModalOption.bind(
														this,
														{
															modalOptionsTitle:
																'Favourite Restaurant',
															modalOptionsData:
																restaurantList.data,
															modalOptionsSelected: [
																restaurantSelected
															],
															modalOptionLabelField:
																'title',
															modalOptionValueField:
																'id',
															modalOptionValues:
																'restaurantSelected',
															modalOptionStateLabels:
																'restaurantSelectedLabel',
															modalOptionMultiple: false
														}
													)}>
													<Text
														style={[
															styles.inputLabel
														]}>
														Favourite Restaurant
													</Text>
													<View
														style={[
															styles.textOption
														]}>
														<Text
															style={[
																{
																	color:
																		'#FFFFFF',
																	color:
																		'#fff',
																	fontFamily:
																		'Niramit',
																	fontWeight:
																		'bold'
																}
															]}>
															{restaurantSelectedLabel.join(
																','
															)}
														</Text>
													</View>
													{errors.email ? (
														<Text
															style={[
																styles.errorText
															]}>
															{`*${errors.email}`}
														</Text>
													) : (
														<Text>&nbsp;</Text>
													)}
												</TouchableOpacity>

												<TouchableOpacity
													style={
														styles.fieldContainer
													}
													onPress={this.openModalOption.bind(
														this,
														{
															modalOptionsTitle:
																'Speciality',
															modalOptionsData:
																appConfig.data
																	.filters
																	.cuisines,
															modalOptionsSelected: specialitySelected,
															modalOptionLabelField:
																'name',
															modalOptionValueField:
																'id',
															modalOptionValues:
																'specialitySelected',
															modalOptionStateLabels:
																'specialitySelectedLabel',
															modalOptionMultiple: true
														}
													)}>
													<Text
														style={[
															styles.inputLabel
														]}>
														Speciality
													</Text>
													<View
														style={[
															styles.textOption,
															{
																flexDirection:
																	'row',
																flexWrap: 'wrap'
															}
														]}>
														{specialitySelectedLabel.map(
															special => (
																<Text
																	style={[
																		{
																			color:
																				'#FFFFFF',
																			color:
																				'#fff',
																			fontFamily:
																				'Niramit',
																			fontWeight:
																				'bold',
																			marginRight: 10,
																			marginBottom: 5
																		}
																	]}>
																	{special}
																</Text>
															)
														)}
													</View>
													{errors.speciality ? (
														<Text
															style={[
																styles.errorText
															]}>
															{`*${
																errors.speciality
															}`}
														</Text>
													) : (
														<Text>&nbsp;</Text>
													)}
												</TouchableOpacity>

												<Text
													style={styles.sectionTitle}>
													Social Media
												</Text>

												<View
													style={[
														styles.fieldContainer
													]}>
													<Text
														style={[
															styles.inputLabel
														]}>
														Facebook
													</Text>
													<TextInput
														ref={input => {
															this.facebookInput = input;
														}}
														style={styles.textInput}
														placeholderTextColor={
															'#FFFFFF'
														}
														keyboardType="default"
														placeholder="Facebook URL"
														onChangeText={text =>
															this.handleValueChange(
																'facebook',
																text
															)
														}
														onSubmitEditing={() => {
															this.instagramInput.focus();
														}}
														returnKeyType={'next'}
														value={form.facebook}
													/>
													{errors.facebook ? (
														<Text
															style={[
																styles.errorText
															]}>
															{`*${
																errors.facebook
															}`}
														</Text>
													) : (
														<Text>&nbsp;</Text>
													)}
												</View>

												<View
													style={[
														styles.fieldContainer
													]}>
													<Text
														style={[
															styles.inputLabel
														]}>
														Instagram
													</Text>
													<TextInput
														ref={input => {
															this.instagramInput = input;
														}}
														style={styles.textInput}
														placeholderTextColor={
															'#FFFFFF'
														}
														keyboardType="default"
														placeholder="Instagram URL"
														onChangeText={text =>
															this.handleValueChange(
																'instagram',
																text
															)
														}
														onSubmitEditing={() => {
															this.youtubeInput.focus();
														}}
														returnKeyType={'next'}
														value={form.instagram}
													/>
													{errors.instagram ? (
														<Text
															style={[
																styles.errorText
															]}>
															{`*${
																errors.instagram
															}`}
														</Text>
													) : (
														<Text>&nbsp;</Text>
													)}
												</View>

												<View
													style={[
														styles.fieldContainer
													]}>
													<Text
														style={[
															styles.inputLabel
														]}>
														YouTube
													</Text>
													<TextInput
														ref={input => {
															this.youtubeInput = input;
														}}
														style={styles.textInput}
														placeholderTextColor={
															'#FFFFFF'
														}
														keyboardType="default"
														placeholder="YouTube URL"
														onChangeText={text =>
															this.handleValueChange(
																'youtube',
																text
															)
														}
														onSubmitEditing={() => {
															this.websiteInput.focus();
														}}
														returnKeyType={'next'}
														value={form.youtube}
													/>
													{errors.youtube ? (
														<Text
															style={[
																styles.errorText
															]}>
															{`*${
																errors.youtube
															}`}
														</Text>
													) : (
														<Text>&nbsp;</Text>
													)}
												</View>

												<View
													style={[
														styles.fieldContainer
													]}>
													<Text
														style={[
															styles.inputLabel
														]}>
														Website
													</Text>
													<TextInput
														ref={input => {
															this.websiteInput = input;
														}}
														style={styles.textInput}
														placeholderTextColor={
															'#FFFFFF'
														}
														keyboardType="default"
														placeholder="Website URL"
														onChangeText={text =>
															this.handleValueChange(
																'website',
																text
															)
														}
														value={form.website}
													/>
													{errors.website ? (
														<Text
															style={[
																styles.errorText
															]}>
															{`*${
																errors.website
															}`}
														</Text>
													) : (
														<Text>&nbsp;</Text>
													)}
												</View>
											</React.Fragment>
										)}

										<View
											style={{
												justifyContent: 'center',
												alignItems: 'center',
												paddingTop: 5,
												paddingBottom: 5
											}}>
											{!isSubmitting ? (
												<TouchableOpacity
													style={[styles.loginButton]}
													onPress={this.handleSubmit.bind(
														this
													)}>
													<Text
														style={[
															cs.textCenter,
															cs.font18,
															cs.textBold,
															{ color: 'white' }
														]}
														fontVisby={true}>
														SAVE CHANGES
													</Text>
												</TouchableOpacity>
											) : (
												<View
													style={[
														styles.loginButton,
														{ borderColor: '#EEE' }
													]}>
													<Text
														style={[
															cs.textCenter,
															cs.font18,
															cs.textBold,
															{ color: 'white' }
														]}
														fontVisby={true}>
														SUBMITTING...
													</Text>
												</View>
											)}
										</View>
									</View>
								</View>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
					<Modal
						animationType="slide"
						transparent={false}
						visible={optionsModalVisible}
						onRequestClose={() => {}}
						presentationStyle="fullScreen">
						<View style={{ marginTop: 22, flex: 1 }}>
							<ModalOptions
								data={modalOptionsData}
								title={modalOptionsTitle}
								selected={modalOptionsSelected}
								labelField={modalOptionLabelField}
								valueField={modalOptionValueField}
								setValue={this.setValue.bind(this)}
								multiple={modalOptionMultiple}
							/>
						</View>
					</Modal>
					<Alert
						title={alertTitle}
						detail={alertDetail}
						button={alertButton ? alertButton : 'GOT IT'}
						visible={alertSuccess}
						onClose={alertOnClose}
					/>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F2910A',
		marginTop: 0,
		flex: 1
	},
	profileImage: {
		width: '100%',
		height: 200,
		resizeMode: 'cover'
	},
	profileButton: {
		width: 225,
		borderWidth: 2,
		borderRadius: 20,
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 25,
		paddingRight: 25,
		borderColor: '#fff',
		marginTop: 30
	},
	fieldContainer: {
		marginBottom: 15
	},
	sectionTitle: {
		...cs.textBold,
		...cs.font18,
		color: '#fff',
		marginBottom: 40,
		marginLeft: 10
	},
	textInput: {
		height: 38,
		padding: 8,
		paddingLeft: 0,
		paddingRight: 0,
		borderBottomWidth: 1,
		borderColor: '#FFFFFF',
		backgroundColor: 'transparent',
		color: '#fff',
		fontFamily: 'Niramit',
		fontWeight: 'normal',
		marginLeft: 10,
		marginRight: 10
	},
	textOption: {
		padding: 8,
		paddingLeft: 0,
		paddingRight: 0,
		borderBottomWidth: 1,
		borderColor: '#FFFFFF',
		backgroundColor: 'transparent',
		marginLeft: 10,
		marginRight: 10,
		minHeight: 38
	},
	genderSelect: {
		height: 38,
		padding: 8,
		paddingLeft: 0,
		paddingRight: 0,
		borderBottomWidth: 1,
		borderColor: '#FFFFFF',
		backgroundColor: 'transparent',
		color: '#fff',
		marginLeft: 10,
		marginRight: 10
	},
	errorText: {
		color: '#830202',
		fontSize: 12,
		marginTop: 5,
		marginLeft: 10
	},
	loginButton: {
		borderWidth: 2,
		borderRadius: 20,
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 25,
		paddingRight: 25,
		borderColor: '#fff',
		marginTop: 30
	},
	inputLabel: {
		color: '#fff',
		fontWeight: 'bold',
		marginLeft: 10
	},
	backNavContainer: {
		position: 'absolute',
		left: 10,
		marginTop: 8,
		zIndex: 10
	},
	optionContainer: {
		position: 'absolute',
		backgroundColor: '#1d1d1c',
		borderColor: 'rgba(0,0,0,0.5)',
		borderWidth: 1
	},
	option: {
		padding: 8
	},

	verifiedContainer: {
		flexDirection: 'row',
		position: 'absolute',
		right: 20,
		alignItems: 'center',
		justifyContent: 'center',
		bottom: 28
	},
	googlePlacesSearchContainer: {
		marginTop: 80,
		width: '100%',
		position: 'absolute',
		width: '100%',
		top: 0,
		zIndex: 50,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

function mapStateToProps(state) {
	return {
		//restaurantList: state.restaurantList,
		userDetail: state.userDetail,
		appState: state.appState,
		appConfig: state.appConfig
	};
}

export default connect(
	mapStateToProps,
	{
		fetchUserDetailData: fetchUserDetail,
		clearAppStateData: clearAppState
	}
)(EditProfile);
