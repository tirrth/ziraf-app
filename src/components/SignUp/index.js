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
	KeyboardAvoidingView,
	Platform
} from 'react-native';
import Text from '../common/Text';
import Alert from '../common/Alert';
import { api, userSignUp, getZirafSecretCode } from '../../js/utils';
import LoadingIndicator from '../common/LoadingIndicator';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import cs from '../../styles/common-styles';

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
const USER_NAME_FILTER = /^([a-zA-Z0-9_.)(/\\&-\@^#+=!]{5,100})+$/;
const SYMBOL_FILTER = /^([a-zA-Z0-9_.)(/\\&-\@^#+=!]{5,100})+$/;

class SignUp extends Component {
	constructor(args) {
		super(args);
		this.state = {
			form: {},
			errors: {},
			showGenderOptions: false,
			isValidEmail: false,
			isValidUserName: false,
			alertSuccess: false,
			address: null,
			location: null,
			isSubmitting: false
		};
	}

	handleValueChange(key, value) {
		let { form, errors, isValidEmail, isValidUserName } = this.state;
		form[key] = value;
		errors[key] = '';
		if (key === 'userName') {
			isValidUserName = false;
		} else if (key === 'email') {
			isValidEmail = false;
		}
		this.setState({
			form: form,
			isValidEmail,
			isValidUserName
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
		const { form, address, location } = this.state;
		let { errors } = this.state;
		let hasError = false;

		if (!form.firstName) {
			hasError = true;
			errors['firstName'] = 'First Name is required';
		}

		if (!form.lastName) {
			hasError = true;
			errors['lastName'] = 'Last Name is required';
		}

		if (!form.userName) {
			hasError = true;
			errors['userName'] = 'UserName is required';
		} else if (!USER_NAME_FILTER.test(form.userName)) {
			hasError = true;
			errors['userName'] =
				'UserName must be of minimum 5 characters';
		}
		// } else if (!SYMBOL_FILTER.test(form.userName)) {
		// 	hasError = true;
		// 	errors['userName'] =
		// 		'UserName can only contain the following symbols !@#$%^&*-+_';
		// }

		// if (!form.gender) {
		// 	hasError = true;
		// 	errors['gender'] = 'required';
		// }

		// if (!form.phoneNumber) {
		// 	hasError = true;
		// 	errors['phoneNumber'] = 'PhoneNumber is required';
		// }

		if (!form.email) {
			hasError = true;
			errors['email'] = 'Please enter your email';
		} else if (!EMAIL_FILTER.test(form.email)) {
			hasError = true;
			errors['email'] = 'Please enter a valid email';
		}

		if (!form.password) {
			hasError = true;
			errors['password'] = 'Please enter your password';
		}

		if (!form.confirmPassword) {
			hasError = true;
			errors['confirmPassword'] = 'Please confirm your password';
		}

		if (form.password != form.confirmPassword) {
			hasError = true;
			errors['confirmPassword'] = 'Please make sure you reenter your password correctly';
		}

		// if (!address || !location) {
		// 	hasError = true;
		// 	errors['address'] = 'Please enter your address';
		// }

		// if (!form.zirafCode) {
		// 	hasError = true;
		// 	errors['zirafCode'] =
		// 		'Please enter a code obtained from verified Zirafers';
		// }

		if (hasError) {
			this.setState({
				errors: errors,
				isSubmitting: false
			});
			return;
		}

		// let zirafSecretCode = form.zirafCode;

		// getZirafSecretCode().then(resp => {
		// 	if (resp) {
		// 		let bCorrectSecretCode = false;
		// 		let bActiveStatus = false;
		// 		//do checking here
		// 		for (let secretCodeData of resp.data) {
		// 			if (secretCodeData.isDeleted == true) {
		// 				continue;
		// 			}
		// 			if (zirafSecretCode == secretCodeData.code) {
		// 				bCorrectSecretCode = true;
		// 				if (secretCodeData.status == 'active') {
		// 					bActiveStatus = true;
		// 				}
		// 				break;
		// 			}
		// 		}

		// 		if (!bCorrectSecretCode && !bActiveStatus) {
		// 			this.setState({
		// 				isSubmitting: false,
		// 				alertSuccess: true,
		// 				alertTitle: `Invalid code`,
		// 				alertDetail:
		// 					'Invalid Ziraf secret code. Please obtain one from a valid Zirafer',
		// 				alertOnClose: () => {
		// 					this.setState({
		// 						alertSuccess: false
		// 					});
		// 				}
		// 			});

		// 			return;
		// 		}

		// 		if (bCorrectSecretCode == true && bActiveStatus == false) {
		// 			this.setState({
		// 				isSubmitting: false,
		// 				alertSuccess: true,
		// 				alertTitle: `Expired Code`,
		// 				alertDetail:
		// 					'The secret code you entered has expired. Please obtain a new one',
		// 				alertOnClose: () => {
		// 					this.setState({
		// 						alertSuccess: false
		// 					});
		// 				}
		// 			});

		// 			return;
		// 		}
		// 	} else {
		// 		this.setState({
		// 			isSubmitting: false,
		// 			alertSuccess: true,
		// 			alertTitle: `Error`,
		// 			alertDetail:
		// 				'Error attempting to validate Ziraf Code. Please try again later',
		// 			alertOnClose: () => {
		// 				this.setState({
		// 					alertSuccess: false
		// 				});
		// 			}
		// 		});

		// 		return;
		// 	}
		// });

		let data = {
			firstName: form.firstName,
			lastName: form.lastName,
			userName: form.userName,
			gender: form.gender,
			phoneNumber: form.phoneNumber,
			emailId: form.email,
			password: form.password,
			address: address,
			location: location,
			zirafCode: form.zirafCode
		};

		userSignUp(data).then(resp => {
			if (resp.success) {
				this.setState({
					isSubmitting: false,
					alertSuccess: true,
					alertTitle: `Congrats!`,
					alertDetail:
						'You have successfully registered to Ziraf. A verification mail has been sent to your email. Please verify your Ziraf Account by clicking the link in that email. Note: Please also check your spam folder for the verification email.',
					alertOnClose: () => {
						this.setState(
							{
								alertSuccess: false
							},
							() => {
								const { navigation } = this.props;
								navigation.navigate('RestaurantList');
							}
						);
					}
				});
			} else {
				if (resp.message) {
					// alert(resp.message);
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
					// alert('Something went wrong. Please try again later.');
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
		});
	}

	handleGoBack() {
		const { navigation } = this.props;
		navigation.goBack();
	}

	handleValidation(type) {
		const { form } = this.state;
		let { errors } = this.state;
		let path = '/api/v1/users/verify/email';
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
		} else if (type === 'userName') {
			path = '/api/v1/users/verify/username';
			if (!form.userName) {
				hasError = true;
				errors['userName'] = 'UserName is required';
			// } else if (!SYMBOL_FILTER.test(form.userName)) {
			// 	hasError = true;
			// 	errors['userName'] =
			// 		'UserName can only contain the following symbols !@#$%^&*-+_';
			} else if (!USER_NAME_FILTER.test(form.userName)) {
				hasError = true;
				errors['userName'] = 'UserName must have minimum 5 characters';
			}
			data.userName = form.userName;
		}
		else if (type === 'confirmPassword') {
			if(!form.password) {
				hasError = true;
				errors['password'] = 'Please enter your password';
			} else if(!form.confirmPassword) {
				hasError = true;
				errors['confirmPassword'] = 'Please confirm your password'
			} else if (form.password != form.confirmPassword) {
				hasError = true;
				errors['confirmPassword'] = 'Please make sure you reenter your password correctly';
			}
		}

		if (hasError) {
			this.setState({
				errors: errors
			});
			return;
		}

		api.get(`${path}`, data).then(resp => {
			if (resp.success) {
				if (type === 'email') {
					this.setState({
						isValidEmail: true
					});
				} else if (type === 'userName') {
					this.setState({
						isValidUserName: true
					});
				}
			} else {
				if (resp.message) {
					if (type === 'email') {
						errors['email'] = resp.message;
					} else if (type === 'userName') {
						errors['userName'] = resp.message;
					}
					this.setState({
						errors,
						isValidEmail: false,
						isValidUserName: false
					});
				}
			}
		});
	}

	handleAlertClose() {
		this.setState({ alertSuccess: false }, () => {
			const { navigation } = this.props;
			navigation.navigate('SignIn');
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

	render() {
		const {
			alertButton,
			alertSuccess,
			alertTitle,
			alertDetail,
			alertOnClose,
			form,
			errors,
			showGenderOptions,
			isValidEmail,
			isValidUserName,
			isSubmitting
		} = this.state;

		return (
			<KeyboardAvoidingView
				style={styles.container}
				keyboardVerticalOffset={10}
				behavior={Platform.OS === 'android' ? null : 'padding'}
				enabled>
				<ScrollView>
					<View style={{ padding: 15, marginTop: 60 }}>
						<View style={styles.backNavContainer}>
							<TouchableOpacity
								onPress={this.handleGoBack.bind(this)}
								style={{
									paddingRight: 5,
									paddingLeft: 8,
									zIndex: 10
								}}>
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
								justifyContent: 'center',
								alignItems: 'center',
								marginBottom: 50
							}}>
							<Image
								source={require('../../images/ziraf_logo.png')}
								style={[
									{
										height: 40,
										resizeMode: 'contain',
										alignSelf: 'center',
										marginBottom: 10
									}
								]}
							/>
							<Text
								style={[
									cs.textBold,
									{ color: '#737373', fontSize: 10 }
								]}>
								Honest Restaurant Recommendations
							</Text>
						</View>

						<View style={{}}>
							<View
								style={[
									styles.fieldContainer,
									{ flexDirection: 'row' }
								]}>
								<View style={{ width: '50%' }}>
									<Text style={[styles.inputLabel]}>
										First Name
									</Text>
									<TextInput
										style={styles.textInput}
										placeholderTextColor={'#737373'}
										keyboardType="default"
										placeholder=""
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
										<Text style={[styles.errorText]}>
											{`*${errors.firstName}`}
										</Text>
									) : (
										<Text>&nbsp;</Text>
									)}
								</View>
								<View style={{ width: '50%' }}>
									<Text style={[styles.inputLabel]}>
										Last Name
									</Text>
									<TextInput
										ref={input => {
											this.lastNameInput = input;
										}}
										style={styles.textInput}
										placeholderTextColor={'#737373'}
										keyboardType="default"
										placeholder=""
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
										<Text style={[styles.errorText]}>
											{`*${errors.lastName}`}
										</Text>
									) : (
										<Text>&nbsp;</Text>
									)}
								</View>
							</View>
							{/* <View style={[styles.fieldContainer]}>
								<Text style={[styles.inputLabel]}>Address</Text>
								<GooglePlacesAutocomplete
									placeholderTextColor="#737373"
									placeholder="Optional"
									minLength={2} // minimum length of text to search
									autoFocus={false}
									// returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
									keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
									listViewDisplayed={false} // true/false/undefined
									fetchDetails={true}
									renderDescription={row => row.description} // custom description render
									onPress={(data, details = null) => {
										// 'details' is provided when fetchDetails = true

										if (details && details.geometry) {
											const newLocation = {
												latitude:
													details.geometry.location
														.lat,
												longitude:
													details.geometry.location
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
									// getDefaultValue={{}}
									query={{
										// available options: https://developers.google.com/places/web-service/autocomplete
										key:
											'AIzaSyBqhPI_mfwexM54nxLF3N_zoEMo1JiL0vQ',
										language: 'en', // language of the results
										types: 'address' // default: 'geocode'
									}}
									styles={{
										textInputContainer: {
											backgroundColor: '#1d1d1c',
											alignSelf: 'center',
											borderBottomWidth: 1,
											borderBottomColor: '#737373',
											borderTopWidth: 1,
											borderTopColor: '#1d1d1c',
											marginLeft: 10,
											marginRight: 10
										},
										textInput: {
											marginLeft: 0,
											marginRight: 0,
											color: '#fff',
											fontFamily: 'Niramit',
											fontWeight: 'bold',
											backgroundColor: '#1d1d1c',
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
											width: '100%'
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
								/>
							</View> */}

							<View style={[styles.fieldContainer]}>
								<Text style={[styles.inputLabel]}>
									Username (at least 5 characters)
								</Text>
								<TextInput
									ref={input => {
										this.usernameInput = input;
									}}
									style={styles.textInput}
									placeholderTextColor={'#737373'}
									keyboardType="default"
									placeholder=""
									onChangeText={text =>
										this.handleValueChange('userName', text)
									}
									onSubmitEditing={() => {
										this.phoneInput.focus();
										this.handleValidation('userName');
									}}
									returnKeyType={'next'}
									value={form.userName}
									onBlur={this.handleValidation.bind(
										this,
										'userName'
									)}
								/>
								{isValidUserName ? (
									<View style={styles.verifiedContainer}>
										<Image
											source={require('../../images/icons/checkmark.png')}
											style={[
												{
													height: 12,
													resizeMode: 'contain',
													marginRight: 3
												}
											]}
										/>
										<Text style={[cs.textOrange]}>
											Verified
										</Text>
									</View>
								) : null}
								{errors.userName ? (
									<Text style={[styles.errorText]}>
										{`*${errors.userName}`}
									</Text>
								) : (
									<Text>&nbsp;</Text>
								)}
							</View>

							{/* <View
								style={[
									styles.fieldContainer,
									{ flexDirection: 'row' }
								]}>
								<View style={{ width: '30%' }}>
									<Text style={[styles.inputLabel]}>
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
												{GENDER_CAPITALIZE[form.gender]}
											</Text>
										) : (
											<Text
												style={{
													color: '#737373'
												}}>
												Choose
											</Text>
										)}
									</TouchableOpacity>
									<Modal
										animationType="none"
										transparent={true}
										visible={
											!showGenderOptions ? false : true
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
														top: this.state.offsetY,
														left: this.state
															.offsetX,
														width: this.state.dWidth
													}
												]}>
												<ScrollView>
													{GENDER_OPTIONS.map(
														(option, idx) => (
															<TouchableOpacity
																key={idx}
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
									<Text style={[styles.inputLabel]}>
										Phone Number
									</Text>
									<TextInput
										ref={input => {
											this.phoneInput = input;
										}}
										style={styles.textInput}
										placeholderTextColor={'#737373'}
										keyboardType="default"
										placeholder="Optional"
										onChangeText={text =>
											this.handleValueChange(
												'phoneNumber',
												text
											)
										}
										onSubmitEditing={() => {
											this.emailInput.focus();
										}}
										returnKeyType={'next'}
										value={form.phoneNumber}
									/>
								</View>
							</View> */}

							<View style={styles.fieldContainer}>
								<Text style={[styles.inputLabel]}>Email</Text>
								<TextInput
									ref={input => {
										this.emailInput = input;
									}}
									style={styles.textInput}
									placeholderTextColor={'#737373'}
									keyboardType="email-address"
									placeholder=""
									onChangeText={text =>
										this.handleValueChange('email', text)
									}
									onSubmitEditing={() => {
										this.passwordInput.focus();
										this.handleValidation('email');
									}}
									returnKeyType={'next'}
									value={form.email}
									onBlur={this.handleValidation.bind(
										this,
										'email'
									)}
								/>
								{isValidEmail ? (
									<View style={styles.verifiedContainer}>
										<Image
											source={require('../../images/icons/checkmark.png')}
											style={[
												{
													height: 12,
													resizeMode: 'contain',
													marginRight: 3
												}
											]}
										/>
										<Text style={[cs.textOrange]}>
											Verified
										</Text>
									</View>
								) : null}
								{errors.email ? (
									<Text style={[styles.errorText]}>
										{`*${errors.email}`}
									</Text>
								) : (
									<Text>&nbsp;</Text>
								)}
							</View>

							<View style={styles.fieldContainer}>
								<Text style={[styles.inputLabel]}>
									Password
								</Text>
								<TextInput
									ref={input => {
										this.passwordInput = input;
									}}
									style={styles.textInput}
									placeholderTextColor={'#737373'}
									secureTextEntry={true}
									placeholder=""
									onChangeText={text =>
										this.handleValueChange('password', text)
									}
									value={form.password}
								/>
								{errors.password ? (
									<Text style={[styles.errorText]}>
										{`*${errors.password}`}
									</Text>
								) : (
									<Text>&nbsp;</Text>
								)}
							</View>
							
							<View style={styles.fieldContainer}>
								<Text style={[styles.inputLabel]}>
									Confirm Password
								</Text>
								<TextInput
									ref={input => {
										this.passwordInput = input;
									}}
									style={styles.textInput}
									placeholderTextColor={'#737373'}
									secureTextEntry={true}
									placeholder=""
									onChangeText={text =>
										this.handleValueChange('confirmPassword', text)
									}
									value={form.confirmPassword}
								/>
								{errors.confirmPassword ? (
									<Text style={[styles.errorText]}>
										{`*${errors.confirmPassword}`}
									</Text>
								) : (
									<Text>&nbsp;</Text>
								)}
							</View>

							{/* <View style={styles.fieldContainer}>
								<Text style={[styles.inputLabel]}>
									Ziraf Secret Code
								</Text>
								<TextInput
									style={styles.textInput}
									placeholderTextColor={'#737373'}
									secureTextEntry={true}
									placeholder="Enter Ziraf Secret Code here"
									onChangeText={text =>
										this.handleValueChange(
											'zirafCode',
											text
										)
									}
									value={form.zirafCode}
								/>
								{errors.zirafCode ? (
									<Text style={[styles.errorText]}>
										{`*${errors.zirafCode}`}
									</Text>
								) : (
									<Text>&nbsp;</Text>
								)}
							</View> */}

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
										onPress={this.handleSubmit.bind(this)}>
										<Text
											style={[
												cs.textCenter,
												cs.font18,
												cs.textBold,
												{ color: 'white' }
											]}
											fontVisby={true}>
											REGISTER
										</Text>
									</TouchableOpacity>
								) : (
									<View
										style={[
											styles.loginButton,
											{ borderColor: '#333' }
										]}>
										<Text
											style={[
												cs.textCenter,
												cs.font18,
												cs.textBold,
												{ color: 'white' }
											]}
											fontVisby={true}>
											Submitting...
										</Text>
									</View>
								)}
							</View>
						</View>
					</View>
				</ScrollView>
				<Alert
					title={alertTitle}
					detail={alertDetail}
					button={alertButton ? alertButton : 'GOT IT'}
					visible={alertSuccess}
					onClose={alertOnClose}
				/>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1d1d1c'
	},
	fieldContainer: {
		marginBottom: 15
	},
	textInput: {
		height: 38,
		padding: 8,
		paddingLeft: 0,
		paddingRight: 0,
		borderBottomWidth: 1,
		borderColor: '#737373',
		backgroundColor: 'transparent',
		color: '#fff',
		fontFamily: 'Niramit',
		fontWeight: 'bold',
		marginLeft: 10,
		marginRight: 10
	},
	genderSelect: {
		height: 38,
		padding: 8,
		paddingLeft: 0,
		paddingRight: 0,
		borderBottomWidth: 1,
		borderColor: '#737373',
		backgroundColor: 'transparent',
		color: '#fff',
		marginLeft: 10,
		marginRight: 10
	},
	errorText: {
		color: '#FF4343',
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
	}
});

function mapStateToProps(state) {
	return {};
}

export default connect(
	mapStateToProps,
	{}
)(SignUp);
