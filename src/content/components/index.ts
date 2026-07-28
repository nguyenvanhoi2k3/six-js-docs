import { dialog } from "./dialog";
import { slider } from "./slider";
import { marquee } from "./marquee";
import { accordion } from "./accordion";
import { popover } from "./popover";

export type { ComponentDoc, ComponentDemo } from "./types";

export const componentsDocs = [dialog, slider, marquee, accordion, popover].sort((a, b) => a.title.localeCompare(b.title));
