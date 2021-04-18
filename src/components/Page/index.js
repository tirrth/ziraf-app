import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Text from './../common/Text';
import LoadingIndicator from './../common/LoadingIndicator';
import cs from './../../styles/common-styles';

class Page extends Component {
  constructor(args) {
    super(args);
    this.state = {
      page: null,
    };
  }

  componentDidMount() {
    const {navigation, route} = this.props;
    const page = route?.params?.page;
    // const page = navigation.getParam('page');
    this.setState({page});
  }

  handleGoBack() {
    const {navigation} = this.props;
    navigation.goBack();
  }

  render() {
    const {page} = this.state;
    return (
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#F2910A',
          },
        ]}>
        {page && (
          <React.Fragment>
            <View style={styles.backNavContainer}>
              <TouchableOpacity onPress={this.handleGoBack.bind(this)}>
                <Image
                  style={{
                    height: 18,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    marginRight: 5,

                    marginTop: 40,
                  }}
                  source={require('../../images/icons/ChevronLeft.png')}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                cs.textCenter,
                cs.textBold,
                cs.font30,
                {
                  color: '#fff',
                  marginTop: 50,
                  marginBottom: 20,
                },
              ]}>
              {page.title}
            </Text>
            <WebView
              source={{
                uri: page.url,
              }}
            />
          </React.Fragment>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backNavContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingRight: 5,
    borderRadius: 20,
    paddingLeft: 25,
    paddingTop: 25,
    zIndex: 100,
  },
});

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(Page);
