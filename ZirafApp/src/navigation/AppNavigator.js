import React, { Component } from 'react';
import {
	createSwitchNavigator,
	createStackNavigator,
	createBottomTabNavigator,
	createAppContainer
} from 'react-navigation';
import { View, Image } from 'react-native';
import AppRoutes from './Routes';
import EditProfile from '../components/EditProfile';
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';
import Moment from '../components/Moment';
import MomentsList from '../components/MomentsList';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import ForgotPassword from '../components/ForgotPassword';
import Page from '../components/Page';
import Search from '../components/Search';
import Zirafers from '../components/Zirafers';
import ZirafersList from '../components/ZirafersList';
import Zirafer from '../components/Zirafer';
import Location from '../components/Location';
import Settings from '../components/Settings';
import AuthLoadingScreen from '../components/AuthLoadingScreen';
import FavouriteRestaurants from '../components/FavouriteRestaurants';
import LogoTitle from './LogoTitle';
import Discount from '../components/Discount';

// const LogoTitle = (navigation) => {
// 	return (
// 		<View style={{flex: 1, paddingTop: 10, paddingBottom: 10}}>
// 			<Image source={require('../images/ziraf_logo.png')}
// 				style={{ height: 35, resizeMode: 'contain', alignSelf: 'center' }} />
// 		</View>
// 	);
// };

const HomeStack = createStackNavigator(
	{ ...AppRoutes },
	{
		initialRouteName: 'RestaurantList',
		defaultNavigationOptions: ({ navigation }) => {
			return {
				headerTitle: <LogoTitle navigation={navigation} />,
				headerStyle: {
					backgroundColor: '#1d1d1c',
					height: 80,
					borderBottomWidth: 0
				},
				headerTintColor: '#1d1d1c',
				headerLeft: props => (
					<HeaderLeft
						{...props}
						navState={navigation.state}
						navigation={navigation}
					/>
				),
				headerRight: (
					<HeaderRight
						navState={navigation.state}
						navigation={navigation}
					/>
				)
			};
		}
	}
);

const FavouriteRestaurantStack = createStackNavigator(
	{
		FavouriteRestaurants: {
			name: 'FavouriteRestaurants',
			description: 'Favourite Restaurant List',
			screen: FavouriteRestaurants
		}
	},
	{
		initialRouteName: 'FavouriteRestaurants',
		defaultNavigationOptions: ({ navigation }) => {
			return {
				headerTitle: <LogoTitle navigation={navigation} />,
				headerStyle: {
					backgroundColor: '#1d1d1c',
					height: 80,
					borderBottomWidth: 0
				},
				headerTintColor: '#1d1d1c',
				headerLeft: props => (
					<HeaderLeft
						{...props}
						navState={navigation.state}
						navigation={navigation}
					/>
				),
				headerRight: (
					<HeaderRight
						navState={navigation.state}
						navigation={navigation}
					/>
				)
			};
		}
	}
);

const ZirafersStack = createStackNavigator(
	{
		Zirafers: {
			name: 'Zirafers',
			description: 'Zirafers List Page',
			screen: Zirafers,
			navigationOptions: {
				header: null
			}
		},
		ZirafersList: {
			name: 'ZirafersList',
			description: 'Zirafers List Page',
			screen: ZirafersList,
			navigationOptions: {
				header: null,
				tabBarOptions: {
					style: {
						backgroundColor: '#1d1d1c',
						paddingTop: 5
					},
					showLabel: false
				}
			}
		},
		ZiraferDetail: {
			name: 'ZiraferDetail',
			description: 'Zirafer Detail Page',
			screen: Zirafer,
			navigationOptions: {
				header: null
			}
		},
		MomentsList: {
			name: 'MomentsList',
			description: 'Moments List Page',
			screen: MomentsList,
			navigationOptions: {
				header: null
			}
		},
		Moment: {
			name: 'Moment',
			description: 'Moments Restaurant List Page',
			screen: Moment,
			navigationOptions: {
				header: null
			}
		},
		Discount: {
			name: 'Discount',
			description: 'Discount List Page',
			screen: Discount,
			navigationOptions: {
				header: null
			}
		}
	},
	{
		initialRouteName: 'Zirafers'
	}
);

//set tab bar options here use whatever logic you like to enable/disable tab bar
ZirafersStack.navigationOptions = ({ navigation }) => {
	switch (
		navigation.state.routes[navigation.state.routes.length - 1].routeName
	) {
		case 'Zirafers':
		case 'Moments':
			return {
				tabBarOptions: {
					style: {
						backgroundColor: '#F2910A',
						paddingTop: 5
					},
					showLabel: false
				}
			};

		case 'ZirafersList':
		case 'ZiraferDetail':
		case 'Moment':
		case 'Discount':
			return {
				tabBarOptions: {
					style: {
						backgroundColor: '#1d1d1c',
						paddingTop: 5
					},
					showLabel: false
				}
			};
	}
};

const SettingsStack = createStackNavigator(
	{
		Settings: {
			name: 'Settings',
			description: 'Settings Page',
			screen: Settings,
			navigationOptions: {
				header: null
			}
		},
		EditProfile: {
			name: 'EditProfile',
			description: 'Edit Profile Page',
			screen: EditProfile,
			navigationOptions: {
				header: null
			}
		},
		Page: {
			name: 'Page',
			description: 'Page Page',
			screen: Page,
			navigationOptions: {
				header: null
			}
		}
	},
	{
		initialRouteName: 'Settings'
	}
);

const AuthStack = createStackNavigator({
	SignIn: {
		name: 'SignIn',
		description: 'SignIn page',
		screen: SignIn,
		navigationOptions: {
			header: null
		}
	},
	SignUp: {
		name: 'SignUp',
		description: 'SignUp page',
		screen: SignUp,
		navigationOptions: {
			header: null
		}
	},
	ForgotPassword: {
		name: 'ForgotPassword',
		description: 'ForgotPassword page',
		screen: ForgotPassword,
		navigationOptions: {
			header: null
		}
	},
	initialRouteName: 'SignIn'
});

const selectIcons = routes => {
	switch (routes[routes.length - 1].routeName) {
		case 'Zirafers':
		case 'MomentsList':
			return require(`../images/icons/zirafers-active.png`);
		case 'ZirafersList':
		case 'ZiraferDetail':
		case 'Moment':
		case 'Discount':
			return require(`../images/icons/zirafers-invert-active.png`);
	}
};

const IconComponent = ({ name, status, index, routes }) => {
	let imagePath = '';
	let imageHeight = 18;

	if (name === 'home-icon') {
		imagePath =
			status === 'active'
				? require(`../images/icons/home-active.png`)
				: require(`../images/icons/home.png`);
	} else if (name === 'settings-icon') {
		imagePath =
			status === 'active'
				? require(`../images/icons/settings-active.png`)
				: require(`../images/icons/settings.png`);
		imageHeight = 22;
	} else if (name === 'favourite-icon') {
		imagePath =
			status === 'active'
				? require(`../images/icons/favourite_active.png`)
				: require(`../images/icons/favourite_default.png`);
	} else if (name === 'zirafars-icon') {
		imagePath =
			status === 'active'
				? selectIcons(routes)
				: require(`../images/icons/zirafers.png`);
	} else if (name === 'map-icon') {
		imagePath =
			status === 'active'
				? require(`../images/icons/globe-active.png`)
				: require(`../images/icons/globe.png`);
	}

	return (
		<View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
			<Image
				source={imagePath}
				style={{
					height: imageHeight,
					resizeMode: 'contain',
					alignSelf: 'center'
				}}
			/>
		</View>
	);
};

const TabNavigator = createBottomTabNavigator(
	{
		FavouriteRestaurants: {
			name: 'FavouriteRestaurants',
			description: 'Favourite Restaurant List',
			screen: FavouriteRestaurantStack,
			navigationOptions: {
				tabBarOptions: {
					style: {
						borderTopWidth: 0,
						backgroundColor: '#1d1d1c',
						paddingTop: 5
					},
					showLabel: false
				}
			}
		},
		Zirafers: {
			name: 'Zirafers',
			description: 'Zirafers List',
			screen: ZirafersStack
		},
		Home: {
			name: 'HomeStack',
			description: 'HomeStack',
			screen: HomeStack,
			navigationOptions: {
				tabBarOptions: {
					style: {
						borderTopWidth: 0,
						backgroundColor: '#1d1d1c',
						paddingTop: 5
					},
					showLabel: false
				}
			}
		},
		Location: {
			name: 'Location',
			description: 'Location',
			screen: Location,
			navigationOptions: {
				tabBarOptions: {
					style: {
						backgroundColor: '#1d1d1c',
						paddingTop: 5
					},
					showLabel: false
				}
			}
		},
		Settings: {
			name: 'Settings',
			description: 'Settings List',
			screen: SettingsStack
		}
	},
	{
		initialRouteName: 'Home',
		defaultNavigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused, horizontal, tintColor }) => {
				const { routeName, index, routes } = navigation.state;
				let iconName = 'home-icon';
				if (routeName === 'Home') {
					iconName = 'home-icon';
				} else if (routeName === 'FavouriteRestaurants') {
					iconName = 'favourite-icon';
				} else if (routeName === 'Zirafers') {
					iconName = 'zirafars-icon';
				} else if (routeName === 'Location') {
					iconName = 'map-icon';
				} else if (routeName === 'Settings') {
					iconName = 'settings-icon';
				}

				if (focused) {
					return (
						<IconComponent
							name={iconName}
							status="active"
							index={index}
							routes={routes}
						/>
					);
				} else {
					return (
						<IconComponent
							name={iconName}
							status="default"
							index={index}
							routes={routes}
						/>
					);
				}
			},
			tabBarOptions: {
				style: {
					backgroundColor: '#F2910A',
					paddingTop: 5
				},
				showLabel: false
			}
		})
	}
);

export default createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: AuthLoadingScreen,
			App: TabNavigator,
			Auth: AuthStack
		},
		{
			initialRouteName: 'AuthLoading'
		}
	)
);
