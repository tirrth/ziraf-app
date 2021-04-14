import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	ScrollView,
    TouchableOpacity,
    Image,
	StyleSheet,
	Modal,
    Platform,
    TextInput
} from 'react-native';
import {
	fetchZiraferPendingReviews
} from '../../js/utils';
import Text from '../common/Text';
import cs from '../../styles/common-styles';
import Alert from '../common/Alert';
import { api } from '../../js/utils/index';

class EditReview extends Component {
    constructor(args) {
		super(args);
		this.state = {
            errors: {
				reviewText: ''
			},
            reviewText: '',

            successModalVisible: false,
            alertSuccess: false,
			alertTitle: 'Hi',
			alertDetail: '',
			alertButton: 'GOT IT',
			alertOnClose: () => {}
		};
    }

    componentDidMount() {
        const { reviewItem } = this.props;
        this.setState({
            reviewText: reviewItem.review
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

    handleReviewSubmit() {
        const { reviewItem } = this.props;
        const { reviewText } = this.state;
        let { errors } = this.state;
        let hasError = false;
        
        if (!reviewText.trim()) {
			hasError = true;
			errors['reviewText'] = 'Review is required.';
        }
        
        if (hasError) {
			this.setState({
				errors: errors
			});
			return;
        }

        let data = reviewItem;
        data['review'] = reviewText;
        
        api.post('/api/v1/reviews/' + reviewItem._id, data).then(resp => {
            if (resp && resp.success) {
				this.setSuccessModalVisible(true);
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
        });

    }
    
    render() {
        const { setModalVisible, reviewItem } = this.props;
        const {
            errors,
            reviewText,

            successModalVisible,
            alertSuccess,
			alertTitle,
			alertDetail,
			alertButton,
			alertOnClose
		} = this.state;

        return(
        <View style={styles.container}>
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
                        source={require('../../images/icons/ChevronLeftGrey.png')}                    />
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
                        cs.font18,
                        cs.textBold
                    ]}
                    fontVisby={true}>
                    Edit Your Pending Review
                </Text>
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
                        cs.font24,
                        cs.textBold
                    ]}
                    fontVisby={true}>
                    {reviewItem.restaurant.name}
                </Text>
            </View>
            <View style={{marginTop: 15}}>
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
            <View
                style={{ alignItems: 'center', paddingBottom: 80 }}>
                <TouchableOpacity
                    onPress={() => this.handleReviewSubmit()}
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
        </View>
        );
    }
}

const styles = StyleSheet.create({
    backNavContainer: {
		alignItems: 'flex-start',
		paddingRight: 5,
		paddingLeft: 8,
		paddingTop: 8
    },
    container: {
		backgroundColor: '#fff',
		flex: 1,
		marginLeft: 15,
		marginRight: 15
    },
    modal: {
		backgroundColor: '#F2910A',
		padding: 25,
		width: '100%',
		paddingTop: 25,
		paddingBottom: 25,
		borderRadius: 20
	},
    reviewItem: {
		padding: 20,
		borderBottomWidth: 1,
        borderBottomColor: '#F2910A'
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
    submitBtn: {
		backgroundColor: '#F2910A',
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: 30,
		marginBottom: 50,
		borderRadius: 20
	}
})
function mapStateToProps(state) {
	return {
		userDetail: state.userDetail
	};
}

export default connect(
    mapStateToProps
)(EditReview);