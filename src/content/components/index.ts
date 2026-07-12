import { dialog } from "./dialog";
import { slider } from "./slider";
import { marquee } from "./marquee";
import { animate } from "./animate";

export type { ComponentDoc, ComponentDemo } from "./types";

export const componentsDocs = [dialog, slider, marquee, animate].sort((a, b) => a.title.localeCompare(b.title));
