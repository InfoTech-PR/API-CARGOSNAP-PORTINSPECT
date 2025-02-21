import { Router } from "express";
import cargosnapRoutes from "./cargosnapRoutes";

const router = Router();

router.use("/cargosnap", cargosnapRoutes);

export default router;
