import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, LogOut, ArrowRight, Package } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useProducts } from "@/hooks/useProducts";

const Perfil = () => {
  const { user, isLoggedIn, logout, favorites } = useAuth();
  const { products } = useProducts();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center px-4">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl">🐱</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Iniciá sesión para ver tu perfil
            </h1>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
              Accedé a tus favoritos, historial de compras y más.
            </p>
            <Link to="/">
              <Button variant="bubble">
                Ir al inicio
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">

        {/* Hero del perfil */}
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              <img
                src={user.picture}
                alt={user.name}
                className="h-24 w-24 rounded-full border-4 border-primary/30 shadow-soft"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  {user.name}
                </h1>
                <p className="text-muted-foreground mt-1">{user.email}</p>
              </div>
              <div className="sm:ml-auto">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-10 md:py-16 space-y-16">

          {/* Stats rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
              <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{favorites.length}</p>
              <p className="text-sm text-muted-foreground">Favoritos</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
              <Package className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Compras</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-soft text-center col-span-2 md:col-span-1">
              <ShoppingBag className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">🐱</p>
              <p className="text-sm text-muted-foreground">Miembro Kiki</p>
            </div>
          </div>

          {/* Favoritos */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">
                Mis favoritos
              </h2>
              {favoriteProducts.length > 0 && (
                <Link to="/favoritos" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Ver todos <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            {favoriteProducts.length === 0 ? (
              <div className="bg-card rounded-2xl p-10 text-center shadow-soft">
                <p className="text-3xl mb-3">🌸</p>
                <p className="text-muted-foreground mb-4">Todavía no guardaste ningún producto.</p>
                <Link to="/tienda">
                  <Button variant="bubble" size="sm">
                    Explorar tienda
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoriteProducts.slice(0, 4).map((product, index) => (
                  <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Historial de compras */}
          <section>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              Historial de compras
            </h2>
            <div className="bg-card rounded-2xl p-10 text-center shadow-soft">
              <p className="text-3xl mb-3">📦</p>
              <p className="font-medium text-foreground mb-1">Todavía no realizaste ninguna compra</p>
              <p className="text-muted-foreground mb-4 text-sm">Cuando completes un pedido, vas a poder verlo acá.</p>
              <Link to="/tienda">
                <Button variant="bubble" size="sm">
                  Ir a la tienda
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Perfil;