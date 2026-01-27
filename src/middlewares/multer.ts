import multer from "multer";
import path from "path";
import fs from "fs";

// storage dinamis
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.originalUrl.includes("/thread")) {
      const dir = "uploads/threads";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } else if (req.originalUrl.includes("/reply")) {
      const dir = "uploads/replies";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } else if (req.originalUrl.includes("/profile")) {
      const dir = "uploads/profile";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } else {
      const dir = "uploads/others";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    }
  },
  filename: (req, file, cb) => {
    // simpan dengan timestamp + ekstensi asli
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
