import axios from 'axios';
// import { toast } from 'react-toastify';

// const IP_PORT = process.env.NODE_PROD_URL
const dev = "http://localhost:5000/api/v1/";
const prod = process.env.REACT_APP_PRODUCTION_SERVER;

const baseURL = prod;

const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  export const axiosAuthClient  = axios.create({
    baseURL: baseURL,
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  export default axiosClient;