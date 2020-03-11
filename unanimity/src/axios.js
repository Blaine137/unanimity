import Axios from 'axios';
const token = {

    user: "iKyUinRauGTi1n9roPQ4NFFo79Z2",
    password: "Un@n1m1tyDB"

};
const instance = Axios.create ( {
    baseURL: 'https://unanimity-c1aa9.firebaseio.com/'
   
} );
console.log(Axios.defaults.headers.common)
Axios.defaults.headers.common['Authorization'] = token;
// Add a request interceptor
/*Axios.interceptors.request.use(function (config) {

    config.headers.Authorization =  token;

    return config;

});*/

export default instance;