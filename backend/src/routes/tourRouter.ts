import express from "express";
import * as toursController from "../controllers/tourController";

const router = express.Router();

router.get("/", toursController.getTours);
// router.get('/:id', toursController.getTourById);
router.post("/", toursController.createTour);
router.put("/:id", toursController.updateTour);
router.delete("/:id", toursController.deleteTour);

export default router;
