import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.CARGOSNAP_URL;
const API_TOKEN = process.env.CARGOSNAP_API_KEY;

export const cargosnapRequest = async (
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  params?: any
) => {
  try {
    let url = `${API_URL}${endpoint}?token=${API_TOKEN}`;

    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `&${queryString}`;
    }

    const config: any = {
      url,
      method,
      headers: { "Content-Type": "application/json" },
    };

    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error("Erro na requisição:", error.response?.data || error.message);
    throw new Error(error.response?.data?.status || "Erro na API do Cargosnap");
  }
};