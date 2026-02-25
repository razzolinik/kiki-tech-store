const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Configuración MercadoPago ────────────────────────────────────────────────
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  methods: ["GET", "POST"],
}));
app.use(express.json());

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Kiki server corriendo 🐱" });
});

// ── Crear preferencia de pago ─────────────────────────────────────────────────
// El frontend manda los items del carrito y este endpoint crea la preferencia
// en MercadoPago y devuelve la URL de pago.
//
// Body esperado:
// {
//   items: [{ id, name, price, quantity, image }],
//   payer: { email }   ← opcional, viene del usuario logueado con Google
// }
app.post("/create_preference", async (req, res) => {
  try {
    const { items, payer } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    // Mapear items del carrito al formato que pide MercadoPago
    const mpItems = items.map((item) => ({
      id: item.id,
      title: item.name,
      quantity: Number(item.quantity),
      unit_price: Number(item.discountedPrice ?? item.price), // respeta el descuento de colecciones
      currency_id: "ARS",
      picture_url: item.image ?? "",
    }));

    const preferenceData = {
      items: mpItems,

      // URLs a donde redirige MercadoPago después del pago
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pago/success`,
        failure: `${process.env.FRONTEND_URL}/pago/failure`,
        pending: `${process.env.FRONTEND_URL}/pago/pending`,
      },
      //auto_return: "approved", // redirige automáticamente si el pago fue aprobado

      // Datos del comprador (opcional pero recomendado)
      ...(payer?.email && {
        payer: { email: payer.email },
      }),

      // Referencia externa — útil para relacionar el pago con tu sistema
      external_reference: `kiki-${Date.now()}`,

      // Métodos de pago (opcional — podés limitarlos)
      // payment_methods: {
      //   excluded_payment_types: [{ id: "ticket" }],
      //   installments: 6,
      // },
    };

    const preference = new Preference(client);
    const response = await preference.create({ body: preferenceData });

    res.json({
      id: response.id,
      // init_point → URL de pago real (producción)
      // sandbox_init_point → URL de pago de prueba
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