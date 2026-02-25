import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { allProducts } from "@/data/productsData";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal = ({ open, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const results = query.trim().length >= 2
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-card rounded-2xl shadow-hover overflow-hidden animate-scale-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="divide-y divide-border max-h-80 overflow-y-auto">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/producto/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-contain bg-muted shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground shrink-0">
                    ${product.price.toLocaleString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {query.trim().length >= 2 && results.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            <p className="text-2xl mb-2">🔍</p>
            Sin resultados para <span className="font-medium text-foreground">"{query}"</span>
          </div>
        )}

        {/* Hint when empty */}
        {query.trim().length < 2 && (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground">
            Escribí al menos 2 caracteres para buscar
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;