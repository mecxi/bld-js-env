/*export default function getBaseURL(){
  const inDevelopment = window.location.hostname === '192.168.1.159';
  return inDevelopment ? 'http://192.168.1.159:2100/': '/';
} */

/* to switch between our production api and our mockapi */
export default function getBaseURL(){
  return getQueryStringParameterByName('useMockApi') ? 'http://192.168.1.159:2100/' : 'https://polar-savannah-26307.herokuapp.com/';
}

function getQueryStringParameterByName(name, url){
  if (!url) url = window.location.href;
  name = name.replace(/[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


