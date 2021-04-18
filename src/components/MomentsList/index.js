import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearAppState, fetchMoments} from '../../js/actions/actionCreators';
import Text from '../common/Text';
import LoadingIndicator from '../common/LoadingIndicator';
import MomentCard from '../common/MomentCard';
import Alert from '../common/Alert';
import cs from '../../styles/common-styles';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class MomentsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
      refreshing: false,

      alertSize: false,
      alertSuccess: false,
      alertTitle: 'Hi',
      alertDetail: '',
      alertButton: 'GOT IT',
      alertChildren: null,
      alertOnClose: () => {},
    };
  }

  componentDidMount() {
    const {momentList, fetchMomentList} = this.props;
    if (!momentList) {
      fetchMomentList({});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      this.setState({filter: this.props.filter});
    }
  }

  handleGoBack() {
    const {navigation} = this.props;
    navigation.goBack();
  }

  renderItem({item, index}) {
    const {navigation} = this.props;
    item.navigate = 'Moment';
    return (
      <MomentCard
        data={item}
        navigation={navigation}
        onInfo={this.handleInfo.bind(this)}
      />
    );
  }

  handleRefresh() {
    const {fetchMomentList} = this.props;
    this.setState({refreshing: true});
    return fetchMomentList({})
      .then(res => this.setState({refreshing: false}))
      .catch(err => this.setState({refreshing: false}));
  }

  handleInfo(info) {
    this.setState({
      alertSize: false,
      alertSuccess: true,
      alertTitle: 'Info',
      alertDetail: info,
      alertOnClose: () => {
        this.setState({
          alertSuccess: false,
        });
      },
    });
  }

  render() {
    const {momentList, navigation} = this.props;
    const {
      favouriteMoments,
      filter,

      alertSize,
      alertSuccess,
      alertTitle,
      alertDetail,
      alertButton,
      alertOnClose,
      alertChildren,
    } = this.state;

    return (
      <View style={[styles.container]}>
        <View style={styles.backNavContainer}>
          <TouchableOpacity onPress={this.handleGoBack.bind(this)}>
            <Image
              style={{
                height: 18,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginRight: 5,
              }}
              source={require('../../images/icons/ChevronLeft.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={[cs.padding15]}>
          <Text
            style={[
              cs.textCenter,
              cs.textBold,
              cs.font30,
              {color: '#fff', marginBottom: 30},
            ]}
            fontVisby={true}>
            MOMENTS
          </Text>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh.bind(this)}
            />
          }>
          <View style={[{paddingLeft: 15, paddingRight: 15}]}>
            {momentList && momentList.data ? (
              <FlatList
                data={momentList.data}
                horizontal={false}
                windowSize={11}
                renderItem={this.renderItem.bind(this)}
                keyExtractor={moment => moment.id}
              />
            ) : null}
          </View>
        </ScrollView>
        <Alert
          title={alertTitle}
          size={alertSize}
          detail={alertDetail}
          button={alertButton ? alertButton : 'GOT IT'}
          visible={alertSuccess}
          onClose={alertOnClose}>
          {alertChildren}
        </Alert>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2910A',
    flex: 1,
    paddingTop: 50,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    padding: 8,
    color: '#fff',
    paddingRight: 40,
  },
  tabText: {
    color: '#FFFFFF',
  },
  activeTabText: {
    color: '#F2910A',
    fontWeight: 'bold',
  },
  backNavContainer: {
    position: 'absolute',
    left: 0,
    top: 50,
    paddingRight: 5,
    borderRadius: 20,
    paddingLeft: 25,
    paddingTop: 25,
    zIndex: 100,
  },
});

function mapStateToProps(state) {
  return {
    momentList: state.momentList,
    appState: state.appState,
  };
}

export default connect(mapStateToProps, {
  clearAppStateData: clearAppState,
  fetchMomentList: fetchMoments,
})(MomentsList);
