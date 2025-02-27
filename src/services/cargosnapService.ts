import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.CARGOSNAP_URL;

export const cargosnapRequest = async (endpoint: string, method: "GET" | "POST" | "PATCH" | "DELETE", params?: any) => {
  try {
    const queryParams = new URLSearchParams(params);
    queryParams.append('token', process.env.CARGOSNAP_API_KEY || '');
    queryParams.append('format', 'json');

    const url = `${API_URL}${endpoint}?${queryParams.toString()}`;
    const response = await axios({
      url,
      method,
      headers: {
        "Content-Type": "application/json",
      },
      data: method === "POST" ? params : null,
    });

    return response.data;
  } catch (error: any) {
    console.error("Erro na requisição:", error.response?.data || error.message);
    throw new Error(error.response?.data?.status || "Erro na API do Cargosnap");
  }
};
