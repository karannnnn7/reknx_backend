import { Portfolio } from "../models/portfolio.model.js";
import { uploadOnCloudinary, replaceOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

const createPortfolio = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { title, discription, rating } = req.body;

    if (!title || !discription || !rating) {
      return res.status(400).json({
        success: false,
        message: "all fileds are required",
      });
    }

    const imgpath = req.files?.img[0]?.path;
    if (!imgpath) {
      return res.status(400).json({
        success: false,
        message: "img is required",
      });
    }

    const img = await uploadOnCloudinary(imgpath, "portfolio");
    if (!img) {
      return res.status(500).json({
        success: false,
        message: "failed to upload photo",
      });
    }

    const portfolio = await Portfolio.create({
      title,
      discription,
      img: img.url,
      rating,
    });

    if (!portfolio) {
      return res.status(500).json({
        success: false,
        message: "failed to create portfolio",
      });
    }

    return res.status(200).json({
      success: false,
      message: "portfollio added",
      data: portfolio,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "failed to create portfolio catch block",
    });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;
    const { title, discription, rating } = req.body;

    const imgpath = req.files?.img[0]?.path;
    if (!imgpath) {
      return res.status(400).json({
        success: false,
        message: "img is required",
      });
    }
    const oldimg = await Portfolio.findById(id)
    const newimg = await replaceOnCloudinary(imgpath, oldimg.img, "portfolio");
    if (!newimg) {
      return res.status(500).json({
        success: false,
        message: "failed to upload image",
      });
    }

    const portfolio = await Portfolio.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          discription,
          img: newimg.url,
          rating,
        },
      },
      { new: true }
    );

    if (!portfolio) {
      return res.status(500).json({
        success: false,
        message: "failed to create portfolio",
      });
    }

    return res.status(200).json({
      success: false,
      message: "portfollio updated",
      data: portfolio,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "failed to update portfolio catch block",
    });
  }
};

const getAllPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "failed to get portfolio",
    });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolio = await Portfolio.findById(id);
    if (!portfolio) {
      return res.status(400).json({
        success: false,
        message: "portfolio not found",
      });
    }

    await deleteOnCloudinary(portfolio.img);
    await Portfolio.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "portfolio deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "failed to delete portfolio",
    });
  }
};

export {
  createPortfolio,
  updatePortfolio,
  getAllPortfolio,
  deletePortfolio,
};
