import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft, MapPin, User, CreditCard,
  Package, CheckCircle, Lock, Home, Building2, Loader2
} from "lucide-react";
import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/authContext";
import { cn } from "@/lib/utils";


const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";
const FREE_SHIPPING_THRESHOLD = 70000;

type Carrier = "correo-argentino" | "oca";
type DeliveryType = "domicilio" | "sucursal";

interface FormData {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  floor: string;
  carrier: Carrier;
  deliveryType: DeliveryType;
}

const PROVINCES = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán",
];

const SHIPPING_COSTS: Record<Carrier, Record<DeliveryType, number>> = {
  "correo-argentino": { domicilio: 4500, sucursal: 2800 },
  "oca": { domicilio: 5200, sucursal: 3200 },
};

const CARRIER_INFO: Record<Carrier, { name: string; days: Record<DeliveryType, string> }> = {
  "correo-argentino": {
    name: "Correo Argentino",
    days: { domicilio: "5-10 días hábiles", sucursal: "4-8 días hábiles" },
  },
  "oca": {
    name: "OCA",
    days: { domicilio: "3-7 días hábiles", sucursal: "2-5 días hábiles" },
  },
};

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { isLoggedIn, user, updateProfileData, profileData } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loadingMP, setLoadingMP] = useState(false);
  const [mpError, setMpError] = useState("");

  const [form, setForm] = useState<FormData>({
    firstName: profileData?.firstName || user?.name?.split(" ")[0] || "",
    lastName: profileData?.lastName || user?.name?.split(" ").slice(1).join(" ") || "",
    dni: profileData?.dni || "",
    phone: profileData?.phone || "",
    province: profileData?.province || "",
    city: profileData?.city || "",
    address: profileData?.address || "",
    postalCode: profileData?.postalCode || "",
    floor: "",
    carrier: "correo-argentino",
    deliveryType: "domicilio",
  });

  // Sincronizar el form si profileData llega después del montaje (ej: desde localStorage)
  useEffect(() => {
    if (profileData) {
      setForm((prev) => ({
        ...prev,
        firstName: profileData.firstName || prev.firstName,
        lastName: profileData.lastName || prev.lastName,
        dni: profileData.dni || prev.dni,
        phone: profileData.phone || prev.phone,
        province: profileData.province || prev.province,
        city: profileData.city || prev.city,
        address: profileData.address || prev.address,
        postalCode: profileData.postalCode || prev.postalCode,
      }));
    }
  }, [profileData]);

  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = freeShipping ? 0 : SHIPPING_COSTS[form.carrier][form.deliveryType];
  const total = subtotal + shippingCost;

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Requerido";
    if (!form.lastName.trim()) newErrors.lastName = "Requerido";
    if (!form.dni.trim() || !/^\d{7,8}$/.test(form.dni.trim()))
      newErrors.dni = "DNI inválido (7-8 dígitos)";
    if (!form.phone.trim() || !/^\d{8,15}$/.test(form.phone.replace(/\s/g, "")))
      newErrors.phone = "Teléfono inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.province) newErrors.province = "Seleccioná una provincia";
    if (!form.city.trim()) newErrors.city = "Requerido";
    if (form.deliveryType === "domicilio") {
      if (!form.address.trim()) newErrors.address = "Requerido para envío a domicilio";
      if (!form.postalCode.trim() || !/^\d{4}$/.test(form.postalCode.trim()))
        newErrors.postalCode = "Código postal inválido (4 dígitos)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleConfirm = async () => {
    setLoadingMP(true);
    setMpError("");
    try {
      const items: Array<{
        id: string; name: string; price: number;
        discountedPrice?: number; quantity: number; image: string;
      }> = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        discountedPrice: item.discountedPrice,
        quantity: item.quantity,
        image: item.image,
      }));

      if (!freeShipping) {
        items.push({
          id: "envio",
          name: `Envío ${CARRIER_INFO[form.carrier].name} – ${form.deliveryType === "domicilio" ? "A domicilio" : "A sucursal"}`,
          price: shippingCost,
          discountedPrice: undefined,
          quantity: 1,
          image: "",
        });
      }

      const res = await fetch(`${SERVER_URL}/create_preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          payer: user ? { email: user.email } : undefined,
        }),
      });

      if (!res.ok) throw new Error("Error del servidor");

      const data = await res.json();
      const url = data.init_point || data.sandbox_init_point;
      if (!url) throw new Error("No se recibió URL de pago");

      clearCart();
      // Guardar datos del perfil para el próximo checkout
      updateProfileData({
        firstName: form.firstName,
        lastName: form.lastName,
        dni: form.dni,
        phone: form.phone,
        province: form.province,
        city: form.city,
        address: form.address,
        postalCode: form.postalCode,
      });
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setMpError("No se pudo conectar con el servidor de pagos. Intentá de nuevo.");
    } finally {
      setLoadingMP(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background px-4">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-pink-50 flex items-center justify-center">
              <Lock className="h-9 w-9 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Iniciá sesión para continuar
            </h1>
            <p className="text-muted-foreground mb-6 text-sm">
              Necesitás una cuenta para poder hacer tu compra en Kiki.
            </p>
            <Link to="/carrito">
              <Button variant="bubble">
                <ArrowLeft className="h-4 w-4" /> Volver al carrito
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background px-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Tu carrito está vacío.</p>
            <Link to="/tienda">
              <Button variant="bubble">Explorar tienda <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { number: 1, label: "Tus datos", icon: User },
    { number: 2, label: "Envío", icon: MapPin },
    { number: 3, label: "Confirmar", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container py-8 md:py-12 max-w-5xl">
          <div className="flex items-center gap-2 mb-8">
            <Link to="/carrito" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Checkout
            </h1>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-10">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isDone = step > s.number;
              return (
                <div key={s.number} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isDone && "bg-green-500 text-white",
                      isActive && "bg-primary text-white shadow-lg shadow-primary/30",
                      !isActive && !isDone && "bg-muted text-muted-foreground",
                    )}>
                      {isDone ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span className={cn(
                      "text-xs font-medium hidden sm:block",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn(
                      "w-16 md:w-24 h-0.5 mx-2 transition-all duration-300 mb-5",
                      step > s.number ? "bg-green-500" : "bg-border"
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-6 shadow-soft">

                {/* Step 1 */}
                {step === 1 && (
                  <div className="space-y-5 animate-scale-in">
                    <h2 className="font-display font-bold text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" /> Tus datos personales
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Nombre" error={errors.firstName}>
                        <input type="text" placeholder="Ej: Valentina" value={form.firstName}
                          onChange={(e) => update("firstName", e.target.value)}
                          className={inputClass(!!errors.firstName)} />
                      </Field>
                      <Field label="Apellido" error={errors.lastName}>
                        <input type="text" placeholder="Ej: García" value={form.lastName}
                          onChange={(e) => update("lastName", e.target.value)}
                          className={inputClass(!!errors.lastName)} />
                      </Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="DNI" error={errors.dni}>
                        <input type="text" placeholder="Ej: 40123456" maxLength={8} value={form.dni}
                          onChange={(e) => update("dni", e.target.value.replace(/\D/g, ""))}
                          className={inputClass(!!errors.dni)} />
                      </Field>
                      <Field label="Teléfono / WhatsApp" error={errors.phone}>
                        <input type="tel" placeholder="Ej: 11 1234 5678" value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          className={inputClass(!!errors.phone)} />
                      </Field>
                    </div>
                    <div className="flex items-center gap-2 bg-pink-50 rounded-xl p-3 text-sm text-muted-foreground">
                      <span className="text-base">📧</span>
                      <span>Email de contacto: <strong className="text-foreground">{user?.email}</strong></span>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="space-y-6 animate-scale-in">
                    <h2 className="font-display font-bold text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" /> Datos de envío
                    </h2>

                    {/* Delivery type */}
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-3">Tipo de entrega</p>
                      <div className="grid grid-cols-2 gap-3">
                        {(["domicilio", "sucursal"] as DeliveryType[]).map((type) => (
                          <button key={type} onClick={() => update("deliveryType", type)}
                            className={cn(
                              "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all",
                              form.deliveryType === type ? "border-primary bg-pink-50" : "border-border bg-card hover:border-primary/40"
                            )}>
                            {type === "domicilio"
                              ? <Home className={cn("h-6 w-6", form.deliveryType === type ? "text-primary" : "text-muted-foreground")} />
                              : <Building2 className={cn("h-6 w-6", form.deliveryType === type ? "text-primary" : "text-muted-foreground")} />
                            }
                            <span className={cn("text-sm font-semibold", form.deliveryType === type ? "text-foreground" : "text-muted-foreground")}>
                              {type === "domicilio" ? "A domicilio" : "A sucursal"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Provincia" error={errors.province}>
                        <select value={form.province} onChange={(e) => update("province", e.target.value)}
                          className={inputClass(!!errors.province)}>
                          <option value="">Seleccioná una provincia</option>
                          {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </Field>
                      <Field label="Ciudad / Localidad" error={errors.city}>
                        <input type="text" placeholder="Ej: Palermo" value={form.city}
                          onChange={(e) => update("city", e.target.value)}
                          className={inputClass(!!errors.city)} />
                      </Field>
                    </div>

                    {form.deliveryType === "domicilio" && (
                      <>
                        <Field label="Calle y número" error={errors.address}>
                          <input type="text" placeholder="Ej: Av. Santa Fe 1234" value={form.address}
                            onChange={(e) => update("address", e.target.value)}
                            className={inputClass(!!errors.address)} />
                        </Field>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Field label="Código Postal" error={errors.postalCode}>
                            <input type="text" placeholder="Ej: 1425" maxLength={4} value={form.postalCode}
                              onChange={(e) => update("postalCode", e.target.value.replace(/\D/g, ""))}
                              className={inputClass(!!errors.postalCode)} />
                          </Field>
                          <Field label="Piso / Depto (opcional)">
                            <input type="text" placeholder="Ej: 3° B" value={form.floor}
                              onChange={(e) => update("floor", e.target.value)}
                              className={inputClass(false)} />
                          </Field>
                        </div>
                      </>
                    )}

                    {form.deliveryType === "sucursal" && (
                      <div className="bg-muted rounded-xl p-3 text-sm text-muted-foreground">
                        📦 Retirás en la sucursal más cercana a tu localidad. Te avisamos por email cuando esté listo.
                      </div>
                    )}

                    {/* Carrier */}
                    {!freeShipping && (
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" /> Transportista
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {(["correo-argentino", "oca"] as Carrier[]).map((carrier) => (
                            <button key={carrier} onClick={() => update("carrier", carrier)}
                              className={cn(
                                "relative flex flex-col items-start gap-1 rounded-2xl border-2 p-4 transition-all text-left",
                                form.carrier === carrier ? "border-primary bg-pink-50" : "border-border bg-card hover:border-primary/40"
                              )}>
                              {form.carrier === carrier && (
                                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                                </span>
                              )}
                              <span className="font-semibold text-sm text-foreground">{CARRIER_INFO[carrier].name}</span>
                              <p className="text-xs text-muted-foreground">{CARRIER_INFO[carrier].days[form.deliveryType]}</p>
                              <p className="text-sm font-bold text-primary mt-1">${SHIPPING_COSTS[carrier][form.deliveryType].toLocaleString()}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {freeShipping && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>¡Tu compra supera ${FREE_SHIPPING_THRESHOLD.toLocaleString()} — el envío es sin costo! 🎉</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="space-y-5 animate-scale-in">
                    <h2 className="font-display font-bold text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" /> Revisá tu pedido
                    </h2>

                    <div className="rounded-xl bg-muted p-4 space-y-2 text-sm">
                      <SummaryRow label="Nombre" value={`${form.firstName} ${form.lastName}`} />
                      <SummaryRow label="DNI" value={form.dni} />
                      <SummaryRow label="Teléfono" value={form.phone} />
                      <SummaryRow label="Email" value={user?.email ?? ""} />
                    </div>

                    <div className="rounded-xl bg-muted p-4 space-y-2 text-sm">
                      <SummaryRow label="Provincia" value={form.province} />
                      <SummaryRow label="Ciudad" value={form.city} />
                      <SummaryRow label="Entrega" value={form.deliveryType === "domicilio" ? "A domicilio" : "A sucursal"} />
                      {form.deliveryType === "domicilio" && (
                        <SummaryRow label="Dirección" value={`${form.address}${form.floor ? ` – ${form.floor}` : ""}, CP ${form.postalCode}`} />
                      )}
                      <SummaryRow label="Transportista" value={CARRIER_INFO[form.carrier].name} />
                      <SummaryRow label="Costo de envío" value={freeShipping ? "Sin costo 🎉" : `$${shippingCost.toLocaleString()}`} />
                    </div>

                    <div className="rounded-xl bg-pink-50 border border-primary/20 p-4 space-y-1.5 text-sm">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-muted-foreground line-clamp-1 max-w-[70%]">{item.name} x{item.quantity}</span>
                          <span className="font-medium">${((item.discountedPrice ?? item.price) * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t border-primary/10">
                        <span className="text-muted-foreground">Envío</span>
                        <span className={freeShipping ? "text-green-600 font-medium" : "font-medium"}>
                          {freeShipping ? "Sin costo" : `$${shippingCost.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 font-bold text-foreground text-base">
                        <span>Total</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                    </div>

                    {mpError && (
                      <p className="text-xs text-red-500 bg-red-50 rounded-lg p-3">{mpError}</p>
                    )}

                    <div className="flex items-center gap-2 bg-muted rounded-xl p-3 text-xs text-muted-foreground">
                      <span>🔒</span>
                      <span>Este es un checkout de demostración. No se realizará ningún cobro real.</span>
                    </div>
                  </div>
                )}

                {/* Nav buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  {step > 1 ? (
                    <Button variant="ghost" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}>
                      <ArrowLeft className="h-4 w-4" /> Atrás
                    </Button>
                  ) : (
                    <Link to="/carrito">
                      <Button variant="ghost"><ArrowLeft className="h-4 w-4" /> Volver al carrito</Button>
                    </Link>
                  )}

                  {step < 3 ? (
                    <Button variant="bubble" onClick={handleNext}>
                      Continuar <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="bubble" onClick={handleConfirm} disabled={loadingMP} className="gap-2">
                      {loadingMP
                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</>
                        : <><CreditCard className="h-4 w-4" /> Ir al pago</>
                      }
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24">
                <h3 className="font-display font-bold text-base mb-4">Tu pedido</h3>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name}
                        className="w-12 h-12 rounded-lg object-contain bg-muted shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-2 text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold shrink-0">
                        ${((item.discountedPrice ?? item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span><span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    {freeShipping
                      ? <span className="text-green-600 font-medium">Sin costo</span>
                      : <span>${shippingCost.toLocaleString()}</span>
                    }
                  </div>
                  {!freeShipping && (
                    <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2">
                      🌸 Sumá ${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} más para envío sin costo
                    </p>
                  )}
                  <div className="flex justify-between font-display font-bold text-foreground text-base pt-1 border-t border-border">
                    <span>Total</span><span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
    hasError ? "border-red-400 bg-red-50" : "border-border"
  );

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-foreground">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground shrink-0">{label}</span>
    <span className="font-medium text-right text-foreground">{value}</span>
  </div>
);

export default Checkout;