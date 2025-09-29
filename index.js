import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// 🔑 Configure suas credenciais do Mercado Livre
const CLIENT_ID = "5602424829880967";
const CLIENT_SECRET = "eSfqfKS86yvtx9WoMHqYgHvMtZK2Ifrv";
const REDIRECT_URI = "https://falcotestes.loca.lt/callback"; // a mesma que você cadastrou no ML

// 1. Inicia o fluxo OAuth
app.get("/login", (req, res) => {
  const url = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(url);
});

// 2. Recebe o "code" e troca por um Access Token
app.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post("https://api.mercadolibre.com/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("✅ Token recebido:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Erro no callback:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// 3. Recebe notificações do Mercado Livre (Webhook)
app.post("/notificacoes", (req, res) => {
  console.log("📩 Notificação recebida:", req.body);

  // sempre responder 200, senão o ML tenta reenviar
  res.sendStatus(200);
});

// Start do servidor
app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
  console.log("👉 Acesse http://localhost:3000/login para iniciar o OAuth");
});
