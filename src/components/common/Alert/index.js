import React, { Component } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from './../Text';
import cs from './../../../styles/common-styles';

class Alert extends Component {
	constructor(args) {
		super(args);
		this.state = {
			visible: args.visible ? args.visible : false,
			title: args.title,
			detail: args.detail,
			button: args.button
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.visible !== prevProps.visible) {
			this.setState({ visible: this.props.visible });
		}

		if (this.props.title !== prevProps.title) {
			this.setState({ title: this.props.title });
		}

		if (this.props.detail !== prevProps.detail) {
			this.setState({ detail: this.props.detail });
		}

		if (this.props.button !== prevProps.button) {
			this.setState({ button: this.props.button });
		}
	}

	handleClose() {
		const { onClose } = this.props;
		if (onClose) {
			onClose();
		}
	}

	render() {
		const { visible, title, detail, button } = this.state;
		const { children, size, titleSize } = this.props;

		return (
			<Modal
				animationType="slide"
				transparent={true}
				visible={visible}
				onRequestClose={() => {}}>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						padding: 15,
						backgroundColor: 'rgba(0,0,0,0.6)'
					}}>
					<View
						style={[
							styles.modal,
							{ width: size === 'small' ? '60%' : '95%' }
						]}>
						{/*<TouchableOpacity style={{position: 'absolute', right: 10, top: 10}} onPress={() => {
                                    this.setSuccessModalVisible(false);
                                }}>
                                <Image style={styles.closeImage} 
                                    source={require('../../images/icons/icon-close-white.png')} />
                            </TouchableOpacity>*/}

						<Text
							style={{
								textAlign: 'center',
								fontWeight: 'bold',
								fontSize:
									size === titleSize
										? titleSize
										: 'small'
										? 20
										: 30,
								marginBottom: 10
							}}
							fontVisby={true}>
							{title}
						</Text>
						{detail ? (
							<Text style={{ textAlign: 'center', fontSize: 14 }}>
								{detail}
							</Text>
						) : null}

						{children ? children : null}

						{button ? (
							<TouchableOpacity
								style={{
									width: 80,
									borderWidth: 2,
									borderColor: '#fff',
									alignSelf: 'center',
									marginTop: 25,
									marginBottom: 5,
									borderRadius: 20,
									padding: 5
								}}
								onPress={this.handleClose.bind(this)}>
								<Text
									style={[
										cs.textBold,
										cs.textWhite,
										cs.font12,
										cs.textCenter
									]}>
									{button}
								</Text>
							</TouchableOpacity>
						) : null}
					</View>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	modal: {
		backgroundColor: '#F2910A',
		padding: 25,
		margin: 25,
		width: '80%',
		paddingTop: 25,
		paddingBottom: 25,
		borderRadius: 20
	}
});

export default Alert;
