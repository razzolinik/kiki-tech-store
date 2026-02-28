const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MercadoPagoConfig, Preference } = require("mercadopago");

const connectDB = require("./db");
const productRoutes = require("./routes/products");
const collectionRoutes = require("./routes/collections");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Configuración MercadoPago ────────────────────────────────────────────────
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// ── Conectar MongoDB ─────────────────────────────────────────────────────────
connectDB();

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  methods: ["GET", "POST"],
}));
app.use(express.json());

// ── Rutas API ────────────────────────────────────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/collections", collectionRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Kiki server corriendo 🐱" });
});

// ── Crear preferencia de pago ─────────────────────────────────────────────────
app.post("/create_preference", async (req, res) => {
  try {
    const { items, payer } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    const mpItems = items.map((item) => ({
      id: item.id,
      title: item.name,
      quantity: Number(item.quantity),
      unit_price: Number(item.discountedPrice ?? item.price),
      currency_id: "ARS",
      picture_url: item.image ?? "",
    }));

    const preferenceData = {
      items: mpItems,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pago/success`,
        failure: `${process.env.FRONTEND_URL}/pago/failure`,
        pending: `${process.env.FRONTEND_URL}/pago/pending`,
      },
      auto_return: "approved",
      ...(payer?.email && {
        payer: { email: payer.email },
      }),
      external_reference: `kiki-${Date.now()}`,
    };

    const preference = new Preference(client);
    const response = await preference.create({ body: preferenceData });

    res.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });

  } catch (error) {
    console.error("Error creando preferencia MP:", error);
    res.status(500).json({ error: "Error al crear la preferencia de pago" });
  }
});

app.listen(PORT, () => {
  console.log(`🐱 Kiki server escuchando en http://localhost:${PORT}`);
});