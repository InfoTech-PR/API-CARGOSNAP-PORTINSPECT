import { Router } from "express";
import * as cargosnapController from "../controllers/cargosnapController";

const router = Router();

router.get("/getArquivos", cargosnapController.getArquivos);
router.post("/createRecurso", cargosnapController.createRecurso);

export default router;