import type { ContentMap } from "../../layout/section-router/content-types";
import { tweenContent } from "./tween";
import { sequenceContent } from "./sequence";
import { scrollContent } from "./scroll";
import { scopeContent } from "./scope";
import { utilsContent } from "./utils";
import { shopifyContent } from "./shopify";

const coreContent: ContentMap = {
  ...tweenContent,
  ...sequenceContent,
  ...scrollContent,
  ...scopeContent,
  ...utilsContent,
  ...shopifyContent,
};

export { coreContent };
