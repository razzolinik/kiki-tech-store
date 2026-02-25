import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";

const PagoPending = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
          <Clock className="h-10 w-10 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Pago pendiente
        </h1>
        <p className="text-muted-foreground mb-6">
          Tu pago está siendo procesado. Te avisaremos cuando esté confirmado.
        </p>
        <Link to="/">
          <Button variant="bubble">
            Ir al inicio
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default PagoPending;