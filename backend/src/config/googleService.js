import { google } from 'googleapis';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import streamifier from 'streamifier';  // Importa streamifier

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json');

const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|pdf/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(new Error('Solo se permiten archivos JPEG, JPG, PNG o PDF'));
    }
  });

export { drive, upload, streamifier };  