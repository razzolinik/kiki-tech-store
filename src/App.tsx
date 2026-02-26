import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/cartContext";
import { AuthProvider } from "./context/authContext";
import ScrollToTop from "./components/ScrollToTop";
import Perfil from "./pages/Perfil";

import Index from "./pages/Index";
import Tienda from "./pages/Tienda";
import Producto from "./pages/Producto";
import Carrito from "./pages/Carrito";
import Colecciones from "./pages/Colecciones";
import Coleccion from "./pages/Coleccion";
import Favoritos from "./pages/Favoritos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/tienda" element={<Tienda />} />
                <Route path="/producto/:id" element={<Producto />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/colecciones" element={<Colecciones />} />
                <Route path="/colecciones/:id" element={<Coleccion />} />
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="/perfil" element={<Perfil />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;