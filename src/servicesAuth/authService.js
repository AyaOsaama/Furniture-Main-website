import { api } from '../axios/axios';
// const   BASE_URL = 'https://furniture-backend-production-8726.up.railway.app';


export const Registration=async (userData)=>{
try{

    const response = await api.post(`/auth/register`, userData);
    return response.data;
}catch(err){
    console.error("Error during registration:", err);   
    throw err;
}
}

export const Login=async (userData)=>{
try{
    const response = await api.post(`/auth/login`, userData);
    return response.data;
}catch(err){
    console.error("Login error:", err.response?.data); 
        throw err.response?.data?.message || "Login failed";
}

}


