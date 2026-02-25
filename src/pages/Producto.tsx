import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Minus, Plus, Star, ChevronLeft, Truck, Shield, RotateCcw } from "lucide-react";
import { allProducts } from "@/data/productsData";

const Producto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = allProducts.find((p) => p.id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🌸</p>
            <h2 className="text-2xl font-display font-bold mb-2">Producto no encontrado</h2>
            <p className="text-muted-foreground mb-6">
              No pudimos encontrar el producto que buscas.
            </p>
            <Button onClick={() => navigate("/tienda")}>Ver tienda</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Related products: same category, excluding current
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Fallback to any 3 products if no related ones found
  const suggestedProducts = relatedProducts.length > 0
    ? relatedProducts
    : allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container py-6 md:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Inicio
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/tienda" className="text-muted-foreground hover:text-foreground transition-colors">
              Tienda
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.category}</span>
          </nav>

          {/* Back Button - Mobile */}
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 md:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
            Atras
          </Link>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-muted shadow-card">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary shadow-soft"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-kiki-lilac text-accent-foreground"
                    >
                      {tag === "new" && "✨ Nuevo"}
                      {tag === "limited" && "Limited Edition"}
                      {tag === "sale" && "🏷️ Oferta"}
                      {tag === "pastel edition" && "🌸 Pastel Edition"}
                    </span>
                  ))}
                </div>
              )}

              {/* Title & Rating */}
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  {product.category}
                </p>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} opiniones)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-display font-bold text-foreground">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Color Selection */}
              {product.colors && (
                <div>
                  <p className="text-sm font-medium mb-3">Color</p>
                  <div className="flex gap-2">
                    {product.colors.map((color, index) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(index)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === index
                            ? "border-primary scale-110 shadow-soft"
                            : "border-border hover:border-primary/50"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-sm font-medium mb-3">Unidades</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-muted rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 flex items-center justify-center hover:bg-card rounded-full transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 flex items-center justify-center hover:bg-card rounded-full transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="bubble" size="lg" className="flex-1">
                  <ShoppingBag className="h-5 w-5" />
                  Agregar al carrito
                </Button>
                <Button
                  variant="kawaii"
                  size="icon"
                  className="h-14 w-14"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                </Button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Envio gratis +$50k</p>
                </div>
                <div className="text-center">
                  <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Garantia 1 ano</p>
                </div>
                <div className="text-center">
                  <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                    <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Devolucion 30 dias</p>
                </div>
              </div>

              {/* Features */}
              <div className="pt-6 border-t border-border">
                <h3 className="font-display font-semibold mb-4">Especificaciones</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section className="mt-16 md:mt-24">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">
              Complementa tu seleccion
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Producto;