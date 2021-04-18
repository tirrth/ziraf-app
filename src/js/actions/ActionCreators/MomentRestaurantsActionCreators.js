import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

function fetchMomentRestaurantsRequest() {
	return {
		type: actions.FETCH_MOMENT_RESTAURANTS_REQUEST
	};
}

function fetchMomentRestaurantsRequestSuccess(resp) {
	return {
		type: actions.FETCH_MOMENT_RESTAURANTS_REQUEST_SUCCESS,
		resp
	};
}

function fetchMomentRestaurantsRequestError(error, statusCode) {
	return {
		type: actions.FETCH_MOMENT_RESTAURANTS_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchMomentRestaurants(
	moment = '',
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
		dispatch(fetchMomentRestaurantsRequest());
		return fetch(
			BaseAjaxConfig.host + '/api/v1/restaurants/moment/' + moment,
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
						fetchMomentRestaurantsRequestError(err, response.status)
					);
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					dispatch(fetchMomentRestaurantsRequestSuccess(json));
				},
				err => {} //console.log(err)
			);
	};
}
