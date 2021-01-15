import Axios from 'axios';

const instance = Axios.create({ baseURL: 'https://unanimity-8d56c.firebaseio.com/' });
export default instance;
