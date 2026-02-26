import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { useCollections } from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";

const Colecciones = () => {
  const { collections, loading, error } = useCollections();
  const { products } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando colecciones...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-destructive">Error al cargar colecciones: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="bg-gradient-hero py-12 md:py-20">
          <div className="container text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
              Kiki selección
            </p>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Colecciones
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Setups pensados de principio a fin. Cada coleccion combina productos que se ven
              increibles juntos.
            </p>
          </div>
        </section>

        <div className="container py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((collection, index) => {
              const colProducts = collection.productIds
                .map((pid: string) => products.find((p) => p.id === pid))
                .filter(Boolean);

              return (
                <Link
                  key={collection.id}
                  to={`/colecciones/${collection.id}`}
                  className="group relative rounded-3xl overflow-hidden bg-gradient-to-br shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${collection.accentColor}`} />

                  <div className="relative p-6 md:p-8 flex flex-col min-h-[320px]">
                    {collection.tags && (
                      <div className="flex gap-2 mb-auto">
                        {collection.tags.map((tag: string) => (
                          <span key={tag} className="text-xs bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-foreground/70">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="relative h-40 flex items-end justify-center my-4">
                      {colProducts.slice(0, 3).map((product: any, i: number) => (
                        <div
                          key={product.id}
                          className="absolute transition-all duration-700"
                          style={{
                            left: `${15 + i * 28}%`,
                            bottom: 0,
                            zIndex: i + 1,
                            transform: `rotate(${(i - 1) * 7}deg)`,
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 object-contain drop-shadow-xl"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <p className="text-xs text-muted-foreground mb-1">{colProducts.length} productos</p>
                      <h2 className="text-2xl font-display font-bold text-foreground">{collection.name}</h2>
                      <p className="text-muted-foreground text-sm mt-1">{collection.tagline}</p>
                      <div className="flex items-center gap-1 mt-3 text-sm font-medium text-foreground">
                        Ver colección <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Colecciones;