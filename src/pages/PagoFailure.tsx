import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";

const PagoFailure = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Pago rechazado
        </h1>
        <p className="text-muted-foreground mb-6">
          Hubo un problema con tu pago. Podés intentarlo nuevamente con otro método.
        </p>
        <Link to="/carrito">
          <Button variant="bubble">
            <ArrowLeft className="h-4 w-4" />
            Volver al carrito
          </Button>
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default PagoFailure;