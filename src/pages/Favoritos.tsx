import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { allProducts } from "@/data/productsData";

const Favoritos = () => {
  const { isLoggedIn, favorites, user } = useAuth();

  const favoriteProducts = allProducts.filter((p) => favorites.includes(p.id));

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center px-4">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Iniciá sesión para ver tus favoritos
            </h1>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
              Guardá los productos que más te gustan y accedé a ellos cuando quieras.
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
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container">
            <div className="flex items-center gap-4">
              {user?.picture && (
                <img src={user.picture} alt={user.name} className="h-12 w-12 rounded-full border-2 border-primary/30" referrerPolicy="no-referrer" crossOrigin="anonymous" />
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  Mis favoritos
                </h1>
                <p className="text-muted-foreground mt-1">
                  {favoriteProducts.length === 0
                    ? "Todavía no guardaste nada"
                    : `${favoriteProducts.length} producto${favoriteProducts.length !== 1 ? "s" : ""} guardado${favoriteProducts.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-10 md:py-16">
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🌸</p>
              <h3 className="font-display font-semibold text-lg mb-2">
                Aún no tenés favoritos
              </h3>
              <p className="text-muted-foreground mb-6">
                Explorá la tienda y tocá el corazón en los productos que te gusten.
              </p>
              <Link to="/tienda">
                <Button variant="bubble">
                  Explorar tienda
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favoritos;