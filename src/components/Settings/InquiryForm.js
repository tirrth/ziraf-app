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
import LoadingIndicator from '../common/LoadingIndicator';
import cs from '../../styles/common-styles';
import Alert from '../common/Alert';
import { userSubmitInquiry } from '../../js/utils';

const EMAIL_FILTER = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

class InquiryForm extends Component {

    constructor(args) {
		super(args);
		this.state = {
            successModalVisible: false,
            inquiryText: '',
            contactEmailText: '',
			errors: {
                inquiryText: '',
                contactEmailText: ''
			},

			alertSuccess: false,
			alertTitle: 'Hi',
			alertDetail: '',
			alertButton: 'GOT IT',
			alertOnClose: () => {}
		};
    }
    
    handleInquirySubmit(){
        const { userDetail } = this.props;
		const {
            inquiryText,
            contactEmailText,
		} = this.state;

		let { errors } = this.state;
        let hasError = false;

        if (!inquiryText) {
			hasError = true;
			errors['inquiryText'] = 'Inquiry or feedback is required.';
        }
        
        if (!contactEmailText) {
			hasError = true;
			errors['contactEmailText'] = 'Your contact email is required is required.';
        }
        
        if(!EMAIL_FILTER.test(contactEmailText)){
            hasError = true;
			errors['contactEmailText'] = 'Your contact email must be a valid email.';
        }

        if (hasError) {
			this.setState({
				errors: errors
			});
			return;
		}

		let data = {
			email: contactEmailText,
			subject: inquiryText
		}

		userSubmitInquiry(data).then(resp => {
			this.setSuccessModalVisible(true);
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
    
    render() {
        const { userDetail, setModalVisible } = this.props;
        const {
            inquiryText,
            contactEmailText,

            errors,
			alertButton,
			alertSuccess,
			alertTitle,
			alertDetail,
			alertOnClose
        } = this.state;
        
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
								Feedback Form
							</Text>
							<View style={[cs.paddingT15]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholderTextColor={'#737373'}
                                    keyboardType="default"
                                    placeholder="Your Email"
                                    onChangeText={text => {
                                        let { errors } = this.state;
                                        errors['contactEmailText'] = '';
                                        this.setState({
                                            contactEmailText: text,
                                            errors
                                        });
                                    }}
                                    value={contactEmailText}
                                />
                                {errors.contactEmailText ? (
                                    <Text style={[cs.errorText]}>
                                        {`*${errors.contactEmailText}`}
                                    </Text>
                                ) : (
                                    <Text>&nbsp;</Text>
                                )}
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
										Write your inquiry/feedback here
									</Text>
								</View>
								<View>
									<TextInput
										onChangeText={text => {
											let { errors } = this.state;
											errors['inquiryText'] = '';
											this.setState({
												inquiryText: text,
												errors
											});
										}}
										style={styles.inquiryInput}
										placeholder="Type here..."
										multiline={true}
										value={inquiryText}
									/>
									{errors.inquiryText ? (
										<Text style={[cs.errorText]}>
											{`*${errors.inquiryText}`}
										</Text>
									) : (
										<Text>&nbsp;</Text>
									)}
								</View>
							</View>
						</View>
						

						<View
							style={{ alignItems: 'center', paddingBottom: 80 }}>
							<TouchableOpacity
								onPress={() => this.handleInquirySubmit()}
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
									Thank you for your inquiry/feedback. Our team will review them and get back to you as soon as possible
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
	inquiryInput: {
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
		paddingBottom: 3
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
	textInput: {
		height: 38,
		padding: 8,
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: 'transparent',
		color: '#000',
		fontFamily: 'Niramit',
		marginLeft: 5,
        marginRight: 5,
        borderWidth: 1,
		borderRadius: 20,
        borderColor: '#1D1D1C',
        textAlignVertical: 'top'
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
		userDetail: state.userDetail,
		appConfig: state.appConfig
	};
}

export default connect(
	mapStateToProps,
	{
		
	}
)(InquiryForm);