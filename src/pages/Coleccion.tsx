import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Check } from "lucide-react";
import { allCollections } from "@/data/collectionsData";
import { allProducts } from "@/data/productsData";
import { useCart } from "@/context/CartContext";

const Coleccion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addManyToCart } = useCart();
  const [addedAll, setAddedAll] = useState(false);

  const collection = allCollections.find((c) => c.id === id);

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🌸</p>
            <h2 className="text-2xl font-display font-bold mb-2">Coleccion no encontrada</h2>
            <p className="text-muted-foreground mb-6">Esta coleccion no existe o fue removida.</p>
            <Button onClick={() => navigate("/colecciones")}>Ver colecciones</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const products = collection.productIds
    .map((pid) => allProducts.find((p) => p.id === pid))
    .filter(Boolean);

  const totalPrice = products.reduce((acc, p) => acc + p!.price, 0);
  const otherCollections = allCollections.filter((c) => c.id !== collection.id).slice(0, 2);

  const handleAddAll = () => {
    addManyToCart(
      products.map((p) => ({
        id: p!.id,
        name: p!.name,
        price: p!.price,
        image: p!.image,
        color: p!.colors?.[0] ?? "",
      }))
    );
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">

        {/* Hero */}
        <section className={`bg-gradient-to-br ${collection.accentColor} py-16 md:py-24`}>
          <div className="container">
            <Link
              to="/colecciones"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Todas las colecciones
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {collection.tags && (
                  <div className="flex gap-2 mb-4">
                    {collection.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/60 text-foreground/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Kiki · Coleccion
                </p>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                  {collection.name}
                </h1>
                <p className="text-lg text-muted-foreground mb-2 font-medium">{collection.tagline}</p>
                <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">{collection.description}</p>

                <div className="flex items-center gap-6 mb-8">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {products.length} productos · precio total
                    </p>
                    <p className="text-3xl font-display font-bold text-foreground">
                      ${Math.round(totalPrice * 0.87).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground line-through">${totalPrice.toLocaleString()}</p>
                    <p className="text-xs font-medium text-green-600 mt-1">13% de descuento comprando juntos</p>
                  </div>
                </div>

                <Button
                  variant="bubble"
                  size="lg"
                  className="gap-2 transition-all duration-300"
                  onClick={handleAddAll}
                >
                  {addedAll ? (
                    <>
                      <Check className="h-5 w-5" />
                      ¡Agregado al carrito!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      Agregar coleccion completa
                    </>
                  )}
                </Button>
              </div>

              {/* Floating product images */}
              <div className="relative h-64 md:h-80 flex items-center justify-center">
                {products.slice(0, 3).map((product, i) => (
                  <div
                    key={product!.id}
                    className="absolute transition-all duration-700"
                    style={{
                      left: `${15 + i * 28}%`,
                      bottom: 0,
                      zIndex: i + 1,
                      transform: `rotate(${(i - 1) * 7}deg)`,
                    }}
                  >
                    <img
                      src={product!.image}
                      alt={product!.name}
                      className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-2xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <div className="container py-12 md:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Productos incluidos</h2>
              <p className="text-muted-foreground text-sm mt-1">{products.length} items en esta coleccion</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={product!.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.08}s` }}>
                <ProductCard product={product!} />
              </div>
            ))}
          </div>

          {/* Other collections */}
          {otherCollections.length > 0 && (
            <section className="mt-20 md:mt-28">
              <h2 className="text-2xl font-display font-bold text-foreground mb-8">Otras colecciones</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {otherCollections.map((col) => {
                  const colProducts = col.productIds
                    .map((pid) => allProducts.find((p) => p.id === pid))
                    .filter(Boolean);
                  return (
                    <Link
                      key={col.id}
                      to={`/colecciones/${col.id}`}
                      className="group relative rounded-3xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${col.accentColor}`} />
                      <div className="relative p-6 flex items-center gap-6">
                        <div className="relative w-24 h-20 shrink-0">
                          {colProducts.slice(0, 2).map((p, i) => (
                            <img
                              key={p!.id}
                              src={p!.image}
                              alt={p!.name}
                              className="absolute w-16 h-16 object-contain drop-shadow-md"
                              style={{ left: `${i * 18}px`, bottom: 0, zIndex: i }}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{colProducts.length} productos</p>
                          <h3 className="font-display font-bold text-lg text-foreground">{col.name}</h3>
                          <p className="text-sm text-muted-foreground">{col.tagline}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Coleccion;