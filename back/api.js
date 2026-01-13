import "dotenv/config";
import express from "express";
import cors from "cors";
import sendMail from "./mail.js";
import multer from "multer";

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));  // Para forms

app.get("/", (req, res) => res.json({ status: "OK" }));

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });  // 5MB

app.post("/send", upload.single("anexo"), async (req, res) => {
  const { email, nome, message: message } = req.body
  const anexo = req.file;

  if (!email || !nome || !message) {
    return res.status(400).json({ error: "Faltam campos obrigatórios" });
  }

  try {
    const response = await sendMail(email, nome, message, anexo);
    res.json({ message: "Email enviado!", response });
    console.log("Email enviado:", response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Falha ao enviar email", details: error.message });
  }
});

app.listen(process.env.PORT || 3030, () => console.log("API rodando em http://localhost:3030"));
