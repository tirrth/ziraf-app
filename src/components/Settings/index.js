import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import {setAppState, clearUserDetail} from '../../js/actions/actionCreators';
import {resetAccessToken} from './../../js/utils/zirafStorage';
import Text from './../common/Text';
import LoadingIndicator from './../common/LoadingIndicator';
import ReviewForm from './ReviewForm';
import PendingReviewList from './../PendingReviews/PendingReviewList';
import cs from './../../styles/common-styles';
import Rate, {AndroidMarket} from 'react-native-rate';
import OnboardingModal from './../Onboarding';
import InquiryForm from './InquiryForm';
import QRCode from '../common/QRCodeModal';

class Settings extends Component {
  constructor(args) {
    super(args);
    this.state = {
      reviewModalVisible: false,
      onboardingModalVisible: false,
      inquiryModalVisible: false,
      pendingReviewListModalVisible: false,
      isSignedIn: true,
      qrModalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({
      reviewModalVisible: visible,
    });
  }

  setOnboardingModalVisible(visible) {
    this.setState({
      onboardingModalVisible: visible,
    });
  }

  setInquiryModalVisible(visible) {
    this.setState({
      inquiryModalVisible: visible,
    });
  }

  setPendingReviewListModalVisible(visible) {
    this.setState({
      pendingReviewListModalVisible: visible,
    });
  }

  navigate(navigate, data) {
    const {userDetail, navigation, setAppStateData} = this.props;
    let isSignedIn = false;
    if (userDetail) {
      isSignedIn = true;
    }
    if (navigate === 'RestaurantList' && !isSignedIn) {
      setAppStateData('PROMPT_ONLY_USER_ALLOWED_ALERT', true);
    } else {
      if (navigate === 'RestaurantList') {
        setAppStateData('SHOW_MY_VIEW', true);
      }

      if (navigate) {
        navigation.navigate(navigate, data);
      }
    }
  }

  renderNonSignedInView() {
    const {navigation} = this.props;
    return (
      <View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            flexDirection: 'row',
          },
        ]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          style={{
            borderWidth: 2,
            borderColor: '#fff',
            borderRadius: 30,
            marginRight: 5,
          }}>
          <Text
            style={[
              cs.textBold,
              cs.font15,
              {
                padding: 10,
                paddingLeft: 25,
                paddingRight: 25,
              },
            ]}>
            LOGIN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={{
            borderWidth: 2,
            borderColor: '#fff',
            borderRadius: 30,
            marginLeft: 5,
          }}>
          <Text
            style={[
              cs.textBold,
              cs.font15,
              {
                padding: 10,
                paddingLeft: 25,
                paddingRight: 25,
              },
            ]}>
            SIGN UP
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  isZirafUser(user) {
    if (!user) {
      return false;
    }
    let isZirafer = false;
    // alert(JSON.stringify(user));
    if (user.roles && user.zirafer && user.zirafer.isActive) {
      user.roles.forEach(role => {
        if (role.title === 'Zirafer') {
          isZirafer = true;
        }
      });
    }
    return isZirafer;
  }

  isAdmin(user) {
    if (!user) {
      return false;
    }
    let isAdmin = false;
    if (user.roles && user.admin && user.admin?.isActive) {
      user.roles.forEach(role => {
        if (role.title === 'Administrator') {
          isAdmin = true;
        }
      });
    }
    return isAdmin;
  }

  handleLogout() {
    const {clearUserDetailData, navigation} = this.props;
    clearUserDetailData();
    resetAccessToken();
    navigation.navigate('RestaurantList');
  }

  render() {
    const {
      userDetail,
      appConfig,
      navigation,
      setAppStateData,
      appState,
    } = this.props;
    const {
      reviewModalVisible,
      onboardingModalVisible,
      inquiryModalVisible,
      qrModalVisible,
      pendingReviewListModalVisible,
    } = this.state;
    let isSignedIn = false;
    if (userDetail) {
      isSignedIn = true;
    }

    return (
      <SafeAreaView style={[styles.container]}>
        <ScrollView>
          <View style={[cs.padding20, {marginTop: 80}]}>
            {isSignedIn ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {this.isZirafUser(userDetail) ? (
                  <View>
                    {userDetail.zirafer && userDetail.zirafer.image ? (
                      <Image
                        source={{
                          uri: userDetail.zirafer.image.path,
                        }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <Image
                        source={require('../../images/avatar-03.png')}
                        style={styles.profileImage}
                      />
                    )}
                  </View>
                ) : null}
                <Text
                  style={[cs.textBold, cs.font28, cs.marginTB15]}
                  fontVisby={true}>
                  {userDetail && userDetail.username ? userDetail.username : ''}
                </Text>
              </View>
            ) : null}

            <View
              style={[
                cs.marginTB25,
                {borderColor: '#fff', borderBottomWidth: 1},
              ]}>
              {isSignedIn ? (
                <View>
                  {this.isZirafUser(userDetail) ? (
                    <View style={styles.settingsOptionContainer}>
                      <TouchableOpacity
                        onPress={() => this.setModalVisible(true)}
                        style={styles.settingsOption}>
                        <Text style={styles.optionText} fontVisby={true}>
                          Write a review
                        </Text>
                        <Image
                          source={require('../../images/icons/review-add-icon.png')}
                          style={styles.settingsOptionIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {this.isZirafUser(userDetail) &&
                  userDetail.zirafer &&
                  userDetail.zirafer.qrcode ? (
                    <View style={styles.settingsOptionContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({qrModalVisible: true});
                        }}
                        style={styles.settingsOption}>
                        <Text style={styles.optionText} fontVisby={true}>
                          View QR Code
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {this.isZirafUser(userDetail) ? (
                    <View style={styles.settingsOptionContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          this.navigate('ZiraferDetail', {
                            id: userDetail.zirafer._id,
                          })
                        }
                        style={styles.settingsOption}>
                        <Text style={styles.optionText} fontVisby={true}>
                          View My Reviews
                        </Text>
                        <Image
                          source={require('../../images/icons/review-add-icon.png')}
                          style={styles.settingsOptionIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {this.isZirafUser(userDetail) && userDetail.zirafer ? (
                    <View style={styles.settingsOptionContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setPendingReviewListModalVisible(true)
                        }
                        style={styles.settingsOption}>
                        <Text style={styles.optionText} fontVisby={true}>
                          Edit My Pending Reviews
                        </Text>
                        <Image
                          source={require('../../images/icons/review-add-icon.png')}
                          style={styles.settingsOptionIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {!this.isAdmin(userDetail) && !userDetail.admin ? (
                    <View style={styles.settingsOptionContainer}>
                      <TouchableOpacity
                        onPress={() => this.navigate('MyOrders')}
                        style={styles.settingsOption}>
                        <Text style={styles.optionText} fontVisby={true}>
                          My Orders
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  <View style={styles.settingsOptionContainer}>
                    <TouchableOpacity
                      onPress={() => this.navigate('EditProfile', {})}
                      style={styles.settingsOption}>
                      <Text style={styles.optionText} fontVisby={true}>
                        Edit Profile
                      </Text>
                      <Image
                        source={require('../../images/icons/profile-icon.png')}
                        style={styles.settingsOptionIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                this.renderNonSignedInView()
              )}

              <View style={styles.settingsOptionContainer}>
                <TouchableOpacity
                  onPress={this.navigate.bind(this, 'FavouriteRestaurants')}
                  style={styles.settingsOption}>
                  <Text style={styles.optionText} fontVisby={true}>
                    Your Favourites
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.settingsOptionContainer}>
                <TouchableOpacity
                  onPress={this.navigate.bind(this, 'RestaurantList')}
                  style={styles.settingsOption}>
                  <Text style={styles.optionText} fontVisby={true}>
                    Your View
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.settingsOptionContainer}>
                <TouchableOpacity
                  onPress={this.navigate.bind(this, 'ZirafersList', {
                    tab: 'favourites',
                  })}
                  style={styles.settingsOption}>
                  <Text style={styles.optionText} fontVisby={true}>
                    My Zirafers
                  </Text>
                </TouchableOpacity>
              </View>

              {/* <View style={styles.settingsOptionContainer}>
								<TouchableOpacity
									onPress={() => {}}
									style={styles.settingsOption}>
									<Text
										style={styles.optionText}
										fontVisby={true}>
										Tell a friend
									</Text>
									<Image
										source={require('../../images/icons/share-with-firend-icon.png')}
										style={styles.settingsOptionIcon}
									/>
								</TouchableOpacity>
							</View> */}

              <View style={styles.settingsOptionContainer}>
                <TouchableOpacity
                  onPress={() => {
                    let options = {
                      AppleAppID: '1299106923',
                      GooglePackageName: 'com.zirafapp.www.ziraf',
                      preferredAndroidMarket: AndroidMarket.Google,
                      preferInApp: true,
                      openAppStoreIfInAppFails: true,
                      fallbackPlatformURL: 'https://www.zirafapp.com/',
                    };

                    Rate.rate(options, success => {
                      if (success) {
                        // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
                        this.setState({rated: true});
                      }
                    });
                  }}
                  style={styles.settingsOption}>
                  <Text style={styles.optionText} fontVisby={true}>
                    Rate our app
                  </Text>
                  <Image
                    source={require('../../images/icons/rate-app-icon.png')}
                    style={styles.settingsOptionIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.settingsOptionContainer}>
                <TouchableOpacity
                  onPress={() => this.setOnboardingModalVisible(true)}
                  style={styles.settingsOption}>
                  <Text style={styles.optionText} fontVisby={true}>
                    See Tutorial
                  </Text>
                </TouchableOpacity>
              </View>

              {!appState.ALLOW_POPUP_TO_SHOW && appState.POPUPS_AVAILABLE ? (
                <View style={styles.settingsOptionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setAppStateData('ALLOW_POPUP_TO_SHOW', true);
                      navigation.navigate('Home');
                    }}
                    style={styles.settingsOption}>
                    <Text style={styles.optionText} fontVisby={true}>
                      View Events/Offers
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <View style={styles.settingsOptionContainer}>
                <TouchableOpacity
                  onPress={() => this.setInquiryModalVisible(true)}
                  style={styles.settingsOption}>
                  <Text style={styles.optionText} fontVisby={true}>
                    Feedback and Inquiries
                  </Text>
                </TouchableOpacity>
              </View>

              {appConfig.data &&
                appConfig.data.pages &&
                appConfig.data.pages.terms && (
                  <View style={styles.settingsOptionContainer}>
                    <TouchableOpacity
                      onPress={this.navigate.bind(this, 'Page', {
                        page: {
                          title: appConfig.data.pages.terms.title,
                          url: appConfig.data.pages.terms.url,
                        },
                      })}
                      style={styles.settingsOption}>
                      <Text style={styles.optionText} fontVisby={true}>
                        Terms & Conditions
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

              {appConfig.data &&
                appConfig.data.pages &&
                appConfig.data.pages.privacy && (
                  <View style={styles.settingsOptionContainer}>
                    <TouchableOpacity
                      onPress={this.navigate.bind(this, 'Page', {
                        page: {
                          title: appConfig.data.pages.privacy.title,
                          url: appConfig.data.pages.privacy.url,
                        },
                      })}
                      style={styles.settingsOption}>
                      <Text style={styles.optionText} fontVisby={true}>
                        Privacy Policies
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

              {appConfig.data &&
                appConfig.data.pages &&
                appConfig.data.pages.cookie && (
                  <View style={styles.settingsOptionContainer}>
                    <TouchableOpacity
                      onPress={this.navigate.bind(this, 'Page', {
                        page: {
                          title: appConfig.data.pages.cookie.title,
                          url: appConfig.data.pages.cookie.url,
                        },
                      })}
                      style={styles.settingsOption}>
                      <Text style={styles.optionText} fontVisby={true}>
                        Cookie Policies
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

              {appConfig.data &&
                appConfig.data.pages &&
                appConfig.data.pages.about && (
                  <View style={styles.settingsOptionContainer}>
                    <TouchableOpacity
                      onPress={this.navigate.bind(this, 'Page', {
                        page: {
                          title: appConfig.data.pages.about.title,
                          url: appConfig.data.pages.about.url,
                        },
                      })}
                      style={styles.settingsOption}>
                      <Text style={styles.optionText} fontVisby={true}>
                        About Us
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>

            {isSignedIn ? (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <TouchableOpacity
                  onPress={() => this.handleLogout()}
                  style={styles.logOutBtn}>
                  <Text style={styles.optionText}>LOG OUT</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={reviewModalVisible}
          onRequestClose={() => {}}>
          <View style={{marginTop: 22, flex: 1}}>
            <ReviewForm
              setModalVisible={this.setModalVisible.bind(this)}
              navigation={navigation}
            />
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={onboardingModalVisible}
          onRequestClose={() => {}}>
          <View style={{flex: 1}}>
            <OnboardingModal
              setModalVisible={this.setOnboardingModalVisible.bind(this)}
              navigation={navigation}
            />
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={inquiryModalVisible}
          onRequestClose={() => {}}>
          <View style={{marginTop: 22, flex: 1}}>
            <InquiryForm
              setModalVisible={this.setInquiryModalVisible.bind(this)}
              navigation={navigation}
            />
          </View>
        </Modal>

        {this.isZirafUser(userDetail) && userDetail.zirafer ? (
          <Modal
            animationType="slide"
            transparent={false}
            visible={pendingReviewListModalVisible}
            onRequestClose={() => {}}>
            <View style={{marginTop: 22, flex: 1}}>
              <PendingReviewList
                currentZiraferID={userDetail.zirafer._id}
                setModalVisible={this.setPendingReviewListModalVisible.bind(
                  this,
                )}
                navigation={navigation}
              />
            </View>
          </Modal>
        ) : null}

        {this.isZirafUser(userDetail) &&
        userDetail.zirafer &&
        userDetail.zirafer.qrcode ? (
          <QRCode
            visible={qrModalVisible}
            qrcode={userDetail.zirafer.qrcode}
            onClose={() => {
              this.setState({
                qrModalVisible: false,
              });
            }}
          />
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2910A',
    flex: 1,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: 'cover',
  },
  settingsOptionContainer: {
    borderColor: '#fff',
    borderTopWidth: 1,
  },
  settingsOption: {
    paddingTop: 25,
    paddingBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  settingsOptionIcon: {
    resizeMode: 'contain',
    height: 15,
  },
  logOutBtn: {
    borderWidth: 2,
    borderColor: '#fff',
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 30,
  },
});

function mapStateToProps(state) {
  return {
    userDetail: state.userDetail,
    appConfig: state.appConfig,
    appState: state.appState,
  };
}

export default connect(
  mapStateToProps,
  {
    clearUserDetailData: clearUserDetail,
    setAppStateData: setAppState,
  },
)(Settings);
