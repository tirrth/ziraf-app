import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

function fetchRestaurantsRequest() {
	return {
		type: actions.FETCH_RESTAURANT_LIST_REQUEST
	};
}

function fetchRestaurantsRequestSuccess(resp) {
	return {
		type: actions.FETCH_RESTAURANT_LIST_REQUEST_SUCCESS,
		resp
	};
}

function fetchRestaurantsRequestError(error, statusCode) {
	return {
		type: actions.FETCH_RESTAURANT_LIST_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchRestaurants(
	filtersData = {},
	query = '',
	location = null,
	sort = null,
	page = 1
) {
	let filters = Object.assign({}, filtersData);
	if (filters.cuisines && filters.cuisines.length === 0) {
		delete filters['cuisines'];
	}
	if (filters.moments && filters.moments.length === 0) {
		delete filters['moments'];
	}
	if (filters.zirafers && filters.zirafers.length === 0) {
		delete filters['zirafers'];
	}

	if (filters.priceRange) {
		filters['priceRange'] = {
			min: filters.priceRange[0],
			max: filters.priceRange[1]
		};
	}
	if (filters.ratingRange) {
		filters['ratingRange'] = {
			min: filters.ratingRange[0],
			max: filters.ratingRange[1]
		};
	}
	if (filters.locationRange) {
		filters['locationRange'] = {
			min: filters.locationRange[0],
			max: filters.locationRange[1]
		};
		filters['locationRange'] = JSON.stringify(filters['locationRange']);
	}
	if (query) {
		filters['query'] = query.toString().toLowerCase();
	}
	if (location && location.coords) {
		filters['location'] = {
			lat: location.coords.latitude,
			lon: location.coords.longitude
		};
		filters['location'] = JSON.stringify(filters['location']);
	}
	filters['page'] = page;
	filters['sort'] = sort;
	//console.log('FILTERS', filters);
	return dispatch => {
		dispatch(fetchRestaurantsRequest());
		return fetch(BaseAjaxConfig.host + '/api/v1/restaurants/filter', {
			method: 'POST',
			headers: BaseAjaxConfig.headers,
			body: JSON.stringify(filters)
		})
			.then(response => {
				//console.log(response);
				if (response.ok) {
					return response.json();
				} else {
					let err = new Error('API Error. Failed to fetch');
					dispatch(
						fetchRestaurantsRequestError(err, response.status)
					);
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					//console.log(json);
					dispatch(fetchRestaurantsRequestSuccess(json));
				},
				err => {} //console.log(err)
			);
	};
}
