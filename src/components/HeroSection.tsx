import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroSetup from "@/assets/hero-setup.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] bg-gradient-hero overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-kiki-lilac/30 blur-2xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-primary/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-24 h-24 rounded-full bg-kiki-pink-pastel/50 blur-2xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative z-10 pt-12 pb-20 lg:pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Nueva coleccion disponible ✨</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-tight">
              <span className="bubble-text">tech con</span>
              <br />
              <span className="text-gradient">personalidad</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Perifericos y accesorios de escritorio pensados con intención. 
              Cada detalle dice algo de vos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/tienda">
                <Button variant="bubble" size="lg" className="w-full sm:w-auto">
                  Explorar la tienda
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/tienda?filter=new">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Lo más reciente
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-6">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground">Productos</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-foreground">10k+</p>
                <p className="text-sm text-muted-foreground">Clientas</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-foreground">4.9</p>
                <p className="text-sm text-muted-foreground">Valoracion</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative rounded-3xl overflow-hidden shadow-hover">
              <img
                src={heroSetup}
                alt="Setup aesthetic kawaii con accesorios tech pastel"
                className="w-full h-auto object-cover animate-float"
                style={{ animationDuration: "6s" }}
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-card animate-bounce-soft">
              <p className="text-sm font-medium text-muted-foreground">🌸 Envio sin costo</p>
              <p className="text-lg font-display font-bold text-foreground">desde $70.000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
