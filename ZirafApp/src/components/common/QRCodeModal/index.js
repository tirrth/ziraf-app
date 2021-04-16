import React, { Component } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '../Text';
import cs from '../../../styles/common-styles';
import QRCode from 'react-native-qrcode-svg';

class QRCodeModal extends Component {
    constructor(args) {
		super(args);
		this.state = {
			visible: args.visible ? args.visible : false,
			qrcode: args.qrcode
		};
    }
    
    componentDidUpdate(prevProps) {
		if (this.props.visible !== prevProps.visible) {
			this.setState({ visible: this.props.visible });
        }

        if (this.props.qrcode !== prevProps.qrcode) {
			this.setState({ qrcode: this.props.qrcode });
		}
    }
    
    handleClose() {
		const { onClose } = this.props;
		if (onClose) {
			onClose();
		}
    }

    render() {
		const { visible, qrcode } = this.state;

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
							styles.modal
						]}>
						<Text
							style={{
								textAlign: 'center',
								fontWeight: 'bold',
								fontSize: 30,
								marginBottom: 10
							}}
							fontVisby={true}>
							SCAN ME
						</Text>

                        <View style={{overflow:"hidden", alignItems:"center", padding:5}}>
                        <QRCode
                            value={this.state.qrcode}
                            size={280}
                            color='black'
                            backgroundColor='white'/>
                        </View>

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
                                Close
                            </Text>
                        </TouchableOpacity>
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
		width: '90%',
		paddingTop: 25,
		paddingBottom: 25,
		borderRadius: 20
	}
});

export default QRCodeModal;