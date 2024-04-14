import axios from 'axios';

//https://economia.awesomeapi.com.br/json/all

export const api = axios.create({
    baseURL: 'https://economia.awesomeapi.com.br/json/'
})