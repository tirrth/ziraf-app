import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Text from '../Text';
import cs from '../../../styles/common-styles';

class RatingBreakdown extends React.PureComponent {
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
				{data.breakdown.map((rating, index) => {
					return (
						<View
							style={[
								styles.dailyContainer,
								{
									marginBottom: 5,
									justifyContent: 'center'
								}
							]}
							key={`day-${index}`}>
							<View style={[styles.dayContainer]}>
								<Text
									style={[
										styles.dayText,
										cs.font12,
										cs.textMedium
									]}
									fontVisby={true}>
									{rating.key}
								</Text>
							</View>
							<View style={[styles.timingContainer]}>
								<View style={styles.timingItem}>
									<Text
										style={[
											styles.timingText,
											cs.textBold,
											cs.font12
										]}
										fontVisby={true}>
										{rating.value}
									</Text>
								</View>
							</View>
						</View>
					);
				})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	dailyContainer: {
		flexDirection: 'row'
	},
	dayContainer: {
		width: '80%'
	},
	dayText: {
		color: '#FFF'
	},
	timingContainer: {
		textAlign: 'right'
	},
	timingItem: {},
	timingText: {
		color: '#FFF'
	}
});

export default RatingBreakdown;
