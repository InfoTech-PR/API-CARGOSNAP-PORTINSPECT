import { Request, Response } from "express";
import { cargosnapRequest } from "../services/cargosnapService";

//GET
export const getFiles = async (req: Request, res: Response) => {
  try {
    const data = await cargosnapRequest("/files", "GET");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//GET
export const getFilesById = async (req: Request, res: Response) => {}
//POST
export const setFiles = async (req: Request, res: Response) => {}
//PATCH
export const closeFilesById = async (req: Request, res: Response) => {}
//DELETE
export const deleteFilesById = async (req: Request, res: Response) => {}
//POST
export const uploadsFiles = async (req: Request, res: Response) => {}
//POST
export const fieldsFiles = async (req: Request, res: Response) => {}
//POST
export const reportsFiles = async (req: Request, res: Response) => {}
//GET
export const shareFiles = async (req: Request, res: Response) => {}
//GET
export const formsFilesById = async (req: Request, res: Response) => {}
