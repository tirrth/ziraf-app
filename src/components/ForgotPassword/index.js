import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';
import Text from '../common/Text';
import {forgotPassword} from '../../js/utils';
import LoadingIndicator from '../common/LoadingIndicator';
import cs from '../../styles/common-styles';
import Alert from '../common/Alert';

class ForgotPassword extends Component {
  constructor(args) {
    super(args);
    this.state = {
      form: {},
      errors: {},
      keepSignedIn: false,
      alertSuccess: false,
    };
  }

  handleValueChange(key, value) {
    let {form, errors} = this.state;
    form[key] = value;
    errors[key] = '';
    this.setState({
      form: form,
    });
  }

  handleSubmit() {
    this.setState({
      isSubmitting: true,
    });
    const {form} = this.state;
    let {errors} = this.state;
    const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    let hasError = false;
    if (!form.email) {
      hasError = true;
      errors['email'] = 'Please enter your email';
    } else if (!emailFilter.test(form.email)) {
      hasError = true;
      errors['email'] = 'Please enter a valid email';
    }

    if (hasError) {
      this.setState({
        errors: errors,
        isSubmitting: false,
      });
      return;
    }

    let data = {
      email: form.email,
    };

    forgotPassword(data)
      .then(resp => {
        if (resp.success) {
          const {navigation} = this.props;
          this.setState(
            {
              form: {},
            },
            () => {
              this.setState({
                isSubmitting: false,
                alertSuccess: true,
                alertTitle: `Success`,
                alertDetail:
                  'We have sent a reset password link to your email.',
                alertOnClose: () => {
                  navigation.goBack();
                },
              });
            },
          );
        } else {
          if (resp.message) {
            this.setState({
              isSubmitting: false,
              alertSuccess: true,
              alertTitle: `Error`,
              alertDetail: resp.message,
              alertOnClose: () => {
                this.setState({
                  alertSuccess: false,
                });
              },
            });
          } else {
            this.setState({
              isSubmitting: false,
              alertSuccess: true,
              alertTitle: `Error`,
              alertDetail: 'Something went wrong. Please try again later.',
              alertOnClose: () => {
                this.setState({
                  alertSuccess: false,
                });
              },
            });
          }
        }
      })
      .catch(err => {
        this.setState({
          isSubmitting: false,
          alertSuccess: true,
          alertTitle: `Error`,
          alertDetail: 'Something went wrong. Please try again later.',
          alertOnClose: () => {
            this.setState({
              alertSuccess: false,
            });
          },
        });
      });
  }

  handleGoBack() {
    const {navigation} = this.props;
    navigation.goBack();
  }

  render() {
    const {
      form,
      errors,

      alertButton,
      alertSuccess,
      alertTitle,
      alertDetail,
      alertOnClose,
    } = this.state;

    return (
      <ScrollView style={styles.container}>
        <View style={{padding: 15, marginTop: 60}}>
          {/* <View style={styles.backNavContainer}>
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
					</View> */}

          <View
            style={{
              paddingLeft: 30,
              paddingRight: 30,
              paddingTop: 40,
            }}>
            <Text
              style={[cs.textBold, cs.font18, cs.textWhite]}
              fontVisby={true}>
              Forgot Password?
            </Text>

            <Text style={[cs.marginTB20, {color: '#737373'}]}>
              Enter the email address associated with your account below and we
              will email you instructions on how to reset your password
            </Text>

            <View style={styles.fieldContainer}>
              <TextInput
                style={styles.textInput}
                placeholderTextColor={'#737373'}
                keyboardType="email-address"
                placeholder="Email"
                onChangeText={text => this.handleValueChange('email', text)}
                value={form.email}
              />
              {errors.email ? (
                <Text style={[styles.errorText]}>{`*${errors.email}`}</Text>
              ) : (
                <Text>&nbsp;</Text>
              )}
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 5,
                paddingBottom: 5,
              }}>
              <TouchableOpacity
                style={[styles.loginButton]}
                onPress={this.handleSubmit.bind(this)}>
                <Text
                  style={[
                    cs.textCenter,
                    cs.font18,
                    cs.textBold,
                    {color: 'white'},
                  ]}
                  fontVisby={true}>
                  SUBMIT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Alert
            title={alertTitle}
            detail={alertDetail}
            button={alertButton ? alertButton : 'GOT IT'}
            visible={alertSuccess}
            onClose={alertOnClose}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1d1d1c',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  textInput: {
    height: 38,
    padding: 8,
    paddingLeft: 0,
    paddingRight: 0,
    borderBottomWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    color: '#fff',
    fontFamily: 'Niramit',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF4343',
    fontSize: 12,
    marginTop: 5,
  },
  loginButton: {
    borderWidth: 2,
    borderRadius: 20,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 25,
    paddingRight: 25,
    borderColor: '#fff',
    marginTop: 30,
  },
  backNavContainer: {
    position: 'absolute',
    left: 10,
    marginTop: 8,
    zIndex: 10,
  },
});

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(ForgotPassword);
