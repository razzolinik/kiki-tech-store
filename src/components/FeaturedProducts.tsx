import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

import auricularImg from "@/assets/auricular.png";
import tecladoImg from "@/assets/teclado.png";
import mousepadImg from "@/assets/mousepad.png";
import caseImg from "@/assets/case.png";

const hero = {
  id: "1",
  name: "Auricular Gamer Sakura",
  subtitle: "Edicion Rosa · Limited",
  price: 85000,
  tag: "✨ Más vendido",
  tagColor: "bg-pink-100 text-pink-500",
  image: auricularImg,
};

const secondary = [
  {
    id: "10",
    name: "Teclado Mecanico Pastel",
    price: 120000,
    originalPrice: 145000,
    tag: "19% OFF",
    tagColor: "bg-rose-500 text-white",
    image: tecladoImg,
  },
  {
    id: "8",
    name: "Mousepad XL Floral",
    price: 45000,
    tag: "🌸 Pastel",
    tagColor: "bg-purple-100 text-purple-500",
    image: mousepadImg,
  },
  {
    id: "3",
    name: "PC Case RGB Pink",
    price: 185000,
    tag: "✨ Nuevo",
    tagColor: "bg-pink-100 text-pink-500",
    image: caseImg,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-medium">
              Seleccion
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Lo mas elegido
            </h2>
          </div>
          <Link to="/tienda">
            <Button variant="ghost" className="group gap-1 text-muted-foreground hover:text-foreground">
              Ver todo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Hero Card */}
          <Link
            to={`/producto/${hero.id}`}
            className="lg:col-span-2 group relative rounded-3xl overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col justify-between min-h-[480px] p-6 shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-1"
          >
            <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold ${hero.tagColor}`}>
              {hero.tag}
            </span>
            <div className="flex-1 flex items-center justify-center py-4">
              <img
                src={hero.image}
                alt={hero.name}
                className="w-64 h-64 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{hero.subtitle}</p>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">
                {hero.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-display font-bold text-foreground">
                  ${hero.price.toLocaleString()}
                </span>
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <ShoppingBag className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            </div>
          </Link>

          {/* Secondary Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 grid-rows-2 gap-4">

            {secondary.slice(0, 2).map((product) => (
              <Link
                key={product.id}
                to={`/producto/${product.id}`}
                className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50/60 to-pink-50/60 flex flex-col justify-between p-4 shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-1 min-h-[220px]"
              >
                <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.tagColor}`}>
                  {product.tag}
                </span>
                <div className="flex-1 flex items-center justify-center py-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-28 h-28 object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-foreground mb-1 leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}

            <Link
              to={`/producto/${secondary[2].id}`}
              className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-50/70 to-pink-50/70 flex flex-col justify-between p-4 shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-1 min-h-[220px]"
            >
              <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-semibold ${secondary[2].tagColor}`}>
                {secondary[2].tag}
              </span>
              <div className="flex-1 flex items-center justify-center py-2">
                <img
                  src={secondary[2].image}
                  alt={secondary[2].name}
                  className="w-28 h-28 object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-foreground mb-1 leading-tight">
                  {secondary[2].name}
                </h3>
                <span className="font-bold text-foreground text-sm">
                  ${secondary[2].price.toLocaleString()}
                </span>
              </div>
            </Link>

            {/* Bottom promo banner → Sakura Set Collection */}
            <Link
              to="/colecciones"
              className="sm:col-span-3 group relative rounded-3xl overflow-hidden bg-gradient-to-r from-pink-100 via-purple-50 to-pink-50 flex items-center justify-between px-8 py-6 shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-1 min-h-[100px]"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Nueva coleccion</p>
                <h3 className="font-display font-bold text-xl text-foreground">
                  Sakura Set Collection
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  El setup que florece — mouse, teclado y auricular a un precio especial por tiempo limitado
                </p>
              </div>
              <div className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm group-hover:gap-3 transition-all duration-300 whitespace-nowrap">
                Explorar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;