import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

export const setAccessToken = async (accessToken:string) => {
  if (!accessToken) {
    return false;
  }

  try {
    await AsyncStorage.setItem('accessToken', accessToken);
    addTokenToAxios(accessToken);
    return true;
  } catch (error) {
    console.log('Lỗi khi lưu token', error);
    return false;
  }
};

export const getAccessToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return accessToken;
  } catch (error) {
    console.log('Lỗi khi lấy token', error);
    return false;
  }
};

export const addTokenToAxios = (accessToken: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    axios.interceptors.request.use(
      function (config) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      },
      function (error) {
        reject(error);
        return Promise.reject(error);
      }
    );
    resolve();
  });
};

export const removeAccessToken = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    axios.defaults.headers.common["Authorization"] = null;
  } catch (error) {
    console.log('Lỗi khi xoá token', error);
    return false;
  }
};
