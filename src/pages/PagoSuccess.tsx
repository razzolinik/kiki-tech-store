import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/context/cartContext";

const PagoSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const paymentId = searchParams.get("payment_id");

  // Vaciar el carrito cuando el pago fue aprobado
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            ¡Pago aprobado!
          </h1>
          <p className="text-muted-foreground mb-2">
            Tu pedido fue procesado correctamente.
          </p>
          {paymentId && (
            <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 inline-block mb-6">
              ID de pago: <span className="font-mono font-medium">{paymentId}</span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link to="/tienda">
              <Button variant="bubble">
                Seguir comprando
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="kawaii">Ir al inicio</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PagoSuccess;