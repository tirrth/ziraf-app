import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';
import Text from './../common/Text';
import Alert from '../common/Alert';
import LoadingIndicator from './../common/LoadingIndicator';
import MomentCard from '../common/MomentCard';
import cs from './../../styles/common-styles';
import ExternalLinkCard from '../common/ExternalLinkCard';

class Zirafers extends Component {
	constructor(args) {
		super(args);
		this.state = {
			alertSize: false,
			alertSuccess: false,
			alertTitle: 'Hi',
			alertDetail: '',
			alertButton: 'GOT IT',
			alertChildren: null,
			alertOnClose: () => {}
		};
	}

	handleInfo(info) {
		this.setState({
			alertSize: false,
			alertSuccess: true,
			alertTitle: 'Info',
			alertDetail: info,
			alertOnClose: () => {
				this.setState({
					alertSuccess: false
				});
			}
		});
	}

	render() {
		const { appConfig, navigation } = this.props;
		const {
			alertSize,
			alertSuccess,
			alertTitle,
			alertDetail,
			alertButton,
			alertOnClose,
			alertChildren
		} = this.state;

		return (
			<View style={[styles.container]}>
				<ScrollView>
					<View style={[cs.padding20, { marginTop: 30 }]}>
						<Text
							style={[
								cs.textCenter,
								cs.textBold,
								cs.font40,
								{ color: '#fff', marginBottom: 30 }
							]}>
							Explore
						</Text>

						{appConfig.data &&
							appConfig.data.zirafersPage &&
							appConfig.data.zirafersPage.moments && (
								<MomentCard
									data={{
										...appConfig.data.zirafersPage.moments,
										navigate: 'MomentsList'
									}}
									navigation={navigation}
									onInfo={this.handleInfo.bind(this)}
								/>
							)}

						{appConfig.data &&
							appConfig.data.zirafersPage &&
							appConfig.data.zirafersPage.zirafer && (
								<MomentCard
									data={{
										...appConfig.data.zirafersPage.zirafer,
										navigate: 'ZirafersList'
									}}
									navigation={navigation}
									onInfo={this.handleInfo.bind(this)}
								/>
							)}

						{appConfig.data &&
							appConfig.data.zirafersPage &&
							appConfig.data.zirafersPage.promotions &&
							appConfig.data.zirafersPage.promotions.image && (
								<ExternalLinkCard
									data={{
										...appConfig.data.zirafersPage
											.promotions,
										navigate:
											appConfig.data.zirafersPage
												.promotions.url
									}}
									navigation={navigation}
									onInfo={this.handleInfo.bind(this)}
								/>
							)}

						{appConfig.data &&
							appConfig.data.zirafersPage &&
							appConfig.data.zirafersPage.discounts && (
								<MomentCard
									data={{
										...appConfig.data.zirafersPage.discounts,
										navigate: 'Discount'
									}}
									navigation={navigation}
									onInfo={this.handleInfo.bind(this)}
								/>
							)}
					</View>
				</ScrollView>
				<Alert
					title={alertTitle}
					size={alertSize}
					detail={alertDetail}
					button={alertButton ? alertButton : 'GOT IT'}
					visible={alertSuccess}
					onClose={alertOnClose}>
					{alertChildren}
				</Alert>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F2910A',
		flex: 1
	}
});

function mapStateToProps(state) {
	return {
		appConfig: state.appConfig
	};
}

export default connect(
	mapStateToProps,
	{}
)(Zirafers);
