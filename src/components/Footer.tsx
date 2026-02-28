import { Link } from "react-router-dom";
import { Heart, Linkedin, Github } from "lucide-react";
import logo from "@/assets/logo_kiki.png";

const Footer = () => {
  const footerLinks = {
    tienda: [
      { label: "Todos los productos", href: "/tienda" },
      { label: "Novedades", href: "/tienda?filter=new" },
      { label: "Mas vendidos", href: "/tienda?filter=bestseller" },
      { label: "En oferta", href: "/tienda?filter=sale" },
    ],
    categorias: [
      { label: "Colecciones", href: "/colecciones" },
      { label: "Mousepads", href: "/tienda?category=mousepads" },
      { label: "Keycaps", href: "/tienda?category=keycaps" },
      { label: "Accesorios", href: "/tienda?category=accesorios" },
    ],
    cuenta: [
      { label: "Favoritos", href: "/favoritos" },
      { label: "Carrito", href: "/carrito" },
    ],
  };

  return (
    <footer className="bg-kiki-pink-soft border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="Kiki" className="h-16 w-auto" />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Perifericos y accesorios seleccionados con criterio. Tecnologia con un toque cute para quienes valoran el detalle ♡
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/razzolinik"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:shadow-soft transition-all duration-300"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/razzolinik"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:shadow-soft transition-all duration-300"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Tienda</h4>
            <ul className="space-y-2">
              {footerLinks.tienda.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Categorias</h4>
            <ul className="space-y-2">
              {footerLinks.categorias.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Mi cuenta</h4>
            <ul className="space-y-2">
              {footerLinks.cuenta.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Kiki. &copy; {new Date().getFullYear()} Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Gracias por estar <Heart className="h-4 w-4 text-primary fill-primary" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;