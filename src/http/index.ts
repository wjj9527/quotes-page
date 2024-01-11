import Axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { BASE_URL } from '@/global';
const client = Axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
});
export async function request(config: AxiosRequestConfig) {
  // @ts-ignore
  config.headers.projectId = 13;
  try {
    const response = await client.request(config);
    const { data } = response;
    if (data.success !== 1) {
      message.error(data.message);
      return Promise.reject(response);
    }
    return data;
  } catch (err: any) {
    const response = err?.response;
    message.error('网络错误');
    return Promise.reject(response);
  }
}

export const $get = (
  url: string,
  data: any = {},
  config?: AxiosRequestConfig,
) => {
  const method = 'GET';
  const headers =
    {
      'Content-Type': 'application/json',
    } || config?.headers;
  data.projectId = 13;
  const responseType = 'json' || config?.responseType;
  const params = data;
  const axiosConfig = { ...config };
  Object.assign(axiosConfig, { url, method, headers, responseType, params });
  return request(axiosConfig);
};

export const $delete = (
  url: string,
  data: any = {},
  config?: AxiosRequestConfig,
) => {
  const method = 'DELETE';
  const headers =
    {
      'Content-Type': 'application/json',
    } || config?.headers;
  data.projectId = 13;
  const responseType = 'json' || config?.responseType;
  const axiosConfig = { ...config };
  Object.assign(axiosConfig, {
    url,
    method,
    headers,
    responseType,
    params: data,
  });
  return request(axiosConfig);
};
export const $post = (
  url: string,
  data: any = {},
  config?: AxiosRequestConfig,
) => {
  const method = 'POST';
  const headers =
    {
      'Content-Type': 'application/json',
    } || config?.headers;
  data.projectId = 13;
  const responseType = 'json' || config?.responseType;
  const axiosConfig = { ...config };
  Object.assign(axiosConfig, { url, method, headers, responseType, data });
  return request(axiosConfig);
};
export const $put = (
  url: string,
  data: any = {},
  config?: AxiosRequestConfig,
) => {
  const method = 'PUT';
  const headers =
    {
      'Content-Type': 'application/json',
    } || config?.headers;
  data.projectId = 13;
  const responseType = 'json' || config?.responseType;
  const axiosConfig = { ...config };
  Object.assign(axiosConfig, { url, method, headers, responseType, data });
  return request(axiosConfig);
};
