import { Sparkles, Heart, Cloud } from "lucide-react";

const MotivationalBanner = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Cloud className="absolute top-10 left-10 h-8 w-8 text-kiki-pink-pastel/50 animate-float" />
        <Heart className="absolute top-20 right-20 h-6 w-6 text-primary/40 animate-float" style={{ animationDelay: "1s" }} />
        <Sparkles className="absolute bottom-10 left-1/4 h-6 w-6 text-kiki-lilac/50 animate-pulse-soft" />
        <Cloud className="absolute bottom-20 right-1/4 h-10 w-10 text-kiki-pink-pastel/40 animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card shadow-soft mb-6">
            <span className="text-3xl">🌸</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-4">
            Tu escritorio, tu lenguaje
          </h2>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
            Un espacio bien pensado cambia como trabajas, como creas 
            y como te sientes. Cada pieza cuenta.
          </p>

          <div className="flex items-center justify-center gap-2 mt-8">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce-soft"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MotivationalBanner;
