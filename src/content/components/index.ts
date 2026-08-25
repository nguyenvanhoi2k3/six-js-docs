import { dialog } from "./dialog";
import { slider } from "./slider";
import { marquee } from "./marquee";
import { accordion } from "./accordion";
import { popover } from "./popover";
import { imageCompare } from "./image-compare";
import { grid } from "./grid";
import { toast } from "./toast";
import { tooltip } from "./tooltip";

export type { ComponentDoc, ComponentDemo } from "./types";

export const componentsDocs = [dialog, slider, marquee, accordion, popover, imageCompare, grid, toast, tooltip].sort((a, b) => a.title.localeCompare(b.title));
