import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.CARGOSNAP_URL;
const API_KEY = process.env.CARGOSNAP_API_KEY;

export const cargosnapRequest = async (endpoint: string, method: "GET" | "POST" | "PATCH" | "DELETE", data?: any) => {
  try {
    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      data: method === "POST" ? data : null,
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro na requisição:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro na API do Cargosnap");
  }
};
