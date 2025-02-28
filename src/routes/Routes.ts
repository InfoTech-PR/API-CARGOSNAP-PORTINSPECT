import { Router } from "express";
import multer from "multer";
import * as cargosnapController from "../controllers/cargosnapController";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/files", cargosnapController.setFiles);
router.get("/files", cargosnapController.getFiles);
router.get("/files/:id", cargosnapController.getFilesById);
router.patch("/files/:id/close", cargosnapController.closeFilesById);
router.delete("/files/:id/delete", cargosnapController.deleteFilesById);
router.post("/uploads", upload.array("uploads", 10), cargosnapController.uploadsFiles);
router.post("/fields", cargosnapController.fieldsFiles);
router.post("/reports", cargosnapController.reportsFiles);
router.get("/share", cargosnapController.shareFiles);
router.get("/forms/:id", cargosnapController.formsFilesById);

export default router;
