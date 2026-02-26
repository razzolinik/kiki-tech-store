import { useState, useRef, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { User, LogOut, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { Link } from "react-router-dom";

// ─── Login Modal ────────────────────────────────────────────────────────────
// Exportado por separado para que Header lo renderice FUERA del <header> tag
// y no herede su z-index sticky.
export const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const data = await res.json();
      login({ id: data.sub, name: data.name, email: data.email, picture: data.picture });
      onClose();
    },
    onError: () => console.error("Error al iniciar sesión con Google"),
  });

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative bg-card rounded-3xl shadow-hover p-8 w-full max-w-sm text-center animate-scale-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
          <span className="text-3xl">🐱</span>
        </div>
        <h2 className="font-display font-bold text-xl text-foreground mb-1">
          Bienvenida a Kiki
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Iniciá sesión para guardar tus favoritos y acceder a tu historial de compras.
        </p>

        <button
          onClick={() => googleLogin()}
          className="w-full flex items-center justify-center gap-3 bg-white border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-soft"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continuar con Google
        </button>

        <p className="text-xs text-muted-foreground mt-4">
          Al continuar, aceptás nuestros términos y política de privacidad.
        </p>
      </div>
    </div>
  );
};

// ─── User Menu (botón + dropdown) ───────────────────────────────────────────
interface UserMenuProps {
  onOpenLogin: () => void;
}

const UserMenu = ({ onOpenLogin }: UserMenuProps) => {
  const { user, isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (isLoggedIn && user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-full hover:bg-muted transition-colors px-2 py-1"
        >
          <img
            src={user.picture}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover border-2 border-primary/30"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
          <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-card rounded-2xl shadow-hover border border-border overflow-hidden animate-scale-in z-50">
            <div className="px-4 py-3 border-b border-border">
              <p className="font-semibold text-sm text-foreground line-clamp-1">{user.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{user.email}</p>
            </div>
            <div className="py-1">
              <Link
                to="/favoritos"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Heart className="h-4 w-4 text-primary" />
                Mis favoritos
              </Link>
              <Link
                to="/perfil"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <User className="h-4 w-4 text-primary" />
                Mi perfil
              </Link>
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button variant="ghost" size="icon" className="hidden md:flex" onClick={onOpenLogin}>
      <User className="h-5 w-5" />
    </Button>
  );
};

export default UserMenu;