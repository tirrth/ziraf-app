import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

let restaurantReviewResponse = {
	success: true,
	message: 'Ok',
	data: [
		{
			zirafer: {
				id: 'ziraf_1',
				displayName: 'OnFoodHunt',
				image: {
					detail:
						'http://archive.boston.com/lifestyle/food/dishing/coren.jpg',
					preview:
						'http://archive.boston.com/lifestyle/food/dishing/coren.jpg',
					width: 300,
					height: 300
				}
			},
			rating: 9.7,
			review:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
		},
		{
			zirafer: {
				id: 'ziraf_2',
				displayName: 'SugarTooth',
				image: {
					detail:
						'http://archive.boston.com/lifestyle/food/dishing/coren.jpg',
					preview:
						'http://archive.boston.com/lifestyle/food/dishing/coren.jpg',
					width: 300,
					height: 300
				}
			},
			rating: 9.7,
			review:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
		}
	]
};

function fetchRestaurantReviewRequest() {
	return {
		type: actions.FETCH_RESTAURANT_REVIEW_REQUEST
	};
}

function fetchRestaurantReviewRequestSuccess(resp, restaurantId) {
	return {
		type: actions.FETCH_RESTAURANT_REVIEW_REQUEST_SUCCESS,
		resp,
		restaurantId
	};
}

function fetchRestaurantReviewRequestError(error, statusCode) {
	return {
		type: actions.FETCH_RESTAURANT_REVIEW_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchRestaurantReview(restaurantId) {
	return dispatch => {
		dispatch(fetchRestaurantReviewRequest());
		return fetch(
			BaseAjaxConfig.host +
				'/api/v1/restaurants/' +
				restaurantId +
				'/reviews',
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
						fetchRestaurantReviewRequestError(err, response.status)
					);
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					dispatch(
						fetchRestaurantReviewRequestSuccess(json, restaurantId)
					);
				},
				err => {}
			); //console.log(err));

		// return setTimeout(() => {
		//     return dispatch(fetchRestaurantReviewRequestSuccess(restaurantReviewResponse));
		// }, 2000)
	};
}
