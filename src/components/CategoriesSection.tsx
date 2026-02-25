import { Link } from "react-router-dom";
import { Keyboard, Monitor, Lightbulb, Mouse, Cpu, Headphones } from "lucide-react";

import mouseImg from "@/assets/mouse.png";
import keycapImg from "@/assets/keycap.png";
import ledstripesImg from "@/assets/ledstripes.png";
import standImg from "@/assets/stand.png";
import caseImg from "@/assets/case.png";
import auricularImg from "@/assets/auricular.png";

const categories = [
  {
    id: "Mousepads",
    name: "Mousepads",
    description: "Superficie y textura para cada estilo",
    icon: Mouse,
    image: mouseImg,
    color: "bg-kiki-pink-pastel",
  },
  {
    id: "Keycaps",
    name: "Keycaps",
    description: "El detalle que cambia todo tu teclado",
    icon: Keyboard,
    image: keycapImg,
    color: "bg-kiki-lilac",
  },
  {
    id: "Iluminacion",
    name: "Iluminacion RGB",
    description: "Luz que define tu espacio",
    icon: Lightbulb,
    image: ledstripesImg,
    color: "bg-accent",
  },
  {
    id: "Accesorios",
    name: "Accesorios",
    description: "Los complementos que hacen la diferencia",
    icon: Monitor,
    image: standImg,
    color: "bg-primary/30",
  },
  {
    id: "PC Cases",
    name: "PC Cases",
    description: "Builds aesthetic con RGB integrado",
    icon: Cpu,
    image: caseImg,
    color: "bg-kiki-lilac",
  },
  {
    id: "Periféricos",
    name: "Periféricos",
    description: "Audio y control para tu setup",
    icon: Headphones,
    image: auricularImg,
    color: "bg-kiki-pink-pastel",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Por categoria
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Encuentra lo que necesitas. Todo seleccionado con criterio y atencion al detalle.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/tienda?category=${category.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-square shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${category.color} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
                  <category.icon className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
                </div>
                <h3 className="font-display font-bold text-secondary-foreground text-lg md:text-xl mb-1">
                  {category.name}
                </h3>
                <p className="text-secondary-foreground/80 text-sm hidden md:block">
                  {category.description}
                </p>
              </div>

              {/* Hover indicator */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-card/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-foreground">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;