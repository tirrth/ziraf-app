import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from './../common/LoadingIndicator';
import { View } from 'react-native';

class AuthLoadingScreen extends Component {
    constructor(args){
        super(args);
        this.state = {}
    }

    componentDidMount() {
        this.props.navigation.navigate('RestaurantList');
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <LoadingIndicator />
            </View>
        );
    }
}

function mapStateToProps(state) {  
    return {}
}

export default connect(mapStateToProps, {})(AuthLoadingScreen);