import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { allCollections } from "@/data/collectionsData";
import { allProducts } from "@/data/productsData";

const Colecciones = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">

        {/* Page Header */}
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
            {allCollections.map((collection, index) => {
              // Get the actual product objects for this collection
              const products = collection.productIds
                .map((id) => allProducts.find((p) => p.id === id))
                .filter(Boolean);

              return (
                <Link
                  key={collection.id}
                  to={`/colecciones/${collection.id}`}
                  className="group relative rounded-3xl overflow-hidden bg-gradient-to-br shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${collection.accentColor}`} />

                  <div className="relative p-6 md:p-8 flex flex-col min-h-[320px]">

                    {/* Tags */}
                    {collection.tags && (
                      <div className="flex gap-2 mb-auto">
                        {collection.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/60 text-foreground/70 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Product images — floating, overlapping */}
                    <div className="flex items-end justify-center py-6 relative h-40">
                      {products.slice(0, 3).map((product, i) => (
                        <div
                          key={product!.id}
                          className="absolute transition-all duration-500"
                          style={{
                            left: `${20 + i * 28}%`,
                            bottom: 0,
                            zIndex: i + 1,
                            transform: `rotate(${(i - 1) * 6}deg)`,
                          }}
                        >
                          <img
                            src={product!.image}
                            alt={product!.name}
                            className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                            style={{ transitionDelay: `${i * 50}ms` }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Info */}
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                        {products.length} productos
                      </p>
                      <h2 className="font-display font-bold text-2xl text-foreground mb-1">
                        {collection.name}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-4">
                        {collection.tagline}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground group-hover:gap-3 transition-all duration-300">
                        Ver coleccion
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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