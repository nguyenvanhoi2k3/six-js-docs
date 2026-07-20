import { dialog } from "./dialog";
import { slider } from "./slider";
import { marquee } from "./marquee";

export type { ComponentDoc, ComponentDemo } from "./types";

export const componentsDocs = [dialog, slider, marquee].sort((a, b) => a.title.localeCompare(b.title));
