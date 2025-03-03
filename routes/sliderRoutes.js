import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Slider from "../models/sliderModel.js";  // Assuming you have a `Slider` model

const router = express.Router();

// Set up multer storage for uploading images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "slider");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Store with a unique timestamp
  },
});

const upload = multer({ storage });

// Define POST route for image upload
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded!" });
  }

  try {
    const newSlider = new Slider({
      imagePath: `/uploads/slider/${req.file.filename}`,
    });
    await newSlider.save();
    
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imagePath: newSlider.imagePath,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving image." });
  }
});

// Define GET route to fetch images
router.get("/", async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.json({ success: true, images: sliders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching slider images." });
  }
});




// DELETE route for removing a slider image
// DELETE image by ID
router.delete("/:id", async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({ success: false, message: "Slider image not found" });
    }

    // Remove image from uploads folder
    const imagePath = path.join(process.cwd(), slider.imagePath);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete from database
    await Slider.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Slider image deleted successfully" });
  } catch (error) {
    console.error("Error deleting slider image:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
