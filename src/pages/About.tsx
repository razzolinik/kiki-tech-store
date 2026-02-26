import { motion } from "framer-motion";
import { Shield, Database, CreditCard, Layers, Palette } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import logo from "@/assets/logo_kiki.png";

const techCategories = [
  {
    icon: Shield,
    title: "Autenticación",
    emoji: "",
    points: [
      "Google OAuth 2.0 vía @react-oauth/google — login sin contraseñas, token manejado en contexto global con persistencia en localStorage",
      "Sesión reactiva: el AuthContext hidrata el estado desde storage al montar, así la sesión sobrevive recargas",
    ],
  },
  {
    icon: Database,
    title: "Base de datos",
    emoji: "",
    points: [
      "MongoDB Atlas como backend de datos — productos, colecciones y catálogo servidos desde la nube",
      "Consultas vía API REST propia (el SERVER_URL apunta al backend Express/Node)",
    ],
  },
  {
    icon: CreditCard,
    title: "Pagos",
    emoji: "",
    points: [
      "Integración con MercadoPago API — se genera una preference desde el servidor con los items del carrito y se redirige al init_point oficial de MP",
      "El servidor actúa de intermediario para no exponer credenciales en el cliente",
    ],
  },
  {
    icon: Layers,
    title: "Estado global",
    emoji: "",
    points: [
      "Dos contextos React independientes: AuthContext (usuario, favoritos, perfil) y CartContext (carrito con persistencia en localStorage)",
      "Lógica de descuento por cantidad integrada en el carrito (addManyToCart con discountPct)",
    ],
  },
  {
    icon: Palette,
    title: "UX / Frontend",
    emoji: "",
    points: [
      "Stack: React + TypeScript + Vite + TailwindCSS + shadcn/ui",
      "Routing con React Router — rutas protegidas por estado de sesión",
      "Checkout multi-step (3 pasos) con validación por etapa y sincronización bidireccional con el perfil del usuario",
      "Sistema de favoritos persistente por usuario",
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const TechCard = ({ category, index }: { category: typeof techCategories[0]; index: number }) => {
  const Icon = category.icon;
  return (
    <motion.div
      variants={cardVariants}
      className={`group relative rounded-2xl bg-card p-8 shadow-soft border border-border hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300 ${
        index === 4 ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-pink-100">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-display font-bold text-foreground">
          {category.title}
        </h3>
      </div>
      <ul className="space-y-3">
        {category.points.map((point, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,hsl(var(--primary)/0.2),transparent_60%)] pointer-events-none" />

          {/* Contenido centrado verticalmente con min-height fijo */}
          <div className="container relative flex items-center min-h-[520px] py-16">
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 w-full">

              {/* Logo — borde sutil, sin tanto blanco */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="shrink-0 w-56 h-56 md:w-72 md:h-72 rounded-3xl overflow-hidden border border-primary/15 shadow-soft bg-white/60 backdrop-blur-sm p-5"
              >
                <img
                  src={logo}
                  alt="Kiki logo"
                  className="w-full h-full object-contain"
                />
              </motion.div>

              {/* Texto — pegado al logo, sin espacio muerto */}
              <div className="flex flex-col gap-5 text-center md:text-left max-w-lg">

                <motion.span
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="self-center md:self-start px-4 py-1.5 rounded-full bg-pink-100 text-primary text-xs font-semibold uppercase tracking-widest"
                >
                  Bajo el capó
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 }}
                  className="font-display text-5xl md:text-6xl font-extrabold text-foreground leading-[1.1]"
                >
                  Detrás de{" "}
                  <span className="text-primary">Kiki</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-muted-foreground text-base leading-relaxed"
                >
                  Un e-commerce ficticio creado para aprender y demostrar
                  herramientas modernas de desarrollo web. Así es como funciona por dentro.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.27 }}
                  className="flex flex-wrap justify-center md:justify-start gap-2"
                >
                  {["React", "TypeScript", "Vite", "Tailwind", "MongoDB", "MercadoPago", "OAuth 2.0"].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-semibold rounded-full border border-border bg-white/60 text-muted-foreground backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </motion.div>

              </div>
            </div>
          </div>

          {/* Wave */}
          <div className="relative">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path
                d="M0 40C240 80 480 8 720 36C960 64 1200 16 1440 40V80H0V40Z"
                fill="hsl(var(--background))"
              />
            </svg>
          </div>
        </section>

        {/* ── Cards ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="container py-14 pb-24"
        >
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {techCategories.map((cat, i) => (
              <TechCard key={cat.title} category={cat} index={i} />
            ))}
          </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
};

export default About;