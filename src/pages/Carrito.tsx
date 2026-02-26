import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Loader2 } from "lucide-react";
import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/authContext";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

const Carrito = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const [loadingMP, setLoadingMP] = useState(false);
  const [mpError, setMpError] = useState("");

  const shipping = subtotal >= 50000 ? 0 : 8000;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setLoadingMP(true);
    setMpError("");
    try {
      const res = await fetch(`${SERVER_URL}/create_preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            discountedPrice: item.discountedPrice,
            quantity: item.quantity,
            image: item.image,
          })),
          payer: user ? { email: user.email } : undefined,
        }),
      });

      if (!res.ok) throw new Error("Error del servidor");

      const data = await res.json();

      // En pruebas usar sandbox_init_point, en producción init_point
      const url = data.init_point || data.sandbox_init_point;
      if (!url) throw new Error("No se recibió URL de pago");

      // Redirigir a MercadoPago
      window.location.href = url;

    } catch (err) {
      console.error(err);
      setMpError("No se pudo conectar con el servidor de pagos. Intentá de nuevo.");
    } finally {
      setLoadingMP(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center px-4">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Tu carrito esta vacio
            </h1>
            <p className="text-muted-foreground mb-6">
              Explora nuestra tienda y encuentra algo para ti.
            </p>
            <Link to="/tienda">
              <Button variant="bubble">
                Explorar tienda
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
            Tu carrito
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const effectivePrice = item.discountedPrice ?? item.price;
                const hasDiscount = !!item.discountedPrice;

                return (
                  <article
                    key={item.id}
                    className="bg-card rounded-2xl p-4 shadow-soft flex gap-4 animate-scale-in"
                  >
                    <Link to={`/producto/${item.id}`} className="shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 md:w-28 md:h-28 object-contain rounded-xl bg-muted"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/producto/${item.id}`}>
                          <h3 className="font-display font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        {hasDiscount && (
                          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            <Tag className="h-3 w-3" />
                            13% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.color}</p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-muted rounded-full">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 flex items-center justify-center hover:bg-card rounded-full transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 flex items-center justify-center hover:bg-card rounded-full transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-display font-bold text-foreground block">
                              ${(effectivePrice * item.quantity).toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-muted-foreground line-through">
                                ${(item.price * item.quantity).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24">
                <h2 className="font-display font-bold text-lg text-foreground mb-6">
                  Resumen
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">Sin costo</span>
                      ) : (
                        `$${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2">
                      🌸 Agrega ${(50000 - subtotal).toLocaleString()} mas para envio sin costo
                    </p>
                  )}
                </div>

                <div className="border-t border-border my-4" />

                <div className="flex justify-between text-lg font-display font-bold">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>

                {/* Error message */}
                {mpError && (
                  <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2 mt-3">
                    {mpError}
                  </p>
                )}

                {/* Checkout button */}
                <Button
                  variant="bubble"
                  size="lg"
                  className="w-full mt-6 gap-2"
                  onClick={() => navigate("/checkout")}
                  disabled={loadingMP}
                >
                  {loadingMP ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Ir al checkout
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <Link to="/tienda" className="block text-center mt-4">
                  <Button variant="ghost" size="sm">
                    Seguir explorando
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Carrito;