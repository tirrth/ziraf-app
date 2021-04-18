import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';
import Text from './../common/Text';
import LoadingIndicator from './../common/LoadingIndicator';
import cs from './../../styles/common-styles';

class Search extends Component {
    constructor(args) {
        super(args);
        this.state = {}
    }

    render() {
        return (
            <View style={[{ flex: 1, justifyContent: 'center', backgroundColor: '#F2910A' }]}>
                <Text style={[cs.textCenter, cs.textBold, { color: '#fff' }]}>Search</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
});


function mapStateToProps(state) {  
    return {}
}

export default connect(mapStateToProps, {})(Search);
