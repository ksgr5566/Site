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

const getItems = async (pid) => {
    try {
        const { accessToken } = await getToken();
        const response = await axios.get(`/api/items?pid=${pid}`, { headers: {"Authorization" : `Bearer ${accessToken}`} })
        return { ...response?.data }
    } catch (e) {
        console.log(e)
    }
}

const getSellQuantity = async (pid, ticker) => {
    try {
        const { accessToken } = await getToken();
        const response = await axios.get(`/api/items/sellquantity?pid=${pid}&ticker=${ticker}`, { headers: {"Authorization" : `Bearer ${accessToken}`} })
        return  response?.data[0].quantity
    } catch (e) {
        console.log(e)
    }
}

const getBuyOrders = async (pid, ticker) => {
    try {
        const { accessToken } = await getToken();
        const response = await axios.get(`/api/items/buyorders?pid=${pid}&ticker=${ticker}`, { headers: {"Authorization" : `Bearer ${accessToken}`} })
        return { ...response?.data }
    } catch (e) {
        console.log(e)
    }
}
    
export { getToken, getPids, getItems, getSellQuantity, getBuyOrders };