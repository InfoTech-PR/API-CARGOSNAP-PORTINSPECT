import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.CARGOSNAP_URL || "";
const API_KEY = process.env.CARGOSNAP_API_KEY || "";

const cargosnapRequest = async (endpoint: string, method: "GET" | "POST", data?: any) => {
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


export const getArquivos = async (req: Request, res: Response) => {
  try {
    const data = await cargosnapRequest("/files", "GET");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createRecurso = async (req: Request, res: Response) => {
  try {
    const { nome, descricao } = req.body;
    const data = await cargosnapRequest("/create-resource", "POST", { nome, descricao });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
