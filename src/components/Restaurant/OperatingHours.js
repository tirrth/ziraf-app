import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Text from '../common/Text';
import cs from '../../styles/common-styles';

class OperatingHours extends Component {
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
					<Text style={[cs.textBold, cs.font12]} fontVisby={true}>
						OPENING HOURS
					</Text>
				</View>
				{data.map((day, index) => {
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
										cs.textBold,
										cs.font12
									]}
									fontVisby={true}>
									{day.day}
								</Text>
							</View>
							<View style={[styles.timingContainer]}>
								{day.status === 'open' ? (
									day.timings.map((timing, idx) => {
										return (
											<View
												style={styles.timingItem}
												key={`timing-${idx}`}>
												<Text
													style={[
														styles.timingText,
														cs.font12
													]}
													fontVisby={true}>
													{timing}
												</Text>
											</View>
										);
									})
								) : (
									<Text
										style={[styles.timingText, cs.font12]}
										fontVisby={true}>
										CLOSED
									</Text>
								)}
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
		width: 100
	},
	dayText: {
		color: '#FFF'
	},
	timingContainer: {
		flex: 1
	},
	timingItem: {},
	timingText: {
		color: '#FFF'
	}
});

export default OperatingHours;
