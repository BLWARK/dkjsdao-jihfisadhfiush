"use client";
import axios from "axios";

const getToken = () => {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const customAxios = axios.create({
    baseURL: "https://apip2e.xyzmercoin.xyz",
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });


export async function customGet(endpoint, options = {}) {
    try {
      const res = await customAxios.get(endpoint, options);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  export async function customPost(endpoint, data = {}, options = {}) {
    try {
      const res = await customAxios.post(endpoint, data, options);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  export async function customPut(endpoint, data = {}, options = {}) {
    try {
      const res = await customAxios.put(endpoint, data, options);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  
