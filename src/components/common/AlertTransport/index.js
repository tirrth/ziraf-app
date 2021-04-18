import React, { Component } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Image,
	Linking,
	Text
} from 'react-native';

import cs from '../../../styles/common-styles';
import Alert from '../Alert';

class AlertTransport extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: props.data ? props.data : {},
			visible: props.visible ? props.visible : false
		};
	}

	handleOpenURL(url) {
		if (url) {
			Linking.canOpenURL(url)
				.then(supported => {
					if (supported) {
						Linking.openURL(url).catch(err =>
							alert('cannot open url')
						);
					} else {
						// //console.log(
						// 	"Don't know how to open URI: " + this.props.url
						// );
					}
				})
				.catch(err => {
					alert('cannot open url');
				});
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.data !== this.props.data) {
			this.setState({ data: this.props.data });
		}

		if (prevProps.visible !== this.props.visible) {
			this.setState({ visible: this.props.visible });
		}
	}

	render() {
		const { data, visible } = this.state;
		return (
			<Alert
				title={data.title}
				titleSize={20}
				button={'Cancel'}
				size={'medium'}
				visible={visible}
				onClose={() => {
					this.setState({ visible: false });
					this.props.onClose && this.props.onClose();
				}}>
				<Text
					style={[
						cs.font14,
						cs.textBold,
						cs.textWhite,
						cs.textCenter,
						{ marginBottom: 5 }
					]}>
					Please copy this address
				</Text>
				<Text
					style={[
						cs.font12,
						cs.textWhite,
						cs.textCenter,
						{ marginBottom: 20 }
					]}
					selectable>
					{data.address}
				</Text>
				<View style={[{ flexDirection: 'row' }]}>
					<TouchableOpacity
						style={{ flex: 1 }}
						onPress={this.handleOpenURL.bind(
							this,
							data.transports && data.transports.cabubble
						)}>
						<Image
							style={{
								height: 100,
								width: 100,
								resizeMode: 'contain',
								alignSelf: 'center',
								marginLeft: 5,
								marginRight: 5,
								borderRadius: 10
							}}
							source={require('../../../images/icons/app-icon-cabubble.png')}
						/>
					</TouchableOpacity>
					{/* <TouchableOpacity
						style={{ flex: 1 }}
						onPress={this.handleOpenURL.bind(
							this,
							data.transports && data.transports.uber
						)}>
						<Image
							style={{
								height: 100,

								width: 100,
								resizeMode: 'contain',
								alignSelf: 'center',
								marginLeft: 5,
								marginRight: 5,
								borderRadius: 10
							}}
							source={require('../../../images/icons/app-icon-uber.png')}
						/>
					</TouchableOpacity> */}
				</View>
			</Alert>
		);
	}
}

export default AlertTransport;
