import express from "express";
import {getTut,addTut,deleteTut,updateTut} from "../controller/tutcontroller.js";

const router = express.Router();

router.get("/tutorials",getTut);
router.post("/tutorials",addTut);
router.delete("/tutorials/:id",deleteTut);
router.put("/tutorials/:id", updateTut);

export default router;
