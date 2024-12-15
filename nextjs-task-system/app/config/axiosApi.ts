import axios from "axios";


export const axiosApi= axios.create({
        baseURL: 'http://localhost:3000/api',
        timeout: 12000,
        headers: {
            "Content-Type": 'application/json',
        }
});