import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

function fetchZiraferDetailRequest() {
	return {
		type: actions.FETCH_ZIRAFER_DETAIL_REQUEST
	};
}

function fetchZiraferDetailRequestSuccess(resp) {
	return {
		type: actions.FETCH_ZIRAFER_DETAIL_REQUEST_SUCCESS,
		resp
	};
}

function fetchZiraferDetailRequestError(error, statusCode) {
	return {
		type: actions.FETCH_ZIRAFER_DETAIL_REQUEST_ERROR,
		error,
		statusCode
	};
}

function clearZiraferDetailRequest() {
	return {
		type: actions.CLEAR_ZIRAFER_DETAIL_REQUEST
	};
}

export function fetchZiraferDetail(id) {
	return dispatch => {
		dispatch(fetchZiraferDetailRequest());
		//console.log(id);
		return fetch(BaseAjaxConfig.host + '/api/v1/zirafers/' + id, {
			method: 'GET',
			headers: BaseAjaxConfig.headers
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					let err = new Error('API Error. Failed to fetch');
					dispatch(
						fetchZiraferDetailRequestError(err, response.status)
					);
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					//console.log(json);
					dispatch(fetchZiraferDetailRequestSuccess(json));
				},
				err => {} //console.log(err)
			);

		// return setTimeout(() => {
		// 	let ziraferDetailResponse = {
		// 		success: true,
		// 		message: 'Ok',
		// 		data: ziraferDetailList[id]
		// 	};
		// 	return dispatch(
		// 		fetchZiraferDetailRequestSuccess(ziraferDetailResponse)
		// 	);
		// }, 2000);
	};
}

export function clearZiraferDetail() {
	return dispatch => {
		dispatch(clearZiraferDetailRequest());
	};
}
