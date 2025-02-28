import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";

dotenv.config();

const CARGOSNAP_API_URL = "https://api.cargosnap.com/api/v2/files";
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

    const response = await axios.post(`${CARGOSNAP_API_URL}?${params.toString()}`);
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

    const response = await axios.get(`${CARGOSNAP_API_URL}?${params.toString()}`);
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

    const response = await axios.get(`${CARGOSNAP_API_URL}/${id}?${params.toString()}`);
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/*⚠️*/ export const closeFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "O ID do arquivo é obrigatório." });
    const params = new URLSearchParams({
      token: API_TOKEN!,
    });

    const response = await axios.patch(`${CARGOSNAP_API_URL}/${id}?${params.toString()}`);
    res.json(response.data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
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

    const response = await axios.delete(`${CARGOSNAP_API_URL}/${id}?${params.toString()}`);

    if (!response.data || Object.keys(response.data).length === 0) {
      return res.status(404).json({ message: "Arquivo não encontrado ou já deletado." });
    }

    res.json({ message: "Arquivo deletado com sucesso.", data: response.data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/*⚠️*/ export const uploadsFiles = async (req: Request, res: Response) => {
  try {
    const { reference, include_in_share, location } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!reference) return res.status(400).json({ message: "O campo referência é obrigatório." });

    const formData = new FormData();
    formData.append("reference", reference);
    formData.append("include_in_share", include_in_share ? "1" : "0");
    if (location) {
      formData.append("location", location.toString());
    }

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("uploads[]", fs.createReadStream(file.path), file.originalname);
      });
    }

    const response = await axios.post(`${CARGOSNAP_API_URL}`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${API_TOKEN!}`,
      },
    });

    res.json(response.data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/*⚠️*/ export const fieldsFiles = async (req: Request, res: Response) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ message: "O campo referência é obrigatório." });
    const params = new URLSearchParams({
      token: API_TOKEN!,
      reference,
    });

    const response = await axios.post(`${CARGOSNAP_API_URL}?${params.toString()}`);
    res.json(response.data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

/*⚠️*/ export const reportsFiles = async (req: Request, res: Response) => {
  try {
    const { files, template, filename, settings, asynchronous } = req.body;
    if (!files) return res.status(400).json({ error: "O campo files é obrigatório!" });

    const params = new URLSearchParams({
      token: API_TOKEN!,
      files,
      template,
      filename,
      settings,
      asynchronous
    });

    const response = await axios.post(`${CARGOSNAP_API_URL}?${params.toString()}`);
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/*⚠️*/ export const shareFiles = async (req: Request, res: Response) => {
  try {
    const { reference, expires, language, dl, email, send_email } = req.body;
    if (!reference) return res.status(400).json({ error: "O campo reference é obrigatório!" });

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

    const response = await axios.get(`${CARGOSNAP_API_URL}?${params.toString()}`);
    res.json(response.data.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/*⚠️*/ export const formsFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reference, startdate, enddate, updated_start, updated_end, Limt } = req.body;
    if (!id) return res.status(400).json({ error: "O ID do arquivo é obrigatório." });

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

    const response = await axios.get(`${CARGOSNAP_API_URL}?${params.toString()}`);
    res.json(response.data.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}