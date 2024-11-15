import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({


  destination: (req, file, cb) => {
   cb(null, "./src/uploads"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
// Configuración del filtro para limitar los tipos de archivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|png/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Solo se permiten archivos PNG y PDF"));  // Error para archivos no permitidos
};

// Configuración de multer
export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Tamaño máximo de archivo: 5MB
    fileFilter: fileFilter
  }).single('documento');  // 'documento' es el campo de archivo esperado en el formulario
  
  // Manejo de error de límite de tamaño de archivo
export const handleFileSizeLimit = (err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "El archivo excede el tamaño máximo permitido de 5MB" });
    }
    next(err);
  };
  