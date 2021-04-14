import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Text from '../Text';
import cs from '../../../styles/common-styles';

class Collapsable extends Component {
	constructor(args) {
		super(args);
		this.state = {
			isCollapsed: args.isCollapsed,
			isSelected: args.isSelected
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.isCollapsed !== prevProps.isCollapsed) {
			this.setState({ isCollapsed: this.props.isCollapsed });
		}

		if (this.props.isSelected !== prevProps.isSelected) {
			this.setState({ isSelected: this.props.isSelected });
		}
	}

	toggleCollapse() {
		this.setState(
			{
				isCollapsed: !this.state.isCollapsed
			},
			() => {
				const { onToggle } = this.props;
				if (onToggle) {
					onToggle(this.state.isCollapsed);
				}
			}
		);
	}

	render() {
		const {
			item,
			content,
			isCollapseable,
			iconActive,
			iconInactive
		} = this.props;
		const { isCollapsed, isSelected } = this.state;

		let arrowImage = require('../../../images/icons/dropdown_arrow.png');
		let checkImage =
			iconInactive ||
			require('../../../images/icons/CircleCheckmark.png');
		if (!isCollapsed) {
			arrowImage = require('../../../images/icons/dropdown_arrow_up.png');
			if (iconActive) {
				checkImage = iconActive;
			} else {
				if (isSelected) {
					checkImage = require('../../../images/icons/CircleFilledCheckmark.png');
				}
			}
		}

		if (!isCollapseable) {
			arrowImage = require('../../../images/icons/SquareCheckmark.png');

			if (!isCollapsed) {
				arrowImage = require('../../../images/icons/SquareCheckmark_selected.png');
			}
		}

		return (
			<View style={styles.accordBlock}>
				<TouchableOpacity
					onPress={this.toggleCollapse.bind(this)}
					style={{
						flex: 1,
						flexDirection: 'row',
						position: 'relative',
						paddingLeft: 15,
						paddingRight: 15
					}}>
					<Image
						style={[styles.accordCheckMark]}
						source={checkImage}
					/>
					<Text
						style={[
							cs.textWhite,
							cs.textBold,
							cs.font12,
							styles.accordTitle
						]}>
						{item.title}
					</Text>
					{isCollapseable ? (
						<Image
							style={[styles.accordArrow]}
							source={arrowImage}
						/>
					) : (
						<Image
							style={[styles.accordCheckbox]}
							source={arrowImage}
						/>
					)}
				</TouchableOpacity>

				{!isCollapsed && isCollapseable ? (
					<View style={{ flex: 1 }}>
						<View style={styles.accordContentBlock}>
							{content ? content : null}
						</View>
					</View>
				) : null}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	accordBlock: {
		paddingTop: 12,
		paddingBottom: 12,
		borderColor: '#737373',
		borderBottomWidth: 1
	},
	accordTitle: {
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 30,
		paddingLeft: 30
	},
	accordArrow: {
		height: 5,
		resizeMode: 'contain',
		position: 'absolute',
		right: 10,
		marginTop: 10
	},
	accordCheckbox: {
		height: 10,
		resizeMode: 'contain',
		position: 'absolute',
		right: 10,
		marginTop: 10
	},
	accordCheckMark: {
		height: 15,
		resizeMode: 'contain',
		position: 'absolute',
		left: 0,
		alignSelf: 'center'
	},
	accordContentBlock: {
		flex: 1,
		color: '#696b89',
		fontSize: 16,
		marginTop: 8
	},
	accordContent: {
		color: '#696b89',
		fontSize: 14,
		lineHeight: 24
	}
});

export default Collapsable;
