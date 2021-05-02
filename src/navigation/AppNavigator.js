import 'react-native-gesture-handler';
import React from 'react';
import {View, Image, Text, Platform} from 'react-native';
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
import linking from './Linking';
import LoadingIndicator from '../components/common/LoadingIndicator';

const HomeStack = createStackNavigator();
const HomeStackScreens = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{header: () => null}}
      initialRouteName="RestaurantList">
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
    </SettingsStack.Navigator>
  );
};

const IconComponent = ({name, is_focused}) => {
  let imagePath = '';
  let imageHeight = 18;

  if (name === 'home-icon') {
    imagePath = is_focused
      ? require(`../images/icons/home-active.png`)
      : require(`../images/icons/home.png`);
  } else if (name === 'settings-icon') {
    imagePath = is_focused
      ? require(`../images/icons/settings-active.png`)
      : require(`../images/icons/settings.png`);
    imageHeight = 22;
  } else if (name === 'favourite-icon') {
    imagePath = is_focused
      ? require(`../images/icons/favourite_active.png`)
      : require(`../images/icons/favourite_default.png`);
  } else if (name === 'zirafars-icon') {
    imagePath = is_focused
      ? require(`../images/icons/zirafers-active.png`)
      : require(`../images/icons/zirafers.png`);
  } else if (name === 'map-icon') {
    imagePath = is_focused
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

const Tab = createBottomTabNavigator();
const bottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeRoot"
      screenOptions={({route, ...props}) => {
        const {name: routeName} = route;
        let iconName,
          backgroundColor = '#F2910A';
        switch (routeName) {
          case 'HomeRoot':
            iconName = 'home-icon';
            backgroundColor = '#1d1d1c';
            break;
          case 'FavouriteRestaurants':
            iconName = 'favourite-icon';
            backgroundColor = '#1d1d1c';
            break;
          case 'ZirafersRoot':
            iconName = 'zirafars-icon';
            break;
          case 'Location':
            iconName = 'map-icon';
            backgroundColor = '#1d1d1c';
            break;
          case 'SettingsRoot':
            iconName = 'settings-icon';
            break;
          default:
            iconName = 'home-icon';
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
                is_focused={focused}
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
        options={({navigation}) => ({
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

const RootStack = createStackNavigator();
export default AppNavigator = () => {
  return (
    <NavigationContainer
      linking={linking}
      fallback={
        <View style={{flex: 1}}>
          <LoadingIndicator />
        </View>
      }>
      <RootStack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="BottomTabRoot">
        <RootStack.Screen name="BottomTabRoot" component={bottomTabNavigator} />
        <RootStack.Screen name="AuthRoot" component={AuthStackScreens} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
