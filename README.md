# 🐱 Kiki Tech Store

E-commerce de tech gamer con estética adorable.

---

## 🎯 Propósito del proyecto

Kiki es un proyecto de aprendizaje personal con el objetivo de construir un e-commerce funcional de punta a punta, tomando decisiones técnicas reales en cada capa de la aplicación.

La idea fue ir más allá de un CRUD básico: integrar autenticación con OAuth real, manejar estado global sin librerías externas, conectar una base de datos en la nube y cerrar el ciclo con una pasarela de pagos funcional. La temática de periféricos con identidad visual propia fue una decisión intencional para darle coherencia de producto al proyecto.

---

## 🛠️ Tecnologías utilizadas

**Frontend**
- React 18 + TypeScript con Vite
- React Router v6 para ruteo con rutas dinámicas
- Tailwind CSS + shadcn/ui para estilos y componentes
- Context API para estado global (carrito y autenticación)
- `@react-oauth/google` para login con Google OAuth 2.0

**Backend**
- Node.js + Express
- Mongoose para modelado y conexión con MongoDB Atlas
- MongoDB Atlas como base de datos en la nube (productos y colecciones)
- Script de seed para poblar la base de datos inicialmente
- MercadoPago SDK v2 — Checkout Pro
- Variables de entorno con dotenv, CORS configurado por entorno
- DNS configurado explícitamente vía `dns.setServers` para garantizar conectividad en Railway

**Infraestructura**
- Frontend: Vercel
- Backend: Railway (root directory apuntando a `/server`)
- Base de datos: MongoDB Atlas (cluster en la nube)

**Imágenes**
- Generación Gemini Nano Banana Pro

---

## 🔧 Cómo se trabajó

El proyecto se desarrolló de forma incremental, empezando por la estructura visual y avanzando hacia las capas de lógica y servicios externos.

Primero se construyó el catálogo con datos estáticos para definir la estructura de productos y colecciones. Luego se modelaron los schemas con Mongoose, se configuró la conexión a MongoDB Atlas y se creó un script de seed (`seed.js`) para poblar la base de datos. El backend de Express sirve los productos y colecciones directamente desde la base de datos.

En paralelo se implementó la autenticación con Google OAuth 2.0 y el carrito con Context API. El último bloque fue la integración con MercadoPago Checkout Pro: creación de preferencias desde el backend, manejo de las tres respuestas posibles (éxito, fallo, pendiente) y validación del flujo completo en modo sandbox con cuentas de prueba separadas.

---

## ✅ Funcionalidades implementadas

- Catálogo con 15 productos en MongoDB Atlas, filtrado por categoría y grilla ajustable
- Páginas de detalle con productos relacionados
- Sistema de colecciones curadas con descuento automático del 13%
- Carrito con estado global, cálculo de envío y feedback visual
- Login con Google, favoritos por usuario
- Checkout con MercadoPago Checkout Pro — probado y funcional en sandbox
- Páginas de resultado de pago (éxito, fallo, pendiente)
- Búsqueda de productos por nombre o descripción aprovechando los índices de texto nativos de MongoDB.

---

## 🚀 Próximos pasos y espacios de mejora

**Guardar transacciones en la base de datos**
Hoy los pagos se confirman a través del redirect de MercadoPago pero no se persiste ningún registro en MongoDB. El paso siguiente sería implementar webhooks (IPN) para escuchar confirmaciones del lado del servidor y guardar cada pedido con su estado, items y datos del comprador.

**Usuarios en la base de datos**
La sesión de Google se almacena solo en memoria del cliente. Guardar el perfil del usuario en MongoDB permitiría mantener favoritos, historial de compras y datos de envío entre sesiones.

**Integración con el Correo Argentino**
Conectar la API del Correo Argentino para calcular costos de envío en tiempo real según el código postal del comprador y generar el seguimiento del paquete una vez despachado.

**Notificaciones por email**
Enviar una confirmación automática al comprador tras el pago usando un servicio como Resend o SendGrid, con el detalle de los productos y el número de operación.

**Panel de administración**
Agregar, editar o desactivar productos directamente desde una interfaz, sin necesidad de modificar el seed ni la base de datos manualmente.

**Persistencia del carrito**
Actualmente el carrito se pierde al recargar. Guardarlo en `localStorage` o asociarlo al usuario en MongoDB mejoraría considerablemente la experiencia.


---

## 👩‍💻 Autora

**razzolini khiara as kiki** · [LinkedIn](https://linkedin.com/in/razzolinik) · [GitHub](https://github.com/razzolinik)

*Tecnología con un toque cute para quienes valoran el detalle ♡*