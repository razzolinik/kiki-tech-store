import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Check } from "lucide-react";
import { useCollection, useCollections } from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/cartContext";

const Coleccion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addManyToCart } = useCart();
  const [addedAll, setAddedAll] = useState(false);

  const { collection, loading, error } = useCollection(id!);
  const { products } = useProducts();
  const { collections } = useCollections();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando colección...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !collection) {
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

  const colProducts = collection.productIds
    .map((pid: string) => products.find((p) => p.id === pid))
    .filter(Boolean);

  const totalPrice = colProducts.reduce((acc: number, p: any) => acc + p.price, 0);
  const discountedTotal = Math.round(totalPrice * 0.87);

  const otherCollections = collections
    .filter((c) => c.id !== collection.id)
    .slice(0, 2);

  const handleAddAll = () => {
    addManyToCart(
      colProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        color: p.colors?.[0] ?? "",
      })),
      0.13
    );
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className={`relative overflow-hidden bg-gradient-to-br ${collection.accentColor} py-16 md:py-24`}>
          <div className="container">
            <Link
              to="/colecciones"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a colecciones
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {collection.tags && (
                  <div className="flex gap-2 mb-4">
                    {collection.tags.map((tag: string) => (
                      <span key={tag} className="text-xs bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-foreground/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
                  {collection.name}
                </h1>
                <p className="text-lg text-muted-foreground mb-2">{collection.tagline}</p>
                <p className="text-muted-foreground mb-8">{collection.description}</p>

                <div className="flex items-center gap-6 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground line-through">
                      ${totalPrice.toLocaleString("es-AR")}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      ${discountedTotal.toLocaleString("es-AR")}
                    </p>
                    <p className="text-xs text-green-600 font-medium">13% de descuento por colección</p>
                  </div>
                  <Button size="lg" className="gap-2" onClick={handleAddAll}>
                    {addedAll ? (
                      <><Check className="h-5 w-5" />¡Agregado al carrito!</>
                    ) : (
                      <><ShoppingBag className="h-5 w-5" />Agregar coleccion completa</>
                    )}
                  </Button>
                </div>
              </div>

              <div className="relative h-64 md:h-80 flex items-center justify-center">
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
                      className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-2xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Productos */}
        <div className="container py-12 md:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Productos incluidos</h2>
              <p className="text-muted-foreground text-sm mt-1">{colProducts.length} items en esta coleccion</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {colProducts.map((product: any, index: number) => (
              <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.08}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Otras colecciones */}
          {otherCollections.length > 0 && (
            <section className="mt-20 md:mt-28">
              <h2 className="text-2xl font-display font-bold text-foreground mb-8">Otras colecciones</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {otherCollections.map((col) => {
                  const colProds = col.productIds
                    .map((pid: string) => products.find((p) => p.id === pid))
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
                          {colProds.slice(0, 2).map((p: any, i: number) => (
                            <img
                              key={p.id}
                              src={p.image}
                              alt={p.name}
                              className="absolute w-16 h-16 object-contain drop-shadow-md"
                              style={{ left: `${i * 18}px`, bottom: 0, zIndex: i }}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{colProds.length} productos</p>
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