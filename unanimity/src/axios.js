import Axios from 'axios';
 const token = {
     "uid": "ee8b580c09f3-408a-b054"
     
 };
const instance = Axios.create ( {
    baseURL: 'https://unanimity-c1aa9.firebaseio.com/'
   
} );
// console.log('before: ', instance.defaults.headers.common)
// instance.defaults.headers.common['auth'] = token; 
// console.log('after: ', instance.defaults.headers.common['auth'].uid)
// Add a request interceptor
/*Axios.interceptors.request.use(function (config) {

    config.headers.Authorization =  token;

    return config;

});*/

export default instance;