import { Router } from "express";
import * as cargosnapController from "../controllers/cargosnapController";

const router = Router();

router.get("/getFiles", cargosnapController.getFiles);
router.get("/getFilesById/:id", cargosnapController.getFilesById);
router.post("/setFiles", cargosnapController.setFiles);
router.patch("/closeFilesById/:id/close", cargosnapController.closeFilesById);
router.delete("/deleteFilesById/:id", cargosnapController.deleteFilesById);
router.post("/uploadsFiles", cargosnapController.uploadsFiles);
router.post("/fieldsFiles/:reference", cargosnapController.fieldsFiles);
router.post("/reportsFiles", cargosnapController.reportsFiles);
router.get("/shareFiles", cargosnapController.shareFiles);
router.get("/formsFilesById/:id/forms", cargosnapController.formsFilesById);

export default router;