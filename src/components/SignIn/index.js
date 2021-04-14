import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Image,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	Linking
} from 'react-native';
import { userSignIn } from '../../js/utils';
import { setAccessToken } from '../../js/utils/zirafStorage';
import { fetchUserDetail } from '../../js/actions/actionCreators';

import Text from '../common/Text';
import Alert from '../common/Alert';
import LoadingIndicator from '../common/LoadingIndicator';
import cs from '../../styles/common-styles';

class SignIn extends Component {
	constructor(args) {
		super(args);
		this.state = {
			form: {},
			errors: {},
			keepSignedIn: false,
			alertSuccess: false,
			alertTitle: 'Hi',
			alertDetail: '',
			alertButton: 'GOT IT',
			alertOnClose: () => {}
		};
	}

	handleValueChange(key, value) {
		let { form, errors } = this.state;
		form[key] = value;
		errors[key] = '';
		this.setState({
			form: form
		});
	}

	handleSubmit() {
		const { form } = this.state;
		let { errors } = this.state;
		const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		let hasError = false;
		if (!form.email) {
			hasError = true;
			errors['email'] = 'Please enter your email';
		} else if (!emailFilter.test(form.email)) {
			hasError = true;
			errors['email'] = 'Please enter a valid email';
		}

		if (!form.password) {
			hasError = true;
			errors['password'] = 'Please enter your password';
		}

		if (hasError) {
			this.setState({
				errors: errors
			});
			return;
		}

		let data = {
			email: form.email,
			password: form.password
		};

		userSignIn(data).then(resp => {
			if (resp.success) {
				this.setState(
					{
						form: {}
					},
					() => {
						if (resp.accessToken) {
							setAccessToken(resp.accessToken).then(() => {
								const { fetchUserDetailData } = this.props;
								fetchUserDetailData()
									.then(res => {
										this.setState({
											alertSuccess: true,
											alertTitle: `Hi ${
												res.data.firstName
											}`,
											alertDetail:
												'You are now logged in. Welcome to Ziraf',
											alertOnClose: () => {
												const {
													navigation
												} = this.props;
												navigation.navigate(
													'RestaurantList'
												);
											}
										});
									})
									.catch();
							});
						}
					}
				);
			} else {
				if (resp.message) {
					alert(resp.message);
				} else {
					alert('Something went wrong. Please try again later.');
				}
			}
		});
	}

	handleGuestLogin() {
		const { navigation } = this.props;
		navigation.navigate('App');
	}

	goToRegister() {
		const { navigation } = this.props;
		navigation.navigate('SignUp');
	}

	toggleKeepSignedInStatus() {
		const { keepSignedIn } = this.state;
		this.setState({
			keepSignedIn: !keepSignedIn
		});
	}

	handleAlertClose() {
		const { alertOnClose } = this.state;
		this.setState(
			{
				alertSuccess: false
			},
			() => {
				alertOnClose && alertOnClose();
			}
		);
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
						//console.log(
						// 	"Don't know how to open URI: " + this.props.url
						// );
					}
				})
				.catch(err => {
					alert('cannot open url');
				});
		}
	}

	render() {
		const {
			alertSuccess,
			alertTitle,
			alertDetail,
			alertButton,
			form,
			errors,
			keepSignedIn,
			title,
			detail
		} = this.state;
		const { navigation } = this.props;

		return (
			<KeyboardAvoidingView
				style={styles.container}
				keyboardVerticalOffset={10}
				behavior={Platform.OS === 'android' ? null : 'padding'}
				enabled>
				<ScrollView>
					<View style={{ padding: 15, marginTop: 100 }}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								marginBottom: 80
							}}>
							<Image
								source={require('../../images/ziraf_logo.png')}
								style={[
									{
										height: 50,
										resizeMode: 'contain',
										alignSelf: 'center',
										marginBottom: 10
									}
								]}
							/>
							<Text
								style={[
									cs.font12,
									cs.textBold,
									{ color: '#737373' }
								]}>
								Honest Restaurant Recommendations
							</Text>
						</View>

						<View style={{ paddingLeft: 30, paddingRight: 30 }}>
							<View style={styles.fieldContainer}>
								<TextInput
									style={styles.textInput}
									placeholderTextColor={'#737373'}
									keyboardType="email-address"
									placeholder="Email address"
									onChangeText={text =>
										this.handleValueChange('email', text)
									}
									value={form.email}
								/>
								{errors.email ? (
									<Text style={[styles.errorText]}>
										{`*${errors.email}`}
									</Text>
								) : (
									<Text>&nbsp;</Text>
								)}
							</View>

							<View style={styles.fieldContainer}>
								<TextInput
									style={styles.textInput}
									placeholderTextColor={'#737373'}
									secureTextEntry={true}
									placeholder="Password"
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

							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									paddingBottom: 25
								}}>
								<TouchableOpacity
									style={{
										flexDirection: 'row',
										alignItems: 'center'
									}}
									onPress={this.toggleKeepSignedInStatus.bind(
										this
									)}>
									<View style={[styles.radio]}>
										{keepSignedIn ? (
											<View
												style={{
													backgroundColor: '#F2910A',
													width: 4,
													height: 4,
													borderRadius: 2
												}}
											/>
										) : null}
									</View>
									<Text style={[cs.textCenter, cs.font12]}>
										Keep me signed in
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() =>
										navigation.navigate('ForgotPassword')
									}>
									<Text
										style={[
											cs.textCenter,
											cs.font12,
											cs.textOrange
										]}>
										Forgot password?
									</Text>
								</TouchableOpacity>
							</View>

							<View
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									paddingTop: 5,
									paddingBottom: 5,
									flexDirection: 'row'
								}}>
								<TouchableOpacity
									style={[
										styles.loginButton,
										{ marginRight: 5 }
									]}
									onPress={this.handleSubmit.bind(this)}>
									<Text
										style={[
											cs.textCenter,
											cs.font18,
											cs.textBold,
											{ color: 'white' }
										]}
										fontVisby={true}>
										LOGIN
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										styles.loginButton,
										{ marginLeft: 5 }
									]}
									onPress={this.goToRegister.bind(this)}>
									<Text
										style={[
											cs.textCenter,
											cs.font18,
											cs.textBold,
											{ color: 'white' }
										]}
										fontVisby={true}>
										SIGN UP
									</Text>
								</TouchableOpacity>
							</View>

							<View
								style={{
									alignItems: 'center',
									paddingTop: 5,
									paddingBottom: 5
								}}>
								<TouchableOpacity
									style={[styles.guestLoginButton]}
									onPress={this.handleGuestLogin.bind(this)}>
									<Text
										style={[
											cs.textCenter,
											cs.font13,
											cs.textBold,
											{ color: 'white' }
										]}
										fontVisby={true}>
										Login as guest
									</Text>
								</TouchableOpacity>
							</View>

							{/* <View
								style={{
									alignItems: 'center',
									paddingTop: 25,
									paddingBottom: 50,
									flexDirection: 'row'
								}}>
								<Text
									style={[
										cs.font14,
										cs.textBold,
										{ color: '#737373' }
									]}>
									If you want to be a Ziraf user
								</Text>
								<Text
									style={[
										cs.textCenter,
										cs.font14,
										cs.textBold,
										cs.textWhite
									]}>
									,&nbsp;
								</Text>
								<TouchableOpacity
									onPress={this.goToRegister.bind(this)}>
									<Text
										style={[
											cs.textCenter,
											cs.font14,
											cs.textBold,
											cs.textWhite
										]}>
										sign up here
									</Text>
								</TouchableOpacity>
							</View> */}
						</View>

						<View
							style={{
								alignItems: 'center',
								justifyContent: 'center',
								paddingTop: 50,
								flexDirection: 'row'
							}}>
							<Text style={[cs.textCenter, { fontSize: 10 }]}>
								By logging in you agree to Ziraf’s
							</Text>
							<TouchableOpacity
								style={[
									styles.links,
									{
										marginLeft: 3
									}
								]}
								onPress={this.handleOpenURL.bind(
									this,
									'https://www.zirafapp.com/terms-and-conditions-of-use'
								)}>
								<Text
									style={[
										cs.textCenter,
										{
											fontSize: 10
										}
									]}>
									Terms & Conditions of use
								</Text>
							</TouchableOpacity>
							<Text style={[cs.textCenter, { fontSize: 10 }]}>
								,
							</Text>
						</View>
						<View
							style={{
								alignItems: 'center',
								justifyContent: 'center',
								paddingTop: 5,
								paddingBottom: 20,
								flexDirection: 'row'
							}}>
							<TouchableOpacity
								style={[
									styles.links,
									{
										marginLeft: 3
									}
								]}
								onPress={this.handleOpenURL.bind(
									this,
									'https://www.zirafapp.com/privacy-policy'
								)}>
								<Text style={[cs.textCenter, { fontSize: 10 }]}>
									Privacy Policy
								</Text>
							</TouchableOpacity>
							<Text
								style={[
									cs.textCenter,
									{
										fontSize: 10,
										paddingLeft: 3,
										paddingRight: 3
									}
								]}>
								and
							</Text>
							<TouchableOpacity
								style={[
									styles.links,
									{
										marginLeft: 3
									}
								]}
								onPress={this.handleOpenURL.bind(
									this,
									'https://www.zirafapp.com/cookie-policy'
								)}>
								<Text style={[cs.textCenter, { fontSize: 10 }]}>
									Cookie Policy
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
				<Alert
					title={alertTitle}
					detail={alertDetail}
					button={alertButton ? alertButton : 'GOT IT'}
					visible={alertSuccess}
					onClose={this.handleAlertClose.bind(this)}
				/>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#1d1d1c',
		flex: 1
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
		fontWeight: 'bold'
	},
	errorText: {
		color: '#FF4343',
		fontSize: 12,
		marginTop: 5
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
	guestLoginButton: {
		padding: 8,
		paddingLeft: 5,
		paddingRight: 5,
		borderBottomWidth: 1,
		borderColor: '#fff',
		marginTop: 15
	},
	links: {
		borderBottomWidth: 1,
		borderColor: '#fff'
	},
	radio: {
		borderRadius: 5,
		height: 10,
		width: 10,
		borderColor: '#fff',
		borderWidth: 1,
		marginRight: 5,
		marginTop: 3,
		padding: 3,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

function mapStateToProps(state) {
	return {};
}

export default connect(
	mapStateToProps,
	{
		fetchUserDetailData: fetchUserDetail
	}
)(SignIn);
