import teclado2 from "@/assets/teclado2.png";
import caseImg from "@/assets/case.png";
import mousepad2Img from "@/assets/mousepad2.png";
import teclado from "@/assets/teclado.png";

export type Collection = {
  id: string;           // slug para la URL: /colecciones/sakura-set
  name: string;
  tagline: string;
  description: string;
  coverImage: string;   // imagen principal de la coleccion
  accentColor: string;  // clase tailwind para el color de acento
  productIds: string[]; // IDs de productos en productsData.ts
  tags?: string[];
};

export const allCollections: Collection[] = [
  {
    id: "sakura-set",
    name: "Sakura Set",
    tagline: "El setup que florece",
    description:
      "Una coleccion pensada para quienes quieren un setup coherente en tonos rosa pastel. Audio, control y teclado en una sola paleta.",
    coverImage: teclado2,
    accentColor: "from-pink-100 to-rose-50",
    productIds: ["12", "1", "13"], // auricular sakura, mouse sakura, teclado pastel
    tags: ["pastel", "pink", "completo"],
  },
  {
    id: "rgb-build",
    name: "RGB Build",
    tagline: "Todos miran tu brillo",
    description:
      "Case, iluminación y teclado RGB para armar un setup que brilla desde adentro hacia afuera.",
    coverImage: mousepad2Img,
    accentColor: "from-purple-50 to-pink-50",
    productIds: ["10", "11", "3"], // mousepad floral, led strip, stand
    tags: ["desk", "iluminacion", "aesthetic"],
  },
  {
    id: "all-in",
    name: "All in Setup",
    tagline: "Comenzá acá",
    description:
      "Case, Monitor y silla. Los escenciales para transformar tu espacio.",
    coverImage: caseImg,
    accentColor: "from-violet-50 to-purple-50",
    productIds: ["4", "6", "15"], // case rgb, led strip, keycaps
    tags: ["rgb", "build", "gaming"],
  },

];