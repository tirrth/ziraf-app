import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	ScrollView,
	StyleSheet,
	View,
	FlatList,
	Dimensions,
	TouchableOpacity,
	Animated,
	TouchableWithoutFeedback,
	Image,
	TextInput,
	RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ModalWrapper from '../common/ModalWrapper';
import Text from '../common/Text';
import LoadingIndicator from '../common/LoadingIndicator';
import RatingBreakdown from '../common/RatingBreakdown';
import RestaurantCard from '../common/RestaurantCard';
import cs from '../../styles/common-styles';
import Alert from '../common/Alert';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class Onboarding extends Component{
	state = {currentPageState: 1, pageCounter: '1/7'}

	updateCurrentPageNumber(newPage){
		this.setState({currentPageState: newPage})
		if(newPage == 2){
			this.setState({pageCounter: '1/7'});
		}
		if(newPage == 3) {
			this.setState({pageCounter: '2/7'});
		}
		if(newPage == 4) {
			this.setState({pageCounter: '3/7'});
		}
		if(newPage == 5) {
			this.setState({pageCounter: '4/7'});
		}
		if(newPage == 6) {
			this.setState({pageCounter: '5/7'});
		}
		if(newPage == 7) {
			this.setState({pageCounter: '6/7'});
		}
		if(newPage == 8) {
			this.setState({pageCounter: '7/7'});
		}
	}

	goToNextPage(){
		if(this.state.currentPageState > 1 && this.state.currentPageState < 9){
			let nextIndex = this.state.currentPageState + 1;
			this.updateCurrentPageNumber(nextIndex);
		}
	}

	goToPreviousPage(){
		if(this.state.currentPageState > 1 && this.state.currentPageState < 9){
			let previousIndex = this.state.currentPageState - 1;
			this.updateCurrentPageNumber(previousIndex);
		}
	}

	goToNextPageSpecial(){
		const { setModalVisible } = this.props;
		if(this.state.currentPageState > 1 && this.state.currentPageState < 9){
			if(this.state.currentPageState != 8){
				let nextIndex = this.state.currentPageState + 1;
				this.updateCurrentPageNumber(nextIndex);
			} else {
				setModalVisible(false);
			}
		}
	}

	render(){
		//turqoise color #0DFCFC
		const { setModalVisible } = this.props;
		let slideShowHeightArea = deviceHeight * 65 / 100;
		let arrowHeight = deviceHeight / 2;
		let middleContainerX = deviceWidth / 4;
		let middleContainerWidth = deviceWidth / 2;
		return (
			<View style={styles.container}>
				<View style={ styles.header }>
					{this.state.currentPageState == 3 ? (
					<Image
						source={require('../../images/ziraf_logo.png')}
						style={styles.logo_highlight}
					/>) : (<Image
						source={require('../../images/ziraf_logo.png')}
						style={styles.logo}
					/>)}
					{this.state.currentPageState == 2 ? 
					(<Image
						source={require('../../images/icons/filter_settings.png')}
						style={styles.filterIcon_highlight}
					/>) : (<Image
						source={require('../../images/icons/filter_settings.png')}
						style={styles.filterIcon}
					/>)}
					
				</View>
				<View
					style={{
						alignItems: 'flex-start',
						marginBottom: 10,
						marginTop: 10,
						flexDirection: 'row',
						alignItems: 'center'
					}}>
					<View
						style={{
							flexDirection: 'row',
							width: '17%',
							alignItems: 'flex-start'
						}}>
						<Text
							allowFontScaling={false}
							style={[
								cs.textWhite,
								cs.font12,
								cs.textBold,
								{ paddingRight: 5, opacity: 0.2 }
							]}>
							Sort
						</Text>
						<Image
							source={require('../../images/icons/dropdown_arrow.png')}
							style={{
								height: 5,
								resizeMode: 'contain',
								alignSelf: 'center',
								marginTop: 3,
								opacity: 0.2
							}}
						/>
					</View>
					<View
						style={{
							flex: 1,
							justifyContent: 'center'
						}}>
						<TextInput
							style={styles.searchInput}
							placeholderTextColor={'#737373'}
							placeholder=""
							editable={false}
						/>
						<View
							style={{
								alignItems: 'center',
								position: 'absolute',
								right: 0
							}}>
							<Image
								source={require('../../images/icons/search.png')}
								style={{ height: 15, resizeMode: 'contain', opacity: 0.2 }}
							/>
						</View>
					</View>
				</View>

				<View style={{ paddingTop: 15, paddingBottom: 50 }}>
					<View>
						<View style={styles.restaurantCardContainer}>
							<View style={{ flex: 1 }}>
								<View>
									<Image
										style={styles.cardImage}
										source={require('../../images/onboarding/restaurant_placeholder.png')}
									/>
									{this.state.currentPageState == 7 ? (<View
										style={styles.rating_highlight}>
										<Text
											allowFontScaling={false}
											style={{
												color: '#fff',
												fontSize: 15,
												fontWeight: 'bold'
											}}
											fontVisby={true}>
											8.5
										</Text>
									</View>) : (<View
										style={styles.rating}>
										<Text
											allowFontScaling={false}
											style={{
												color: '#fff',
												fontSize: 15,
												fontWeight: 'bold'
											}}
											fontVisby={true}>
											8.5
										</Text>
									</View>)}
									

									<View style={styles.favouriteContainer}>
										<Image
											style={{
												height: 20,
												resizeMode: 'contain',
												alignSelf: 'center',
												marginRight: 5,
												opacity: 0.2
											}}
											source={require('../../images/icons/favourite_active.png')}
										/>
									</View>

									<View
										style={{
											flex: 1,
											flexDirection: 'row',
											position: 'absolute',
											bottom: -12,
											alignSelf: 'center'
										}}>
										<View style={styles.ctaBg}>
											{this.state.currentPageState == 4 ? (<Image
												source={require('../../images/icons/take-away-icon.png')}
												style={{
													height: 20,
													width: 20,
													resizeMode: 'contain',
													//tintColor: '#0080FF'
												}}
											/>) : (<Image
												source={require('../../images/icons/take-away-icon.png')}
												style={{
													height: 20,
													width: 20,
													resizeMode: 'contain',
													opacity: 0.2
												}}
											/>)}											
										</View>
										<View style={styles.ctaBg}>
										{this.state.currentPageState == 5 ? (<Image
												source={require('../../images/icons/reservation-icon.png')}
												style={{
													height: 20,
													width: 20,
													resizeMode: 'contain',
													//tintColor: '#0080FF'
												}}
											/>) : (<Image
												source={require('../../images/icons/reservation-icon.png')}
												style={{
													height: 20,
													width: 20,
													resizeMode: 'contain',
													opacity: 0.2
												}}
											/>)}											
										</View>
										<View style={styles.ctaBg}>
										{this.state.currentPageState == 6 ? (<Image
												source={require('../../images/icons/taxi-icon.png')}
												style={{
													height: 20,
													width: 20,
													resizeMode: 'contain',
													//tintColor: '#0080FF'
												}}
											/>) : (<Image
												source={require('../../images/icons/taxi-icon.png')}
												style={{
													height: 20,
													width: 20,
													resizeMode: 'contain',
													opacity: 0.2
												}}
											/>)}											
										</View>
									</View>
								</View>

								<View style={styles.infoContainer}>
									<Text allowFontScaling={false} style={styles.name} fontVisby={true}>
										Min Jiang
									</Text>
									<View
										style={styles.distanceContainer}>
										{this.state.currentPageState == 8 ? (<Image
											style={{
												height: 20,
												width: 30,
												resizeMode: 'contain',
												marginTop: 5,
												//tintColor: '#0080FF'
											}}
											source={require('../../images/icons/NavigationCircle.png')}
										/>) : (<Image
											style={{
												height: 20,
												width: 30,
												resizeMode: 'contain',
												marginTop: 5,
												opacity: 0.2
											}}
											source={require('../../images/icons/NavigationCircle.png')}
										/>)}
										
										{this.state.currentPageState == 8 ? (
											<View style={{ alignItems: 'flex-end' }}>
												<Text
													allowFontScaling={false}
													style={{
														fontSize: 12,
														color: '#F2910A'
													}}>
													Directions
												</Text>
												<Text
													allowFontScaling={false}
													style={{
														color: '#fff',
														fontSize: 10
													}}>8 Mi</Text>
											</View>
										) : (
											<View style={{ alignItems: 'flex-end' }}>
												<Text
													allowFontScaling={false}
													style={{
														fontSize: 12,
														color: '#F2910A',
														opacity: 0.2
													}}>
													Directions
												</Text>
												<Text
													allowFontScaling={false}
													style={{
														color: '#fff',
														fontSize: 10,
														opacity: 0.2
													}}>8 Mi</Text>
											</View>
										)}
										
									</View>
								</View>
							</View>
						</View>
					</View>
				</View>
				<View style={{
					width: deviceWidth, 
					height: 50, 
					backgroundColor: '#1d1d1c', 
					justifyContent: 'center', 
					alignItems: 'center',
					position: 'absolute',
					bottom: 0,
					flexDirection: 'row'
				}}>
					<Image style={styles.bottomNavBarIcon} source={require('../../images/icons/favourite_default.png')}/>
					<Image style={styles.bottomNavBarIcon} source={require('../../images/icons/zirafers.png')}/>
					<Image style={styles.bottomNavBarIcon} source={require('../../images/icons/home-active.png')}/>
					<Image style={styles.bottomNavBarIcon} source={require('../../images/icons/globe.png')}/>
					<Image style={styles.bottomNavBarIcon} source={require('../../images/icons/settings.png')}/>
				</View>

				{this.state.currentPageState == 2 ? 
				(<View style={{position:'absolute', borderWidth:1, borderColor: '#fff', right: 10, top: 80, width: 150}}>
					<Text style={{backgroundColor:'#000', fontSize: 16, padding: 20}} fontSimplicity={true}>Create Your View by saving your food preference here</Text>
				</View>) : null}

				{this.state.currentPageState == 3 ? 
				(<View style={{position:'absolute', borderWidth:1, borderColor: '#fff', left:middleContainerX, top: 80, width: middleContainerWidth}}>
					<Text style={{backgroundColor:'#000', fontSize: 16, padding: 20}} fontSimplicity={true}>Tap 'Ziraf' to see 'Your View', your personalized recommended options based on your food preferences</Text>
				</View>) : null}

				{this.state.currentPageState == 4 ? 
				(<View style={{position:'absolute', borderWidth:1, borderColor: '#fff', left:middleContainerX, top: 210, width: middleContainerWidth}}>
					<Text style={{backgroundColor:'#000', fontSize: 16, padding: 20}} fontSimplicity={true}>See the Menu</Text>
				</View>) : null}

				{this.state.currentPageState == 5 ? 
				(<View style={{position:'absolute', borderWidth:1, borderColor: '#fff', left:middleContainerX, top: 210, width: middleContainerWidth}}>
					<Text style={{backgroundColor:'#000', fontSize: 16, padding: 20}} fontSimplicity={true}>Book a Table</Text>
				</View>) : null}

				{this.state.currentPageState == 6 ? 
				(<View style={{position:'absolute', borderWidth:1, borderColor: '#fff', left:middleContainerX, top: 210, width: middleContainerWidth}}>
					<Text style={{backgroundColor:'#000', fontSize: 16, padding: 20}} fontSimplicity={true}>Book a Taxi</Text>
				</View>) : null}

				{this.state.currentPageState == 7 ? 
				(<View style={{position:'absolute', borderWidth:1, borderColor: '#fff', left:middleContainerX, top: 150, width: middleContainerWidth}}>
					<Text style={{backgroundColor:'#000', fontSize: 16, padding: 20}} fontSimplicity={true}>Tap the rating to see the breakdown</Text>
				</View>) : null}

				{this.state.currentPageState == 8 ? 
				(<View style={{position:'absolute', borderWidth:1, borderColor: '#fff', left:middleContainerX, left:50, top: 300, width: 200}}>
					<Text style={{backgroundColor:'#000', fontSize: 16, padding: 20}} fontSimplicity={true}>Tap here to get directions to the restaurant (only activated when "Create Your View")</Text>
				</View>) : null}
				

				{/* Lets start overlay */}
				{this.state.currentPageState == 1 ? (
					<TouchableOpacity onPress={() => {
						//setModalVisible(false);
						this.setState({currentPageState: 2})
					}} style={styles.overlay}>
				<View>
					<View style={{top:100}}>
						<Image style={{
							width:'60%', 
							height:'70%',
							alignSelf:'center',
							resizeMode:'contain'
							}} source={require('../../images/onboarding/onboarding_welcome.png')}/>
							<View style={{width: '60%', alignSelf:'center', paddingTop:5}}>
								<Text
									style={[
										cs.textWhite,
										cs.textCenter,
										cs.font16,
										cs.textBold,
									]} fontSimplicity={true}>
									Hey there! I'm Ziraf and I am about to
									walk you through some important tips
								</Text>
							</View>
						
						{/* <TouchableOpacity
							onPress={() => {
								//setModalVisible(false);
								this.setState({currentPageState: 2})
							}}
							style={styles.orangeBtn}> */}
							<View style={styles.orangeBtn}>
							<Text
								style={[
									cs.textWhite,
									cs.textCenter,
									cs.font16,
									cs.textBold
								]} fontSimplicity={true}>
								LET'S START
							</Text>
							</View>
						{/* </TouchableOpacity> */}
					</View>
				</View>
				</TouchableOpacity>
				): null }

				{this.state.currentPageState > 1 ? (
					<TouchableOpacity style={styles.overlay_clear} onPress={this.goToNextPageSpecial.bind(this)}>
				<View>
					{/* slideshow area */}
					<View style={{top: slideShowHeightArea, alignSelf:'center', alignItems:'center'}}>
						<View style={{flexDirection: 'row'}}>
							{/* {this.state.currentPageState == 2 ? (<Text style={{marginHorizontal: 20, paddingHorizontal: 10}}>{' '}</Text>) : 
							(<TouchableOpacity style={{backgroundColor: '#F2910A', borderRadius: 20, marginHorizontal: 20, paddingHorizontal: 10}} onPress={this.goToPreviousPage.bind(this)}>
								<Text style={{fontSize: 30, fontWeight: 'bold'}}>{'<'}</Text>
							</TouchableOpacity>)} */}
							<Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18, marginLeft: 20, marginRight: 20}} fontSimplicity={true}>{this.state.pageCounter}</Text>
							{/* {this.state.currentPageState == 8 ? (<Text style={{marginHorizontal: 20, paddingHorizontal: 10}}>{'  '}</Text>) : 
							(<TouchableOpacity style={{backgroundColor: '#F2910A', borderRadius: 20, marginHorizontal: 20 , paddingHorizontal: 10}} onPress={this.goToNextPage.bind(this)}>
								<Text style={{fontSize: 30, fontWeight: 'bold'}}>{'>'}</Text>
							</TouchableOpacity>)} */}
						</View>
						<View style={{flexDirection:'row'}}>
							{this.state.currentPageState == 2 ? (<Text style={[cs.textOrange,cs.textCenter,cs.font30,cs.textBold]}> . </Text>) : (<Text style={[cs.textWhite,cs.textCenter,cs.font30,cs.textBold]}> . </Text>)}
							{this.state.currentPageState == 3 ? (<Text style={[cs.textOrange,cs.textCenter,cs.font30,cs.textBold]}> . </Text>) : (<Text style={[cs.textWhite,cs.textCenter,cs.font30,cs.textBold]}> . </Text>)}
							{this.state.currentPageState == 4 ? (<Text style={[cs.textOrange,cs.textCenter,cs.font30,cs.textBold]}> . </Text>) : (<Text style={[cs.textWhite,cs.textCenter,cs.font30,cs.textBold]}> . </Text>)}
							{this.state.currentPageState == 5 ? (<Text style={[cs.textOrange,cs.textCenter,cs.font30,cs.textBold]}> . </Text>) : (<Text style={[cs.textWhite,cs.textCenter,cs.font30,cs.textBold]}> . </Text>)}
							{this.state.currentPageState == 6 ? (<Text style={[cs.textOrange,cs.textCenter,cs.font30,cs.textBold]}> . </Text>) : (<Text style={[cs.textWhite,cs.textCenter,cs.font30,cs.textBold]}> . </Text>)}
							{this.state.currentPageState == 7 ? (<Text style={[cs.textOrange,cs.textCenter,cs.font30,cs.textBold]}> . </Text>) : (<Text style={[cs.textWhite,cs.textCenter,cs.font30,cs.textBold]}> . </Text>)}
							{this.state.currentPageState == 8 ? (<Text style={[cs.textOrange,cs.textCenter,cs.font30,cs.textBold]}> . </Text>) : (<Text style={[cs.textWhite,cs.textCenter,cs.font30,cs.textBold]}> . </Text>)}
						</View>
						
						{/* <TouchableOpacity
							onPress={() => {
								setModalVisible(false);
							}}
							style={styles.orangeBtn}>
							<View style={styles.orangeBtn}>
							<Text
								style={[
									cs.textWhite,
									cs.textCenter,
									cs.font16,
									cs.textBold
								]} fontSimplicity={true}>
								GOT IT!
							</Text>
							</View>
						</TouchableOpacity> */}
					</View>
				</View>
				</TouchableOpacity>
				): null }
			</View>
		);
	}
}

const styles = StyleSheet.create({
	bottomNavBarIcon:{
		flex:1,
		height: 18,
		width:20,
		resizeMode:'contain',
		opacity: 0.2
	},
	cardImage: {
		width: '100%',
		height: 180,
		resizeMode: 'cover',
		borderRadius: 10,
		opacity: 0.2
	},
	container: {
		flex: 1,
		backgroundColor: '#1d1d1c',
		paddingLeft: 25,
		paddingRight: 25
	},
	ctaBg: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1d1d1c',
		padding: 8,
		borderRadius: 30,
		margin: 5
	},
	distanceContainer: {
		flexDirection: 'row'
	},
	infoContainer: {
		flexDirection: 'row',
		marginBottom: 8,
		marginTop: 8
	},
	favouriteContainer: {
		position: 'absolute',
		right: 0,
		marginTop: 40
	},
	filterIcon: {
		position: 'absolute',
		right: -10,
		marginRight: 0,
		marginTop: 10,
		height: 22,
		resizeMode: 'contain',
		opacity: 0.2
	},
	filterIcon_highlight: {
		position: 'absolute',
		right: -10,
		marginRight: 0,
		marginTop: 10,
		height: 22,
		resizeMode: 'contain',
		//tintColor: '#0080FF'
	},
	header: {
		marginTop: 25,
		marginBottom: 25
	},
	logo: {
		height: 35,
		resizeMode: 'contain',
		alignSelf: 'center',
		opacity: 0.2
	},
	logo_highlight: {
		height: 35,
		resizeMode: 'contain',
		alignSelf: 'center',
		//tintColor: '#0080FF'
	},
	modalContainer: {
		backgroundColor: '#1d1d1c',
		marginRight: 80
	},
	name: {
		color: '#F2910A',
		fontSize: 20,
		fontWeight: 'bold',
		marginLeft: 10,
		width: '70%',
		opacity: 0.2
	},
	overlay:{
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor:'rgba(0,0,0,0.6)'
	},
	overlay_clear:{
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor:'rgba(0,0,0,0)'
	},
	rating: {
		backgroundColor: '#F2910A',
		position: 'absolute',
		right: 0,
		paddingTop: 1,
		paddingBottom: 3,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 20,
		marginRight: 8,
		marginTop: 6,
		opacity: 0.2
	},
	rating_highlight: {
		backgroundColor: '#F2910A',
		position: 'absolute',
		right: 0,
		paddingTop: 1,
		paddingBottom: 3,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 20,
		marginRight: 8,
		marginTop: 6
	},
	restaurantCardContainer: {
		backgroundColor: '#1d1d1c',
		marginBottom: 15,
		height: 200
	},
	searchInput: {
		borderWidth: 1,
		borderColor: '#fff',
		borderRadius: 30,
		padding: 8,
		fontSize: 11,
		color: '#fff',
		paddingRight: 40,
		paddingLeft: 15,
		opacity: 0.2
	},
	orangeBtn: {
		backgroundColor: '#F2910A',
		padding: 5,
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: 10,
		width: 150,
		alignSelf:'center',
		borderRadius: 20
	}
});

export default connect()(Onboarding);