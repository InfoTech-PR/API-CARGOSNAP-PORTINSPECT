import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";

dotenv.config();

const CARGOSNAP_API_URL = "https://api.cargosnap.com/api/v2/";
const API_TOKEN = process.env.CARGOSNAP_API_KEY;

/*✅*/ export const setFiles = async (req: Request, res: Response) => {
  try {
    const { reference, close = "false", location } = req.body;

    if (!reference || typeof reference !== "string" || reference.length > 255) {
      return res.status(400).json({ response: "failed", status: "Invalid reference provided" });
    }

    const params = new URLSearchParams({
      token: API_TOKEN!,
      reference,
      close: close.toString(),
    });

    if (location) {
      params.append("location", location.toString());
    }

    const response = await axios.post(`${CARGOSNAP_API_URL}/files?${params.toString()}`);
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "failed", status: "Internal server error" });
  }
};

/*✅*/ export const getFiles = async (req: Request, res: Response) => {
  try {
    const {
      reference,
      find,
      closed,
      startdate,
      enddate,
      updated_start,
      updated_end,
      limit,
      include,
      field_id,
    } = req.body;

    const filteredParams: any = {};
    Object.entries(req.body).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        filteredParams[key] = value;
      }
    });

    const params = new URLSearchParams({
      token: API_TOKEN,
      ...filteredParams,
    });

    const response = await axios.get(`${CARGOSNAP_API_URL}/files?${params.toString()}`);
    res.json(response.data.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/*✅*/ export const getFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "O ID do arquivo é obrigatório." });

    const params = new URLSearchParams({
      token: API_TOKEN!,
    });

    const response = await axios.get(`${CARGOSNAP_API_URL}/files/${id}?${params.toString()}`);
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/*✅*/ export const closeFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "O ID do arquivo é obrigatório." });

    const params = new URLSearchParams({
      token: API_TOKEN!,
    });

    const response = await axios.patch(
      `${CARGOSNAP_API_URL}/files/${id}/close?${params.toString()}`, // Adicionando o token na URL
      {}
    );

    res.json(response.data);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

/*✅*/ export const deleteFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "O ID do arquivo é obrigatório." });
    }

    const params = new URLSearchParams({
      token: API_TOKEN!,
    });

    const response = await axios.delete(`${CARGOSNAP_API_URL}/files/${id}?${params.toString()}`);

    if (!response.data || Object.keys(response.data).length === 0) {
      return res.status(404).json({ message: "Arquivo não encontrado ou já deletado." });
    }

    res.json({ message: "Arquivo deletado com sucesso.", data: response.data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/*✅*/ export const uploadsFiles = async (req: Request, res: Response) => {
  try {
    const { reference, include_in_share = "false", location } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!reference || typeof reference !== "string" || reference.length > 255) {
      return res.status(400).json({ response: "failed", status: "Invalid reference provided" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ response: "failed", status: "No files uploaded" });
    }

    const formData = new FormData();
    formData.append("reference", reference);
    formData.append("include_in_share", include_in_share.toString());

    if (location) {
      formData.append("location", location.toString());
    }

    for (const file of files) {
      formData.append("uploads[]", fs.createReadStream(file.path), file.originalname);
    }

    const response = await axios.post(`${CARGOSNAP_API_URL}/uploads?token=${API_TOKEN}`, formData, {
      headers: formData.getHeaders(),
    });

    return res.json(response.data);
  } catch (error: any) {
    return res.status(500).json({ response: "failed", status: "Internal server error" });
  }
};

/*✅*/ export const fieldsFiles = async (req: Request, res: Response) => {
  try {
    const { reference, fields } = req.body;

    if (!reference) {
      return res.status(400).json({ message: "O campo referência é obrigatório." });
    }

    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ message: "Os campos são obrigatórios e devem estar em um array." });
    }

    const response = await axios.post(
      `${CARGOSNAP_API_URL}/fields/${reference}?token=${API_TOKEN}`,
      fields,
      { headers: { "Content-Type": "application/json" } }
    );

    res.json(response.data);
  } catch (error: any) {
    return res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
};

/*✅*/ export const reportsFiles = async (req: Request, res: Response) => {
  try {
    const { files, template, filename, settings, asynchronous } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "O campo 'files' é obrigatório e deve ser um array!" });
    }

    const requestData = {
      files,
      ...(template && { template }),
      ...(filename && { filename }),
      ...(asynchronous !== undefined && { asynchronous }),
      ...(settings && { settings }),
    };

    const response = await axios.post(
      `${CARGOSNAP_API_URL}/reports?token=${API_TOKEN}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.status(201).json(response.data);
  } catch (error: any) {
    console.error("Erro ao gerar relatório:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Erro interno no servidor" });
  }
};

/*⚠️*/ export const shareFiles = async (req: Request, res: Response) => {
  try {
    const { reference, expires, language, dl, email, send_email } = req.body;
    if (!reference) return res.status(400).json({ error: "O campo reference é obrigatório!" });

    const params = new URLSearchParams({
      token: API_TOKEN!,
      reference,
      expires,
      language,
      dl,
      email,
      send_email,
    });

    const response = await axios.post(`${CARGOSNAP_API_URL}/shares?${params.toString()}`); // 🔄 Correção
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/*⚠️*/ export const formsFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "O ID do arquivo é obrigatório." });

    const params = new URLSearchParams({
      token: API_TOKEN!,
      ...req.body, // Mantendo os outros filtros
    });

    const response = await axios.get(`${CARGOSNAP_API_URL}/forms/${id}?${params.toString()}`); // 🔄 Correção
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
