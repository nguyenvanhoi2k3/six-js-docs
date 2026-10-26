import { dialog } from "./dialog";
import { slider } from "./slider";
import { marquee } from "./marquee";
import { accordion } from "./accordion";
import { popover } from "./popover";
import { imageCompare } from "./image-compare";
import { grid } from "./grid";
import { toast } from "./toast";
import { tooltip } from "./tooltip";
import { fade } from "./fade";
import { gallery } from "./gallery";
import { rangeSlider } from "./range-slider";
import { video } from "./video";
import { addCart } from "./add-cart";
import { cartSize } from "./cart-size";
import { mediaPicker } from "./media-picker";
import { product } from "./product";
import { variantLinks } from "./variant-links";

export type { ComponentDoc, ComponentDemo } from "./types";

export const componentsDocs = [
  dialog,
  slider,
  marquee,
  accordion,
  popover,
  imageCompare,
  grid,
  toast,
  tooltip,
  fade,
  gallery,
  rangeSlider,
  video,
  addCart,
  cartSize,
  mediaPicker,
  product,
  variantLinks,
].sort((a, b) => a.title.localeCompare(b.title));
