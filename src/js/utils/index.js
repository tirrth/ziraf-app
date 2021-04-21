import BaseAjaxConfig from './../actions/BaseAjaxConfig.js';
import qs from 'querystring';

const utils = {
  api: {
    get: (path, data) => {
      return fetch(BaseAjaxConfig.host + path + ('?' + qs.stringify(data)), {
        method: 'GET',
        headers: BaseAjaxConfig.headers,
      })
        .then(response => {
          if (response) {
            return response.json();
          } else {
            let err = new Error('API Error. Failed to fetch');
            return Promise.reject(err);
          }
        })
        .then(
          json => {
            return json;
          },
          err => {}, //console.log(err)
        );
    },
    post: (path, data) => {
      return fetch(BaseAjaxConfig.host + path, {
        method: 'POST',
        headers: BaseAjaxConfig.headers,
        body: JSON.stringify(data),
      })
        .then(response => {
          //console.log('RES', response);
          if (response.ok) {
            return response.json();
          } else {
            let err = new Error('API Error. Failed to send data.');
            return Promise.reject(err);
          }
        })
        .then(
          json => {
            return json;
          },
          err => {}, //console.log(err)
        );
    },
    put: (path, data) => {
      return fetch(BaseAjaxConfig.host + path, {
        method: 'PUT',
        headers: BaseAjaxConfig.headers,
        body: JSON.stringify(data),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            let err = new Error('API Error. Failed to send data.');
            return Promise.reject(err);
          }
        })
        .then(
          json => {
            return json;
          },
          err => {}, //console.log(err)
        );
    },
  },
  userSubmitInquiry: data => {
    return fetch('https://www.zirafapp.com/support/support_send_email.php', {
      method: 'POST',
      headers: BaseAjaxConfig.headers,
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(
        json => {
          return json;
        },
        err => {}, //console.log(err)
      );
  },
  getZirafSecretCode: () => {
    return fetch(BaseAjaxConfig.host + '/api/v1/secretcodes', {
      method: 'GET',
      headers: BaseAjaxConfig.headers,
    })
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(
        json => {
          return json;
        },
        err => {}, //console.log(err)
      );
  },
  getAdPopupBanners: () => {
    return fetch(BaseAjaxConfig.host + '/api/v1/ads/active', {
      method: 'GET',
      headers: BaseAjaxConfig.headers,
    })
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(
        json => {
          return json;
        },
        err => {}, //console.log(err)
      );
  },
  restaurantSendAnalytics: data => {
    return fetch(
      'https://www.zirafapp.com/analytics/restaurant_analytics.php',
      {
        method: 'POST',
        headers: BaseAjaxConfig.headers,
        body: JSON.stringify(data),
      },
    );
  },
  userSignUp: data => {
    return fetch(BaseAjaxConfig.host + '/api/v1/users', {
      method: 'POST',
      headers: BaseAjaxConfig.headers,
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(
        json => {
          return json;
        },
        err => {}, //console.log(err)
      );
  },
  userSignIn: data => {
    return fetch(BaseAjaxConfig.host + '/api/v1/users/login', {
      method: 'POST',
      headers: BaseAjaxConfig.headers,
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(
        json => {
          return json;
        },
        err => {
          console.log(err);
        }, //console.log(err)
      )
      .catch(err => console.log(err));
  },
  imageUpload: (path, formData) => {
    let headers = Object.assign({}, BaseAjaxConfig.headers);
    delete headers['Content-Type'];
    return fetch(BaseAjaxConfig.host + path, {
      method: 'POST',
      headers,
      body: formData,
    })
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(
        json => {
          return json;
        },
        err => {}, //console.log(err)
      );
  },
  userProfileUpdate: data => {
    //console.log(BaseAjaxConfig.headers, data);
    return fetch(BaseAjaxConfig.host + '/api/v1/users/detail', {
      method: 'POST',
      headers: BaseAjaxConfig.headers,
      body: JSON.stringify(data),
    })
      .then(response => {
        //console.log(response);
        if (response) {
          return response.json();
        }
      })
      .then(
        json => {
          return json;
        },
        err => {}, //console.log(err)
      );
  },
  forgotPassword: data => {
    return fetch(BaseAjaxConfig.host + '/api/v1/users/forgot-password', {
      method: 'POST',
      headers: BaseAjaxConfig.headers,
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(
        json => {
          return json;
        },
        err => {}, //console.log(err)
      );
  },
  getSortedRestaurants: (data, sortBy) => {
    let sortKey = Object.keys(sortBy)[0];
    return data.sort((a, b) => {
      switch (sortKey) {
        case 'location':
          if (sortBy[sortKey] === 'near') {
            return a.distance - b.distance;
          } else {
            return b.distance - a.distance;
          }
          break;

        case 'rating':
          if (sortBy[sortKey] === 'low') {
            return a.rating - b.rating;
          } else {
            return b.rating - a.rating;
          }
          break;

        case 'restaurant':
          if (sortBy[sortKey] === 'ascending') {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
          } else {
            if (a.title < b.title) return 1;
            if (a.title > b.title) return -1;
            return 0;
          }
          break;

        default:
          return 1;
      }
    });
  },
  getSortedReviews: (data, sortBy) => {
    let sortKey = Object.keys(sortBy)[0];
    return data.sort((a, b) => {
      switch (sortKey) {
        case 'updates':
          if (sortBy[sortKey] === 'latest') {
            return (
              new Date(b.zirafer.updatedDate).getTime() -
              new Date(a.zirafer.updatedDate).getTime()
            );
          } else {
            return (
              new Date(a.zirafer.updatedDate).getTime() -
              new Date(b.zirafer.updatedDate).getTime()
            );
          }
          break;

        case 'rating':
          if (sortBy[sortKey] === 'low') {
            return a.rating - b.rating;
          } else {
            return b.rating - a.rating;
          }
          break;

        case 'name':
          if (sortBy[sortKey] === 'ascending') {
            if (a.zirafer.displayName < b.zirafer.displayName) return -1;
            if (a.zirafer.displayName > b.zirafer.displayName) return 1;
            return 0;
          } else {
            if (a.zirafer.displayName < b.zirafer.displayName) return 1;
            if (a.zirafer.displayName > b.zirafer.displayName) return -1;
            return 0;
          }
          break;

        default:
          return 1;
      }
    });
  },
  getAllRestaurantsSimple: () => {
    return fetch(BaseAjaxConfig.host + '/api/v1/restaurants/simple', {
      method: 'GET',
      headers: BaseAjaxConfig.headers,
    })
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(
        json => {
          return json;
        },
        err => {}, //console.log(err)
      );
  },
  fetchZiraferPendingReviews: id => {
    return fetch(
      BaseAjaxConfig.host + '/api/v1/reviews/ziraferPendingReviews/' + id,
      {
        method: 'GET',
        headers: BaseAjaxConfig.headers,
      },
    )
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(
        json => {
          return json;
        },
        err => {}, //console.log(err)
      );
  },
};

module.exports = utils;
