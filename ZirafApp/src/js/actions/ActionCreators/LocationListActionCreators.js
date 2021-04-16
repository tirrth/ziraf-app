import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

function fetchLocationsRequest() {
	return {
		type: actions.FETCH_LOCATION_LIST_REQUEST
	};
}

function fetchLocationsRequestSuccess(resp) {
	return {
		type: actions.FETCH_LOCATION_LIST_REQUEST_SUCCESS,
		resp
	};
}

function fetchLocationsRequestError(error, statusCode) {
	return {
		type: actions.FETCH_LOCATION_LIST_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchLocations(
	filtersData = {},
	query = '',
	location = null,
	sort = null,
	page = 1
) {
	let filters = Object.assign({}, filtersData);

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
		dispatch(fetchLocationsRequest());
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
					dispatch(fetchLocationsRequestError(err, response.status));
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					//console.log(json);
					dispatch(fetchLocationsRequestSuccess(json));
					return Promise.resolve(json);
				},
				err => {
					return Promise.reject(err);
				} //console.log(err)
			);
	};
}
