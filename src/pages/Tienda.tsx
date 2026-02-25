import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Filter, Grid3X3, LayoutGrid, X } from "lucide-react";
import { allProducts } from "@/data/productsData";

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

  const filteredProducts =
    selectedCategory === "Todos"
      ? allProducts
      : allProducts.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Page Header */}
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
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Categories - Desktop */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "kawaii"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="kawaii"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {selectedCategory !== "Todos" && (
                <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  1
                </span>
              )}
            </Button>

            {/* Grid Toggle & Count */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} productos
              </span>
              <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-2 rounded-md transition-colors ${
                    gridCols === 2 ? "bg-card shadow-sm" : "hover:bg-card/50"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 rounded-md transition-colors ${
                    gridCols === 4 ? "bg-card shadow-sm" : "hover:bg-card/50"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mb-6 p-4 bg-card rounded-2xl shadow-soft animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">Categorias</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "kawaii"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowFilters(false);
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div
            className={`grid gap-6 ${
              gridCols === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🌸</p>
              <h3 className="font-display font-semibold text-lg mb-2">
                Sin resultados en esta categoria
              </h3>
              <p className="text-muted-foreground mb-4">
                Prueba con otra categoria o explora todo el catalogo.
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("Todos")}
              >
                Ver todos los productos
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tienda;