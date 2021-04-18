import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

function fetchFavouriteRestaurantsRequest() {
	return {
		type: actions.FETCH_FAVOURITE_RESTAURANTS_REQUEST
	};
}

function fetchFavouriteRestaurantsRequestSuccess(resp) {
	return {
		type: actions.FETCH_FAVOURITE_RESTAURANTS_REQUEST_SUCCESS,
		resp
	};
}

function fetchFavouriteRestaurantsRequestError(error, statusCode) {
	return {
		type: actions.FETCH_FAVOURITE_RESTAURANTS_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchFavouriteRestaurants(resIds, location) {
	let lat = null;
	let lon = null;
	if (location && location.coords) {
		lat = location.coords.latitude;
		lon = location.coords.longitude;
	}

	return dispatch => {
		dispatch(fetchFavouriteRestaurantsRequest());
		if (!resIds || resIds.length <= 0) {
			return dispatch(
				fetchFavouriteRestaurantsRequestSuccess({ data: [] })
			);
		}
		return fetch(
			BaseAjaxConfig.host +
				'/api/v1/restaurants?ids=' +
				resIds.join(',') +
				'&lat=' +
				lat +
				'&lon=' +
				lon,
			{
				method: 'GET',
				headers: BaseAjaxConfig.headers
			}
		)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					let err = new Error('API Error. Failed to fetch');
					dispatch(
						fetchFavouriteRestaurantsRequestError(
							err,
							response.status
						)
					);
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					dispatch(fetchFavouriteRestaurantsRequestSuccess(json));
				},
				err => {} //console.log(err)
			);
	};
}
