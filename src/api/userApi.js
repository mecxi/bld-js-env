import 'whatwg-fetch';
/* import this polyfill package to make sure that fetch can run on all browsers that doesn't
 support fetch natively */

import getBaseURL from './baseURL';

const baseUrl = getBaseURL();

//console.log('window.location.hostname', window.location.hostname);

/* make this function public by including export */
export function getUsers(){
  return get('users');
}

/* delete a user */
export function deleteUser(id){
  return del(`users/${id}`);
}

/* all others functions defined below are private */
function get(url){
  return fetch(baseUrl + url).then(onSuccess, onError);
}

function del(url){
  const request = new Request(baseUrl+ url, {
    method: 'DELETE'
  });
  return fetch(request).then(onSuccess, onError);
}

function onSuccess(response){
  return response.json();
}

function onError(error){
  console.log(error); //eslint-disable-line no-console
}

