import auricular from "@/assets/auricular.png";
import auricular2 from "@/assets/auricular2.png";
import caseImg from "@/assets/case.png";
import case2Img from "@/assets/case2.png";
import keycap from "@/assets/keycap.png";
import monitor from "@/assets/monitor.png";
import mouse from "@/assets/mouse.png";
import mousepad from "@/assets/mousepad.png";
import stand from "@/assets/stand.png";
import teclado from "@/assets/teclado.png";
import ledstripes from "@/assets/ledstripes.png";
import teclado2 from "@/assets/teclado2.png";
import mouse2 from "@/assets/mouse2.png";
import mousepad2 from "@/assets/mousepad2.png";
import silla from "@/assets/silla.png";

export const imageMap: Record<string, string> = {
  auricular,
  auricular2,
  case: caseImg,
  case2: case2Img,
  keycap,
  monitor,
  mouse,
  mousepad,
  stand,
  teclado,
  ledstripes,
  teclado2,
  mouse2,
  mousepad2,
  silla,
};

export const getImage = (key: string): string => imageMap[key] ?? "";