import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Text from '../Text';
import cs from '../../../styles/common-styles';

class DiscountModal extends React.PureComponent {
	constructor(args) {
		super(args);
		this.state = {};
	}

	render() {
		const { data } = this.props;
		if (!data) {
			return null;
		}

		return (
			<View>
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
					<Text style={[cs.textBold, cs.font18]} fontVisby={true}>
                    {!isNaN(data.percentage) && (data.percentage > 0 
                        && data.percentage < 101)
                        ? data.percentage + '% DISCOUNT'
                        : 'SPECIAL OFFER'}
					</Text>
				</View>
				<View
                    style={[
                        styles.descriptionContainer,
                        {
                            marginBottom: 5,
                            justifyContent: 'center'
                        }
                    ]}>
                    <View style={[styles.textContainer]}>
                        <Text
                            style={[
                                styles.descriptionText,
                                cs.font12,
                                cs.textMedium
                            ]}
                            fontVisby={true}>
                            {data.description}
                        </Text>
                    </View>
                </View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	descriptionContainer: {
		flexDirection: 'row'
	},
	textContainer: {
		width: '80%'
    },
    descriptionText: {
        color: '#fff'
    }
});

export default DiscountModal;
