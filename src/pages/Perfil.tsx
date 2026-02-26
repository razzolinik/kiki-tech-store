import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, LogOut, ArrowRight, Package, User, IdCard, Phone, MapPin, Pencil, Check, X } from "lucide-react";
import { useAuth, ProfileData } from "@/context/authContext";
import { useProducts } from "@/hooks/useProducts";

const PROVINCES = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán",
];

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

const Perfil = () => {
  const { user, isLoggedIn, logout, favorites, profileData, updateProfileData } = useAuth();
  const { products } = useProducts();
  const [editing, setEditing] = useState(false);

  const emptyForm = (): ProfileData => ({
    firstName: profileData?.firstName || "",
    lastName:  profileData?.lastName  || "",
    dni:       profileData?.dni       || "",
    phone:     profileData?.phone     || "",
    province:  profileData?.province  || "",
    city:      profileData?.city      || "",
    address:   profileData?.address   || "",
    postalCode: profileData?.postalCode || "",
  });

  const [form, setForm] = useState<ProfileData>(emptyForm);

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));
  const displayName = profileData?.firstName
    ? `${profileData.firstName} ${profileData.lastName}`.trim()
    : user?.name || "";

  const handleSave = () => { updateProfileData(form); setEditing(false); };
  const handleCancel = () => { setForm(emptyForm()); setEditing(false); };
  const startEdit = () => { setForm(emptyForm()); setEditing(true); };

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center px-4">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl">🐱</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">Iniciá sesión para ver tu perfil</h1>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">Accedé a tus favoritos, historial de compras y más.</p>
            <Link to="/"><Button variant="bubble">Ir al inicio <ArrowRight className="h-4 w-4" /></Button></Link>
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

        {/* Hero */}
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              <img src={user.picture} alt={displayName} className="h-24 w-24 rounded-full border-4 border-primary/30 shadow-soft" referrerPolicy="no-referrer" crossOrigin="anonymous" />
              <div className="text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{displayName}</h1>
                <p className="text-muted-foreground mt-1">{user.email}</p>
              </div>
              <div className="sm:ml-auto">
                <Button variant="outline" className="gap-2" onClick={logout}>
                  <LogOut className="h-4 w-4" /> Cerrar sesión
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-10 md:py-16 space-y-12">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
              <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{favorites.length}</p>
              <p className="text-sm text-muted-foreground">Favoritos</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
              <Package className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Compras</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-soft text-center col-span-2 md:col-span-1">
              <ShoppingBag className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">🐱</p>
              <p className="text-sm text-muted-foreground">Miembro Kiki</p>
            </div>
          </div>

          {/* ── Mis datos personales ── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Mis datos
              </h2>
              {!editing && (
                <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary" onClick={startEdit}>
                  <Pencil className="h-4 w-4" /> {profileData ? "Editar" : "Completar perfil"}
                </Button>
              )}
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft">
              {editing ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Nombre"><input type="text" value={form.firstName} onChange={e => setForm(f => ({...f, firstName: e.target.value}))} placeholder="Ej: Valentina" className={inputCls} /></Field>
                    <Field label="Apellido"><input type="text" value={form.lastName} onChange={e => setForm(f => ({...f, lastName: e.target.value}))} placeholder="Ej: García" className={inputCls} /></Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="DNI"><input type="text" value={form.dni} onChange={e => setForm(f => ({...f, dni: e.target.value.replace(/\D/g,"")}))} placeholder="Ej: 40123456" maxLength={8} className={inputCls} /></Field>
                    <Field label="Teléfono / WhatsApp"><input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="Ej: 11 1234 5678" className={inputCls} /></Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Provincia">
                      <select value={form.province} onChange={e => setForm(f => ({...f, province: e.target.value}))} className={inputCls}>
                        <option value="">Seleccioná una provincia</option>
                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field label="Ciudad / Localidad"><input type="text" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} placeholder="Ej: Palermo" className={inputCls} /></Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Dirección"><input type="text" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} placeholder="Ej: Av. Santa Fe 1234" className={inputCls} /></Field>
                    <Field label="Código Postal"><input type="text" value={form.postalCode} onChange={e => setForm(f => ({...f, postalCode: e.target.value.replace(/\D/g,"")}))} placeholder="Ej: 1425" maxLength={4} className={inputCls} /></Field>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="bubble" size="sm" className="gap-2" onClick={handleSave}><Check className="h-4 w-4" /> Guardar</Button>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={handleCancel}><X className="h-4 w-4" /> Cancelar</Button>
                  </div>
                </div>
              ) : !profileData || !profileData.firstName ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-3">👤</p>
                  <p className="text-muted-foreground mb-4 text-sm">Completá tus datos para un checkout más rápido.</p>
                  <Button variant="bubble" size="sm" className="gap-2" onClick={startEdit}><Pencil className="h-4 w-4" /> Completar perfil</Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <DataRow icon={<User className="h-4 w-4 text-primary" />} label="Nombre completo" value={`${profileData.firstName} ${profileData.lastName}`} />
                  <DataRow icon={<IdCard className="h-4 w-4 text-primary" />} label="DNI" value={profileData.dni || "—"} />
                  <DataRow icon={<Phone className="h-4 w-4 text-primary" />} label="Teléfono" value={profileData.phone || "—"} />
                  <DataRow icon={<MapPin className="h-4 w-4 text-primary" />} label="Ubicación" value={profileData.city && profileData.province ? `${profileData.city}, ${profileData.province}` : "—"} />
                  {profileData.address && <DataRow icon={<MapPin className="h-4 w-4 text-primary" />} label="Dirección" value={`${profileData.address}${profileData.postalCode ? ` (CP ${profileData.postalCode})` : ""}`} />}
                </div>
              )}
            </div>
          </section>

          {/* Favoritos */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Mis favoritos</h2>
              {favoriteProducts.length > 0 && (
                <Link to="/favoritos" className="text-sm text-primary hover:underline flex items-center gap-1">Ver todos <ArrowRight className="h-3 w-3" /></Link>
              )}
            </div>
            {favoriteProducts.length === 0 ? (
              <div className="bg-card rounded-2xl p-10 text-center shadow-soft">
                <p className="text-3xl mb-3">🌸</p>
                <p className="text-muted-foreground mb-4">Todavía no guardaste ningún producto.</p>
                <Link to="/tienda"><Button variant="bubble" size="sm">Explorar tienda <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoriteProducts.slice(0, 4).map((product, index) => (
                  <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Historial */}
          <section>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Historial de compras</h2>
            <div className="bg-card rounded-2xl p-10 text-center shadow-soft">
              <p className="text-3xl mb-3">📦</p>
              <p className="font-medium text-foreground mb-1">Todavía no realizaste ninguna compra</p>
              <p className="text-muted-foreground mb-4 text-sm">Cuando completes un pedido, vas a poder verlo acá.</p>
              <Link to="/tienda"><Button variant="bubble" size="sm">Ir a la tienda <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-foreground">{label}</label>
    {children}
  </div>
);

const DataRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
    <span className="mt-0.5 shrink-0">{icon}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default Perfil;