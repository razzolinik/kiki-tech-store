import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Minus, Plus, Star, ChevronLeft, Truck, Shield, RotateCcw } from "lucide-react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";

const Producto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { product, loading, error } = useProduct(id!);
  const { products: allProducts } = useProducts();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [added, setAdded] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando producto...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🌸</p>
            <h2 className="text-2xl font-display font-bold mb-2">Producto no encontrado</h2>
            <p className="text-muted-foreground mb-6">No pudimos encontrar el producto que buscas.</p>
            <Button onClick={() => navigate("/tienda")}>Ver tienda</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const suggestedProducts = relatedProducts.length > 0
    ? relatedProducts
    : allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: product.colors?.[selectedColor] ?? "",
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container py-6 md:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Inicio</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/tienda" className="text-muted-foreground hover:text-foreground transition-colors">Tienda</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.category}</span>
          </nav>

          <Link to="/tienda" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 md:hidden">
            <ChevronLeft className="h-4 w-4" />
            Atras
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Imágenes */}
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-muted shadow-card">
                <img
                  src={product.images?.[selectedImage] ?? product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index ? "border-primary" : "border-transparent"
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.tags?.map((tag: string) => (
                    <span key={tag} className="text-xs uppercase tracking-wider text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews} reseñas)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">
                  ${product.price.toLocaleString("es-AR")}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString("es-AR")}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground">{product.description}</p>

              {/* Colores */}
              {product.colors?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Color</p>
                  <div className="flex gap-2">
                    {product.colors.map((color: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(i)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === i ? "border-foreground scale-110" : "border-transparent"
                          }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div>
                <p className="text-sm font-medium mb-2">Cantidad</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <Button className="flex-1 gap-2" size="lg" onClick={handleAddToCart}>
                  {added ? "¡Agregado!" : <><ShoppingBag className="h-5 w-5" />Agregar al carrito</>}
                </Button>
                <Button variant="outline" size="lg" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                </Button>
              </div>

              {/* Info extra */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="flex flex-col items-center text-center gap-1">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Envío gratis</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Garantía 1 año</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">30 días devolución</span>
                </div>
              </div>
            </div>
          </div>

          {/* Productos relacionados */}
          {suggestedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-display font-bold mb-8">También te puede gustar</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {suggestedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Producto;