import { api } from "../axios/axios";
export const fetchAllProducts = async () => {
  try {
    const response = await api.get("/products");    
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const fetchAllCategories = async () => {
  try {
    const res = await api.get("/categories");
    return res.data;
  } catch (error) {
    console.error("Error fetching Categories:", error);
    throw error;
  }
};

export const fetchAllPosts = async () => {
  try {
    const res = await api.get("/posts");

    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const fetchPostById = async (id) => {
  try {

    const response = await api.get(`/posts/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};
