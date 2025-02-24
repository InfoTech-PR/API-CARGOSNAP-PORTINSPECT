import { Request, Response } from "express";
import { cargosnapRequest } from "../services/cargosnapService";

export const getFiles = async (req: Request, res: Response) => {
  try {
    const data = await cargosnapRequest("/files", "GET");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "O ID do arquivo é obrigatório."});
    
    const data = await cargosnapRequest(`/files/${id}`, "GET");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const setFiles = async (req: Request, res: Response) => {
  try {
    const { reference, close, location } = req.body;
    if (!reference) return res.status(400).json({ error: "O campo refencia é obrigatório!"});

    const data = await cargosnapRequest(`/files`, "POST", {
      reference,
      close: close ?? false,
      location,
    });
    res.json(data);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const closeFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "O ID do arquivo é obrigatório." });

    const data = await cargosnapRequest(`/files/${id}/close`, "PATCH");
    res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const deleteFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "O ID do arquivo é obrigatório." });

    const data = await cargosnapRequest(`/files/${id}`, "DELETE");
    res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export const uploadsFiles = async (req: Request, res: Response) => {
  try {
    const { reference, uploads, include_in_share, location } = req.body;
    if (!reference) return res.status(400).json({ message: "O campo referência é obrigatório." });

    const data = await cargosnapRequest(`/files`, "POST", {
      reference,
      uploads,
      include_in_share,
      location,      
    });
    res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export const fieldsFiles = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;
    if (!reference) return res.status(400).json({ message: "O campo referência é obrigatório." });

    const data = await cargosnapRequest(`/fields/${reference}`, "POST");
    res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export const reportsFiles = async (req: Request, res: Response) => {
  try {
    const { files, template, filename, settings, asynchronous } = req.body;
    if (!files) return res.status(400).json({ error: "O campo files é obrigatório!"});

    const data = await cargosnapRequest(`/reports`, "POST", {
      files,
      template,
      filename,
      settings,
      asynchronous
    });
    res.json(data);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

//GET
export const shareFiles = async (req: Request, res: Response) => {}
//GET
export const formsFilesById = async (req: Request, res: Response) => {}
