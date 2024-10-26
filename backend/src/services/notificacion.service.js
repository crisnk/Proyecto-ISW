"use strict";
import nodemailer from "nodemailer";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NOTIFICATION_EMAIL,
        pass: process.env.NOTIFICATION_PASSWORD
    }
});

export const sendNotificacion = async (rut, subject, mensaje) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ rut });

        if (!user || !user.correo) {
            throw new Error("No se encontró el usuario o su correo electrónico");
        }

        await transporter.sendMail({
            from: `"Notificación Liceo" <${process.env.NOTIFICATION_EMAIL}>`,
            to: user.correo,
            subject,
            text: mensaje,
        });

        console.log("Notificación enviada a:", user.correo);
    } catch (error) {
        console.error("Error al enviar la notificación:", error);
    }
};