import { Link } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logo from "@/assets/logo_kiki.png";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/authContext";
import { cn } from "@/lib/utils";
import SearchModal from "@/components/SearchModal";
import UserMenu, { LoginModal } from "@/components/UserMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { totalItems, justAdded } = useCart();
  const { isLoggedIn, favorites } = useAuth();

  const navLinks = [
    { label: "Inicio", href: "/" },
    { label: "Tienda", href: "/tienda" },
    { label: "Novedades", href: "/tienda?filter=new" },
    { label: "Colecciones", href: "/colecciones" },
  ];

  return (
    <>
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container flex h-16 md:h-20 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="Kiki - Tech and Hardware"
              className="h-12 md:h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Buscar */}
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Favoritos — solo si está logueado */}
            {isLoggedIn && (
              <Link to="/favoritos">
                <Button variant="ghost" size="icon" className="hidden md:flex relative">
                  <Heart className="h-5 w-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Usuario / UserMenu */}
            <div className="hidden md:flex">
              <UserMenu onOpenLogin={() => setLoginOpen(true)} />
            </div>

            {/* Carrito */}
            <Link to="/carrito">
              <Button variant="kawaii" size="icon" className="relative">
                <ShoppingBag
                  className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    justAdded && "scale-125"
                  )}
                />
                {totalItems > 0 && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 h-5 w-5 rounded-full bg-kiki-pink-vibrant text-secondary-foreground text-xs font-bold flex items-center justify-center transition-transform duration-300",
                      justAdded ? "scale-125" : "scale-100"
                    )}
                  >
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-card border-b border-border animate-slide-up">
            <nav className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 px-4 pt-2 border-t border-border mt-2">
                <Button variant="ghost" size="icon" onClick={() => { setSearchOpen(true); setIsMenuOpen(false); }}>
                  <Search className="h-5 w-5" />
                </Button>
                {isLoggedIn && (
                  <Link to="/favoritos" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <UserMenu onOpenLogin={() => { setLoginOpen(true); setIsMenuOpen(false); }} />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ── Modals — fuera del header para no heredar z-index ── */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </>
  );
};

export default Header;