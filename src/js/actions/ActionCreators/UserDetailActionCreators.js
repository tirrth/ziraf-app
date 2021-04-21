import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

function fetchUserDetailRequest() {
  return {
    type: actions.FETCH_USER_DETAIL_REQUEST,
  };
}

function fetchUserDetailRequestSuccess(resp) {
  return {
    type: actions.FETCH_USER_DETAIL_REQUEST_SUCCESS,
    resp,
  };
}

function fetchUserDetailRequestError(error, statusCode) {
  return {
    type: actions.FETCH_USER_DETAIL_REQUEST_ERROR,
    error,
    statusCode,
  };
}

function clearUserDetailRequest() {
  return {
    type: actions.CLEAR_USER_DETAIL_REQUEST,
  };
}

export function fetchUserDetail() {
  //console.log('firing user detail request');
  return dispatch => {
    dispatch(fetchUserDetailRequest());
    return fetch(BaseAjaxConfig.host + '/api/v1/users/detail', {
      method: 'GET',
      headers: BaseAjaxConfig.headers,
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          let err = new Error('API Error. Failed to fetch');
          dispatch(fetchUserDetailRequestError(err, response.status));
          return Promise.reject(err);
        }
      })
      .then(
        json => {
          console.log(json);
          dispatch(fetchUserDetailRequestSuccess(json));
          return Promise.resolve(json);
        },
        err => {}, //console.log(err)
      );
  };
}

export function clearUserDetail() {
  return dispatch => {
    dispatch(clearUserDetailRequest());
  };
}
