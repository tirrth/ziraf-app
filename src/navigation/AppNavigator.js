import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View, Image, Text, Platform} from 'react-native';
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
import Zirafers from '../components/Zirafers';
import ZirafersList from '../components/ZirafersList';
import Zirafer from '../components/Zirafer';
import Location from '../components/Location';
import Settings from '../components/Settings';
import AuthLoadingScreen from '../components/AuthLoadingScreen';
import FavouriteRestaurants from '../components/FavouriteRestaurants';
import LogoTitle from './LogoTitle';
import Discount from '../components/Discount';
import MyOrders from '../components/MyOrders';
import HomeScreen from '../components/Home';
import RestaurantDetail from '../components/Restaurant';
import FilterList from '../components/FilterList';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const HomeStack = createStackNavigator();
const HomeStackScreens = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{header: () => null}}
      initialRouteName="RestaurantList">
      {/* {Object.entries(AppRoutes).forEach(([key, value]) => {
        return <HomeStack.Screen name={value.name} children={value.screen} />;
      })} */}
      <HomeStack.Screen name={'RestaurantList'} component={HomeScreen} />
      <HomeStack.Screen
        initialParams={{id: null, origin: null}}
        name={'RestaurantDetail'}
        component={RestaurantDetail}
      />
      <HomeStack.Screen name={'FilterList'} component={FilterList} />
      <HomeStack.Screen name={'ZirafersList'} component={ZirafersList} />
    </HomeStack.Navigator>
  );
};

const ZirafersStack = createStackNavigator();
const ZirafersStackScreens = () => {
  return (
    <ZirafersStack.Navigator initialRouteName="Zirafers">
      <ZirafersStack.Screen
        options={{header: () => null}}
        name="Zirafers"
        component={Zirafers}
      />
      <ZirafersStack.Screen
        initialParams={{tab: null}}
        name="ZirafersList"
        component={ZirafersList}
      />
      <ZirafersStack.Screen name="MomentsList" component={MomentsList} />
      <ZirafersStack.Screen
        initialParams={{id: null}}
        name="ZiraferDetail"
        component={Zirafer}
      />
      <ZirafersStack.Screen name="Moment" component={Moment} />
      <ZirafersStack.Screen name="Discount" component={Discount} />
    </ZirafersStack.Navigator>
  );
};

const SettingsStack = createStackNavigator();
const SettingsStackScreens = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Settings">
      <SettingsStack.Screen name="Settings" component={Settings} />
      <SettingsStack.Screen name="EditProfile" component={EditProfile} />
      <SettingsStack.Screen
        initialParams={{page: null}}
        name="Page"
        component={Page}
      />
      <SettingsStack.Screen
        initialParams={{origin: null}}
        name="MyOrders"
        component={MyOrders}
      />
      <SettingsStack.Screen name="Auth" component={AuthStackScreens} />
    </SettingsStack.Navigator>
  );
};

const AuthStack = createStackNavigator();
const AuthStackScreens = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="SignIn"
      screenOptions={{header: () => null}}>
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthStack.Navigator>
  );
};
//   {
//   SignIn: {
//     name: 'SignIn',
//     description: 'SignIn page',
//     screen: SignIn,
//     navigationOptions: {
//       header: null,
//     },
//   },
//   SignUp: {
//     name: 'SignUp',
//     description: 'SignUp page',
//     screen: SignUp,
//     navigationOptions: {
//       header: null,
//     },
//   },
//   ForgotPassword: {
//     name: 'ForgotPassword',
//     description: 'ForgotPassword page',
//     screen: ForgotPassword,
//     navigationOptions: {
//       header: null,
//     },
//   },
//   initialRouteName: 'SignIn',
// }

// const selectIcons = routes => {
//   console.log(
//     'routes[routes.length - 1].name = ',
//     routes[routes.length - 1].name,
//     routes[0],
//   );
//   switch (routes[routes.length - 1].name) {
//     case 'Zirafers':
//     case 'MomentsList':
//       return require(`../images/icons/zirafers-active.png`);
//     case 'ZirafersList':
//     case 'ZiraferDetail':
//     case 'Moment':
//     case 'Discount':
//       return require(`../images/icons/zirafers-invert-active.png`);
//   }
// };

const IconComponent = ({name, status, routes}) => {
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
        ? /* selectIcons(routes) */ require(`../images/icons/zirafers-active.png`)
        : require(`../images/icons/zirafers.png`);
  } else if (name === 'map-icon') {
    imagePath =
      status === 'active'
        ? require(`../images/icons/globe-active.png`)
        : require(`../images/icons/globe.png`);
  }

  return (
    <View style={{flex: 1, paddingTop: 10, paddingBottom: 10}}>
      <Image
        source={imagePath}
        style={{
          height: imageHeight,
          resizeMode: 'contain',
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

const TabNavigator = createBottomTabNavigator();
// {
//   FavouriteRestaurants: {
//     name: 'FavouriteRestaurants',
//     description: 'Favourite Restaurant List',
//     screen: FavouriteRestaurantStack,
//     navigationOptions: {
//       tabBarOptions: {
//         style: {
//           borderTopWidth: 0,
//           backgroundColor: '#1d1d1c',
//           paddingTop: 5,
//         },
//         showLabel: false,
//       },
//     },
//   },
//   Zirafers: {
//     name: 'Zirafers',
//     description: 'Zirafers List',
//     screen: ZirafersStack,
//   },
//   Home: {
//     name: 'HomeStack',
//     description: 'HomeStack',
//     screen: HomeStack,
//     navigationOptions: {
//       tabBarOptions: {
//         style: {
//           borderTopWidth: 0,
//           backgroundColor: '#1d1d1c',
//           paddingTop: 5,
//         },
//         showLabel: false,
//       },
//     },
//   },
//   Location: {
//     name: 'Location',
//     description: 'Location',
//     screen: Location,
//     navigationOptions: {
//       tabBarOptions: {
//         style: {
//           backgroundColor: '#1d1d1c',
//           paddingTop: 5,
//         },
//         showLabel: false,
//       },
//     },
//   },
//   Settings: {
//     name: 'Settings',
//     description: 'Settings List',
//     screen: SettingsStack,
//   },
// },
// {
//   initialRouteName: 'Home',
//   defaultNavigationOptions: ({navigation}) => ({
// tabBarIcon: ({focused, horizontal, tintColor}) => {
//   const {routeName, index, routes} = navigation.state;
//   let iconName = 'home-icon';
//   if (routeName === 'Home') {
//     iconName = 'home-icon';
//   } else if (routeName === 'FavouriteRestaurants') {
//     iconName = 'favourite-icon';
//   } else if (routeName === 'Zirafers') {
//     iconName = 'zirafars-icon';
//   } else if (routeName === 'Location') {
//     iconName = 'map-icon';
//   } else if (routeName === 'Settings') {
//     iconName = 'settings-icon';
//   }

//   if (focused) {
//     return (
//       <IconComponent
//         name={iconName}
//         status="active"
//         index={index}
//         routes={routes}
//       />
//     );
//   } else {
//     return (
//       <IconComponent
//         name={iconName}
//         status="default"
//         index={index}
//         routes={routes}
//       />
//     );
//   }
// },
//     tabBarOptions: {
//       style: {
//         backgroundColor: '#F2910A',
//         paddingTop: 5,
//       },
//       showLabel: false,
//     },
//   }),
// },

// export default createAppContainer(
//   createSwitchNavigator(
//     {
//       AuthLoading: AuthLoadingScreen,
//       App: TabNavigator,
//       Auth: AuthStack,
//     },
//     {
//       initialRouteName: 'AuthLoading',
//     },
//   ),
// );

const Tab = createBottomTabNavigator();
export default AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="HomeRoot"
        screenOptions={({route, ...props}) => {
          const {name: routeName} = route;
          let iconName,
            backgroundColor = '#F2910A';
          if (routeName === 'HomeRoot') {
            iconName = 'home-icon';
            backgroundColor = '#1d1d1c';
          } else if (routeName === 'FavouriteRestaurants') {
            iconName = 'favourite-icon';
            backgroundColor = '#1d1d1c';
          } else if (routeName === 'ZirafersRoot') {
            iconName = 'zirafars-icon';
          } else if (routeName === 'Location') {
            iconName = 'map-icon';
            backgroundColor = '#1d1d1c';
          } else if (routeName === 'SettingsRoot') {
            iconName = 'settings-icon';
          }
          return {
            tabBarStyle: {
              backgroundColor,
              paddingTop: 5,
              borderTopWidth: 0, // To remove the faint line on the top of tabBar
            },
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => {
              const {routes} = props.navigation?.getState();
              return (
                <IconComponent
                  name={iconName}
                  status={focused ? 'active' : 'default'}
                  routes={routes}
                />
              );
            },
          };
        }}>
        <Tab.Screen
          name="FavouriteRestaurants"
          options={({navigation, route}) => ({
            headerShown: true,
            headerStyle: [
              {
                backgroundColor: '#1d1d1c',
                height: 100,
              },
              Platform.OS === 'android' ? {elevation: 0} : {shadowOpacity: 0}, // To remove the faint line on the bottom of header
            ],
            headerTintColor: '#1d1d1c',
            headerTitle: () => <LogoTitle navigation={navigation} />,
            headerLeft: props => (
              <HeaderLeft
                {...props}
                navState={navigation.state}
                navigation={navigation}
              />
            ),
            headerRight: props => (
              <HeaderRight
                {...props}
                navState={navigation.state}
                navigation={navigation}
              />
            ),
          })}
          component={FavouriteRestaurants}
        />
        <Tab.Screen name="ZirafersRoot" component={ZirafersStackScreens} />
        <Tab.Screen
          name="HomeRoot"
          options={({navigation, route}) => ({
            headerShown: true,
            headerStyle: [
              {
                backgroundColor: '#1d1d1c',
                height: 100,
              },
              Platform.OS === 'android' ? {elevation: 0} : {shadowOpacity: 0}, // To remove the faint line on the bottom of header
            ],
            headerTintColor: '#1d1d1c',
            headerTitle: () => <LogoTitle navigation={navigation} />,
            headerLeft: props => (
              <HeaderLeft
                {...props}
                navState={navigation.state}
                navigation={navigation}
              />
            ),
            headerRight: props => (
              <HeaderRight
                {...props}
                navState={navigation.state}
                navigation={navigation}
              />
            ),
          })}
          component={HomeStackScreens}
        />
        <Tab.Screen
          name="Location"
          initialParams={{
            address: null,
            location: null,
            restaurantId: null,
            direction: null,
          }}
          component={Location}
        />
        <Tab.Screen name="SettingsRoot" component={SettingsStackScreens} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// FavouriteRestaurants: {
//   name: 'FavouriteRestaurants',
//   description: 'Favourite Restaurant List',
//   screen: FavouriteRestaurantStack,
//   navigationOptions: {
//     tabBarOptions: {
//       style: {
//         borderTopWidth: 0,
//         backgroundColor: '#1d1d1c',
//         paddingTop: 5,
//       },
//       showLabel: false,
//     },
//   },
// },
// Zirafers: {
//   name: 'Zirafers',
//   description: 'Zirafers List',
//   screen: ZirafersStack,
// },
// Home: {
//   name: 'HomeStack',
//   description: 'HomeStack',
//   screen: HomeStack,
//   navigationOptions: {
//     tabBarOptions: {
//       style: {
//         borderTopWidth: 0,
//         backgroundColor: '#1d1d1c',
//         paddingTop: 5,
//       },
//       showLabel: false,
//     },
//   },
// },
// Location: {
//   name: 'Location',
//   description: 'Location',
//   screen: Location,
//   navigationOptions: {
//     tabBarOptions: {
//       style: {
//         backgroundColor: '#1d1d1c',
//         paddingTop: 5,
//       },
//       showLabel: false,
//     },
//   },
// },
// Settings: {
//   name: 'Settings',
//   description: 'Settings List',
//   screen: SettingsStack,
// },
