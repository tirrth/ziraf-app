import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

function fetchDiscountRestaurantsRequest() {
	return {
		type: actions.FETCH_DISCOUNT_RESTAURANTS_REQUEST
	};
}

function fetchDiscountRestaurantsRequestSuccess(resp) {
	return {
		type: actions.FETCH_DISCOUNT_RESTAURANTS_REQUEST_SUCCESS,
		resp
	};
}

function fetchDiscountRestaurantsRequestError(error, statusCode) {
	return {
		type: actions.FETCH_DISCOUNT_RESTAURANTS_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchDiscountRestaurants(
	filters = {},
	location = null,
	sort = null,
	page = 1
) {
	if (location && location.coords) {
		filters['location'] = {
			lat: location.coords.latitude,
			lon: location.coords.longitude
		};
		filters['location'] = JSON.stringify(filters['location']);
	}

	filters['page'] = page;
	filters['sort'] = sort;

	return dispatch => {
		dispatch(fetchDiscountRestaurantsRequest());
		return fetch(
			BaseAjaxConfig.host + '/api/v1/restaurants/discounts/',
			{
				method: 'POST',
				headers: BaseAjaxConfig.headers,
				body: JSON.stringify(filters)
			}
		)
			.then(response => {
				//console.log(response);
				if (response.ok) {
					return response.json();
				} else {
					let err = new Error('API Error. Failed to fetch');
					dispatch(
						fetchDiscountRestaurantsRequestError(err, response.status)
					);
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					dispatch(fetchDiscountRestaurantsRequestSuccess(json));
				},
				err => {} //console.log(err)
			);
	};
}
