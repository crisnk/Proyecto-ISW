"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import { createUsers, crearEspecialidades, crearCursos, crearProfesores, crearMaterias, crearImparticiones, crearAtrasos, crearJustificativos } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { Server } from 'socket.io';
import { createServer } from 'http';
import { addUser, removeUser } from './services/socket.service.js';

async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");
    app.use(
      cors({
        credentials: true,
        origin: true,
      }),
    );

    app.use(
      urlencoded({
        extended: true,
        limit: "1mb",
      }),
    );

    app.use(
      json({
        limit: "1mb",
      }),
    );

    app.use(cookieParser());

    app.use(morgan("dev"));

    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        },
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passportJwtSetup();
    app.use("/api", indexRoutes);

    const httpServer = createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: true,
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log("Usuario conectado:", socket.id);
      
      socket.on('register-user', (rut) => {
        addUser(rut, socket.id);
      });
    
      socket.on('disconnect', (reason) => {
        console.log("Usuario desconectado:", reason);
        removeUser(socket.id);
      });
    });
 
    app.set('socketio', io);

    httpServer.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer(), el error es: ", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();
    await crearProfesores();
    await crearCursos();
    await createUsers(); 
    await crearEspecialidades();
    await crearMaterias();
    await crearImparticiones();
    await crearAtrasos();
    await setupServer();
    await crearJustificativos();
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error),
  );