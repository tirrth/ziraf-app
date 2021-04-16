import HomeScreen from '../components/Home';
import RestaurantDetail from '../components/Restaurant';
import FilterList from '../components/FilterList';
import ZirafersList from '../components/ZirafersList';

const AppRoutes = {
	RestaurantList: {
		name: 'RestaurantList',
		description: 'Landing page',
		screen: HomeScreen
	},
	RestaurantDetail: {
		name: 'RestaurantDetail',
		description: 'Restaurant Detail Page',
		screen: RestaurantDetail,
		navigationOptions: {
			header: null
		}
	},
	FilterList: {
		name: 'FilterList',
		description: 'Filter List',
		screen: FilterList
	},
	ZirafersList: {
		name: 'ZirafersList',
		description: 'Zirafers List Page',
		screen: ZirafersList,
		navigationOptions: {
			header: null
		}
	}
};

export default AppRoutes;
