import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Filter, Grid3X3, LayoutGrid } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const categories = [
  "Todos",
  "Mousepads",
  "Keycaps",
  "Iluminacion",
  "Accesorios",
  "Periféricos",
  "PC Cases",
  "Monitores",
  "Sillas",
];

const Tienda = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "Todos"
  );
  const [gridCols, setGridCols] = useState<2 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);

  const { products, loading, error } = useProducts(selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container text-center">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Tienda
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Todo nuestro catalogo en un solo lugar. Filtra por categoria y
              encuentra lo tuyo.
            </p>
          </div>
        </section>

        <div className="container py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Categorías desktop */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Categorías mobile */}
            <div className="flex md:hidden items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                {selectedCategory === "Todos" ? "Filtrar" : selectedCategory}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant={gridCols === 2 ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGridCols(2)}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridCols === 4 ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGridCols(4)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="flex md:hidden flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowFilters(false);
                    }}
                    className="rounded-full"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Estado de carga */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex justify-center items-center py-20">
              <p className="text-destructive">Error al cargar productos: {error}</p>
            </div>
          )}

          {/* Grid de productos */}
          {!loading && !error && (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {products.length} producto{products.length !== 1 ? "s" : ""}
              </p>
              <div className={`grid gap-6 ${
                gridCols === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-5xl mb-4">🌸</p>
                  <p className="text-muted-foreground">No hay productos en esta categoría.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tienda;