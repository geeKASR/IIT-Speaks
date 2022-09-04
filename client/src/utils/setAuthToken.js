import axios from 'axios'

const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        console.log('deleting');
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;