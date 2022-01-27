import axios, { AxiosResponse } from "axios";
import {store} from '../redux/store';

class ApiAxios {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getToken():string {
        const {access_token} = store.getState().auth;
        //useSelector<any, string>(state => state.access_token);
       

        return access_token;
    }

    getAuth(route: string, cancelToken: any=undefined) :Promise<AxiosResponse>   {

        return axios.get(`${this.baseUrl}${route}`, {
            headers: {
              'Authorization': `Bearer ${this.getToken()}` 
            },
            cancelToken: cancelToken
          });
    }

    get(route: string, cancelToken: any=undefined) :Promise<AxiosResponse>    {
        return axios.get(`${this.baseUrl}${route}`);
    }

    postAuth(route: string, data: any, cancelToken: any=undefined) :Promise<AxiosResponse>  {
        return axios.post(`${this.baseUrl}${route}`, data, {
            headers: {
              'Authorization': `Bearer ${this.getToken()}` 
            },
            cancelToken: cancelToken
          });
    }

    post(route: string, data: any, cancelToken: any=undefined) :Promise<AxiosResponse>    {
        return axios.post(`${this.baseUrl}${route}`, data, {
            cancelToken: cancelToken
        });
    }

    patchAuth(route: string, data: any, cancelToken: any=undefined) :Promise<AxiosResponse>   {
        return axios.patch(`${this.baseUrl}${route}`, data, {
            headers: {
              'Authorization': `Bearer ${this.getToken()}` 
            },
            cancelToken: cancelToken
          });
    }

    patch(route: string, data: any, cancelToken: any=undefined) :Promise<AxiosResponse>   {
        return axios.patch(`${this.baseUrl}${route}`, data,
            {
                cancelToken: cancelToken
            });
    }

    delete(route: string, cancelToken: any=undefined) :Promise<AxiosResponse>    {
        return axios.delete(`${this.baseUrl}${route}`, {
            cancelToken: cancelToken
        });
    }

    deleteAuth(route: string, cancelToken: any=undefined) :Promise<AxiosResponse>  {
        return axios.delete(`${this.baseUrl}${route}`,{
            headers: {
              'Authorization': `Bearer ${this.getToken()}` 
            },
            cancelToken: cancelToken
          });
    }
}

let url = "http://localhost:3000";
if(process.env.NODE_ENV === 'production') {
    url = "https://nest-mywallet.herokuapp.com";
}

let apiAxios = new ApiAxios(url);
export {apiAxios, ApiAxios};