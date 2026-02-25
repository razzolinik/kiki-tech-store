import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/authContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  tags?: string[];
  colors?: string[];
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isLoggedIn, toggleFavorite, isFavorite } = useAuth();
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.colors?.[0] ?? "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return; // el corazón no hace nada si no está logueado
    toggleFavorite(product.id);
  };

  const favorited = isFavorite(product.id);

  return (
    <article
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <Link to={`/producto/${product.id}`} className="block aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      {/* Tags */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
        {product.tags?.map((tag) => (
          <span
            key={tag}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold",
              tag === "new" && "bg-kiki-lilac text-accent-foreground",
              tag === "limited" && "bg-secondary text-secondary-foreground",
              tag === "sale" && "bg-kiki-pink-vibrant text-secondary-foreground",
              tag === "pastel edition" && "bg-kiki-pink-pastel text-foreground"
            )}
          >
            {tag === "new" && "✨ Nuevo"}
            {tag === "limited" && "Limited"}
            {tag === "sale" && `${discount}% OFF`}
            {tag === "pastel edition" && "Pastel"}
          </span>
        ))}
      </div>

      {/* Favorite button — solo interactivo si está logueado */}
      <button
        onClick={handleFavorite}
        className={cn(
          "absolute top-3 right-3 h-9 w-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200",
          isLoggedIn
            ? "opacity-0 group-hover:opacity-100 hover:bg-card cursor-pointer"
            : "hidden", // oculto si no está logueado
          favorited && "opacity-100 text-primary"
        )}
      >
        <Heart className={cn("h-4 w-4", favorited ? "fill-primary text-primary" : "text-muted-foreground")} />
      </button>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
          {product.category}
        </p>
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 mb-3">
            {product.colors.map((color) => (
              <span
                key={color}
                className="h-4 w-4 rounded-full border-2 border-border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-lg text-foreground">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300",
              added
                ? "bg-green-500 text-white scale-110"
                : "bg-primary text-primary-foreground hover:bg-kiki-pink-hover hover:scale-110"
            )}
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;