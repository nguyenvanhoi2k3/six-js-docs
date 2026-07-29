import type { ContentMap } from "../../layout/section-router/content-types";
import { tweenContent } from "./tween";
import { sequenceContent } from "./sequence";
import { scrollContent } from "./scroll";
import { scopeContent } from "./scope";
import { utilsContent } from "./utils";

const coreContent: ContentMap = {
  ...tweenContent,
  ...sequenceContent,
  ...scrollContent,
  ...scopeContent,
  ...utilsContent,
};

export { coreContent };
