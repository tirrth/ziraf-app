import React, { Component } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Image,
	ScrollView
} from 'react-native';
import Swiper from 'react-native-swiper';
import cs from '../../../styles/common-styles';
import Alert from '../Alert';
import Text from '../../common/Text';
import FastImage from 'react-native-fast-image';

class PopupBanner extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentDataIndex: 0
		};
	}

	switchToNextPopup() {
		const { data } = this.props;
		const { currentDataIndex } = this.state;
		let index = currentDataIndex + 1;
		if(index >= data.length){
			this.setState({currentDataIndex: 0});
		} else { 
			this.setState({currentDataIndex: (currentDataIndex + 1)}); 
		}
	}

	render() {
		const { currentDataIndex } = this.state;
		const { data, setModalVisible, adPopupClickedEvent } = this.props;
		return (
			<View style={styles.container}>
				<View style={styles.backNavContainer}>
					<TouchableOpacity
						onPress={() => {
							setModalVisible(false);
						}}>
						<Image
							style={{
								height: 18,
								resizeMode: 'contain',
								alignSelf: 'center',
								marginRight: 5,

								marginTop: 40
							}}
							source={require('../../../images/icons/icon-close-white.png')}
						/>
					</TouchableOpacity>
				</View>
				<Text
					style={[
						cs.textCenter,
						cs.textBold,
						cs.font20,
						{
							color: '#fff',
							marginTop: 45,
							marginBottom: 20,
							marginLeft: 50,
							marginRight: 50
						}
					]}>
					{data ? (data[currentDataIndex].name) : ''}
				</Text>
				<ScrollView>
				{data &&
				data[currentDataIndex].imageBanners &&
				data[currentDataIndex].imageBanners.length ? (
					<Swiper
						height={250}
						style={styles.wrapper}
						autoplay={true}
						paginationStyle={{ bottom: 10 }}
						activeDotStyle={{
							backgroundColor: '#a3a3a2'
						}}
						dotStyle={{
							borderColor: '#a3a3a2',
							borderWidth: 1,
							width: 8,
							height: 8
						}}>
						{data[currentDataIndex] &&
						data[currentDataIndex].imageBanners &&
						data[currentDataIndex].imageBanners.length
							? data[currentDataIndex].imageBanners.map(
									(imageBanner, idx) => (
										<FastImage
											resizeMode={FastImage.resizeMode.cover}
											style={
												styles.imageBanner
											}
											key={idx}
											source={{
												uri:
													imageBanner.preview
											}}
										/>
									)
								)
							: null}
					</Swiper>
				) : null }


				<View style={{ flex : 1 }}>
					<Text style={[
						cs.textBold,
						cs.font16,
						{
							color: '#fff',
							marginTop: 45,
							marginBottom: 20,
							marginLeft: 50,
							marginRight: 50
						}
					]}>
						{data ? (data[currentDataIndex].fullDescription) : ''}
					</Text>
				</View>
				</ScrollView>
				{data && data.length > 1 ? (
					<TouchableOpacity 
						style={styles.nextBtn} 
						onPress={() => {this.switchToNextPopup();}}>
						<Text style={[
							cs.textOrange,
							cs.textBold,
							cs.font18,
							cs.textCenter
						]}>Next Offer</Text>
					</TouchableOpacity>
				) : null }
				<TouchableOpacity 
					style={styles.learnMoreBtn} 
					onPress={() => {
						this.props.adPopupClickedEvent(
							data[currentDataIndex].external,
							data[currentDataIndex].link,
							data[currentDataIndex].appPage);
							}}>
					<Text style={[
						cs.textOrange,
						cs.textBold,
						cs.font18,
						cs.textCenter
					]}>Learn More</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F2910A',
		paddingLeft: 25,
		paddingRight: 25
	},
	backNavContainer: {
		position: 'absolute',
		left: 0,
		top: 0,
		paddingRight: 5,
		borderRadius: 20,
		paddingLeft: 25,
		paddingTop: 10,
		zIndex: 100
	},
	imageBanner: {
		width: '100%',
		height: 250
	},
	learnMoreBtn: {
		backgroundColor: '#fff',
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: 10,
		marginBottom: 20,
		borderRadius: 20
	},
	nextBtn: {
		backgroundColor: '#fff',
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: 50,
		borderRadius: 20
	}
});

export default PopupBanner;
