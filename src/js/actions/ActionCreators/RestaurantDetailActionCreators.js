import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';
import restaurantDetailList from '../restaurantDetailList';

let restaurantDetailResponse = {
	success: true,
	message: 'Ok',
	data: {
		id: 'res_1',
		title: 'Belladona',
		imageBanners: [
			{
				detail:
					'https://u.tfstatic.com/restaurant_photos/389/258389/169/612/c-amsterdam-restaurant-8fce3.jpg',
				preview:
					'https://u.tfstatic.com/restaurant_photos/389/258389/169/612/c-amsterdam-restaurant-8fce3.jpg',
				width: 500,
				height: 300
			},
			{
				detail:
					'http://restauranthubert.com/wp-content/uploads/2018/09/normandy-2.jpg',
				preview:
					'http://restauranthubert.com/wp-content/uploads/2018/09/normandy-2.jpg',
				width: 500,
				height: 300
			},
			{
				detail:
					'https://www.thehotel-brussels.be/d/brussels/media/__thumbs_522_340_crop/The_restaurant_326.jpg',
				preview:
					'https://www.thehotel-brussels.be/d/brussels/media/__thumbs_522_340_crop/The_restaurant_326.jpg',
				width: 500,
				height: 300
			}
		],
		rating: 5,
		distance: 2.5,
		isFavourite: true,
		description: 'An awesome italian cuisine in the heart of London',
		address: '175A, Edgware Rd, Paddington, London. W2 1ET',
		priceRange: {
			min: 3.5,
			max: 12
		},
		topDishes: [
			{
				image: {
					detail:
						'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
					preview:
						'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
					width: 300,
					height: 300
				},
				price: 5.2,
				name: 'Name of the dish'
			},
			{
				image: {
					detail:
						'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
					preview:
						'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
					width: 300,
					height: 300
				},
				price: 5.2,
				name: 'Name of the dish'
			},
			{
				image: {
					detail:
						'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
					preview:
						'https://cdn140.picsart.com/285515799019201.jpg?c480x480',
					width: 300,
					height: 300
				},
				price: 5.2,
				name: 'Name of the dish'
			}
		]
	}
};

function fetchRestaurantDetailRequest() {
	return {
		type: actions.FETCH_RESTAURANT_DETAIL_REQUEST
	};
}

function fetchRestaurantDetailRequestSuccess(resp) {
	return {
		type: actions.FETCH_RESTAURANT_DETAIL_REQUEST_SUCCESS,
		resp
	};
}

function fetchRestaurantDetailRequestError(error, statusCode) {
	return {
		type: actions.FETCH_RESTAURANT_DETAIL_REQUEST_ERROR,
		error,
		statusCode
	};
}

function clearRestaurantDetailRequest() {
	return {
		type: actions.CLEAR_RESTAURANT_DETAIL_REQUEST
	};
}

export function fetchRestaurantDetail(id, location) {
	let lat = null;
	let lon = null;
	if (location && location.coords) {
		lat = location.coords.latitude;
		lon = location.coords.longitude;
	}

	return dispatch => {
		dispatch(fetchRestaurantDetailRequest());
		return fetch(
			BaseAjaxConfig.host +
				'/api/v1/restaurants/' +
				id +
				'?lat=' +
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
						fetchRestaurantDetailRequestError(err, response.status)
					);
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					//console.log('Detail response : ', json);
					dispatch(fetchRestaurantDetailRequestSuccess(json));
				},
				err => {} //console.log(err)
			);

		// return setTimeout(() => {
		//     let restaurantDetailResponse = {
		//         success: true,
		//         message: 'Ok',
		//         data: restaurantDetailList[id]
		//     }
		//     return dispatch(fetchRestaurantDetailRequestSuccess(restaurantDetailResponse));
		// }, 2000)
	};
}

export function clearRestaurantDetail() {
	return dispatch => {
		dispatch(clearRestaurantDetailRequest());
	};
}
