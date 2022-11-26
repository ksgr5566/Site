import axios from 'axios';

const REFRESH_URL = '/api/user/refresh';
const PID_URL = '/api/pid';

const getToken = async () => {
    try {
        const response = await axios.get(REFRESH_URL)
        const accessToken = response?.data?.accessToken;
        const user = response?.data?.username;
        return { accessToken, user }   
    } catch (error) {
        console.log(error)
    }
}

const getPids = async () => {
    try {
        const { accessToken } = await getToken();
        const response = await axios.get(PID_URL, { headers: {"Authorization" : `Bearer ${accessToken}`} })
        return { ...response?.data }
    } catch (e) {
        console.log(e)
    }
}
    
export { getToken, getPids };