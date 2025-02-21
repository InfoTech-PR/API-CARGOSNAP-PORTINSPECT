import { Router } from "express";
import * as cargosnapController from "../controllers/cargosnapController";

const router = Router();

router.get("/getFiles", cargosnapController.getFiles);
router.get("/getFilesById/", cargosnapController.getFilesById);
router.post("/setFiles", cargosnapController.setFiles);
router.patch("/closeFilesById", cargosnapController.closeFilesById);
router.delete("/deleteFilesById", cargosnapController.deleteFilesById);
router.post("/uploadsFiles", cargosnapController.uploadsFiles);
router.post("/fieldsFiles", cargosnapController.fieldsFiles);
router.post("/reportsFiles", cargosnapController.reportsFiles);
router.get("/shareFiles", cargosnapController.shareFiles);
router.get("/formsFilesById", cargosnapController.formsFilesById);

export default router;