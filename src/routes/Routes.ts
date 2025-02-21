import { Router } from "express";
import cors from "cors";
import * as cargosnapController from "../controllers/cargosnapController";

const router = Router();

router.get("/arquivos", cargosnapController.getArquivos);
router.post("/novo-recurso", cargosnapController.createRecurso);

export default router;