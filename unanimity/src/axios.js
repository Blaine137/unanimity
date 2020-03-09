import Axios from 'axios';

const instance = Axios.create ( {
    baseURL: 'https://unanimity-c1aa9.firebaseio.com/'
} );

export default instance;