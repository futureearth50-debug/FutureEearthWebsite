// Client references + technology partners — real supplied logos.
// Displayed together in a unified monochrome engineering strip (color on hover).

import tawal from "@/assets/logos/clients/tawal.webp";
import alNaboodah from "@/assets/logos/clients/al-naboodah.webp";
import theVillage from "@/assets/logos/clients/the-village.webp";
import hypeEnergy from "@/assets/logos/clients/hype-energy.webp";
import hamat from "@/assets/logos/clients/hamat.webp";
import alMunajem from "@/assets/logos/clients/al-munajem-foods.webp";
import dewa from "@/assets/logos/clients/dewa.webp";
import alHabib from "@/assets/logos/clients/mohammed-al-habib.webp";

import abb from "@/assets/logos/partners/abb.webp";
import alfanar from "@/assets/logos/partners/alfanar.webp";
import elsewedy from "@/assets/logos/partners/elsewedy-electric.webp";
import huawei from "@/assets/logos/partners/huawei.webp";
import jaSolar from "@/assets/logos/partners/ja-solar.webp";
import jinko from "@/assets/logos/partners/jinko-solar.webp";
import longi from "@/assets/logos/partners/longi-solar.webp";
import lybess from "@/assets/logos/partners/lybess.webp";
import masdar from "@/assets/logos/partners/masdar.webp";
import mesc from "@/assets/logos/partners/mesc.webp";
import riyadhCables from "@/assets/logos/partners/riyadh-cables.webp";
import sav from "@/assets/logos/partners/sav.webp";
import schneider from "@/assets/logos/partners/schneider-electric.webp";
import sungrow from "@/assets/logos/partners/sungrow.webp";

export type Logo = { name: string; src: string };

export const clientLogos: Logo[] = [
  { name: "Al Munajem Foods", src: alMunajem },
  { name: "The Village", src: theVillage },
  { name: "DEWA", src: dewa },
  { name: "TAWAL", src: tawal },
  { name: "Al Naboodah", src: alNaboodah },
  { name: "Mohammed Al Habib", src: alHabib },
  { name: "Hamat", src: hamat },
  { name: "Hype Energy", src: hypeEnergy },
];

export const partnerLogos: Logo[] = [
  { name: "Huawei", src: huawei },
  { name: "SUNGROW", src: sungrow },
  { name: "ABB", src: abb },
  { name: "Schneider Electric", src: schneider },
  { name: "Alfanar", src: alfanar },
  { name: "Elsewedy Electric", src: elsewedy },
  { name: "JinkoSolar", src: jinko },
  { name: "LONGi Solar", src: longi },
  { name: "JA Solar", src: jaSolar },
  { name: "Masdar", src: masdar },
  { name: "Riyadh Cables", src: riyadhCables },
  { name: "MESC", src: mesc },
  { name: "LYBESS", src: lybess },
  { name: "SAV", src: sav },
];

export const allLogos: Logo[] = [...clientLogos, ...partnerLogos];
