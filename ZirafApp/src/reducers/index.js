import { combineReducers } from 'redux';
import appState from './AppStateReducer';
import momentList from './MomentListReducer';
import momentRestaurants from './MomentRestaurantsReducer';
import restaurantList from './RestaurantListReducer';
import restaurantDetail from './RestaurantDetailReducer';
import restaurantReview from './RestaurantReviewReducer';
import restaurantMenu from './RestaurantMenuReducer';
import locationList from './LocationListReducer';
import userDetail from './UserDetailReducer';
import favouriteRestaurants from './FavouriteRestaurantsReducers';
import appConfig from './AppConfigReducer';
import restaurantAutocomplete from './RestaurantAutompleteSearchReducer';
import ziraferList from './ZiraferListReducer';
import zirafer from './ZiraferDetailReducer';
import autocomplete from './AutoCompleteReducer';
import discountRestaurants from './DiscountRestaurantsReducer';

const rootReducer = combineReducers({
	appConfig,
	appState,
	autocomplete,
	discountRestaurants,
	momentList,
	momentRestaurants,
	restaurantList,
	restaurantDetail,
	restaurantReview,
	restaurantMenu,
	locationList,
	userDetail,
	favouriteRestaurants,
	restaurantAutocomplete,
	ziraferList,
	zirafer
});

export default rootReducer;
