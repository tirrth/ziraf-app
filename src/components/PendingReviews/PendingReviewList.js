import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import {fetchZiraferPendingReviews} from '../../js/utils';
import Text from '../common/Text';
import cs from '../../styles/common-styles';
import EditReview from './EditReview';

class PendingReviewList extends Component {
  constructor(args) {
    super(args);
    this.state = {
      reviews: {},
      reviewItem: '',
      editReviewModalVisible: false,
    };
  }

  openReviewModal(visible, review) {
    this.setReviewItem(review);
    this.setReviewModalVisible(visible);
  }

  setReviewModalVisible(visible) {
    this.setState({
      editReviewModalVisible: visible,
    });
    if (!visible) {
      this.refreshList();
    }
  }

  setReviewItem(review) {
    this.setState({
      reviewItem: review,
    });
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    const {currentZiraferID} = this.props;
    const {reviews} = this.state;
    fetchZiraferPendingReviews(currentZiraferID).then(resp => {
      if (resp?.success) {
        this.setState({reviews: resp});
      }
    });
  }

  render() {
    const {setModalVisible} = this.props;
    const {reviews, reviewItem, editReviewModalVisible} = this.state;

    return (
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
                marginRight: 5,
              }}
              source={require('../../images/icons/ChevronLeftGrey.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 15,
          }}>
          <Text
            style={[cs.textOrange, cs.textCenter, cs.font20, cs.textBold]}
            fontVisby={true}>
            Pending Reviews
          </Text>
        </View>
        <ScrollView>
          {reviews.data && reviews.data.length > 0 ? (
            reviews.data.map((review, idx) => (
              <TouchableOpacity
                key={`review-${idx}`}
                style={[styles.reviewItem]}
                onPress={() => this.openReviewModal(true, review)}>
                <Text
                  style={[
                    cs.textBold,
                    cs.font18,
                    {
                      color: '#000',
                    },
                  ]}>
                  {review.restaurant.name}
                </Text>
                <Text
                  style={[
                    {
                      color: '#000',
                    },
                  ]}>
                  {review.review.length > 50
                    ? review.review.slice(0, 50) + '....'
                    : review.review}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[cs.textCenter, cs.textOrange]}>
              You do not any pending review(s) yet
            </Text>
          )}
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={false}
          visible={editReviewModalVisible}
          onRequestClose={() => {}}>
          <View style={{marginTop: 22, flex: 1}}>
            <EditReview
              setModalVisible={this.setReviewModalVisible.bind(this)}
              reviewItem={reviewItem}
            />
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
    paddingTop: 8,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  reviewItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2910A',
  },
});
function mapStateToProps(state) {
  return {
    userDetail: state.userDetail,
  };
}

export default connect(mapStateToProps)(PendingReviewList);
