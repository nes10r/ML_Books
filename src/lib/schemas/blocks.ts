import { z } from "zod";
import { idSchema, slugSchema } from "./primitives";

/**
 * Props of the embeddable blocks authors can place inside lesson MDX.
 * Components parse their props with this schema so a typo in MDX fails
 * loudly instead of rendering an empty box.
 */
export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("demo"), demoId: slugSchema }),
  z.object({ type: z.literal("code"), codeExampleId: idSchema }),
  z.object({ type: z.literal("media"), mediaId: idSchema }),
  z.object({ type: z.literal("term"), termId: slugSchema }),
  z.object({ type: z.literal("dataset"), datasetId: slugSchema }),
  z.object({
    type: z.literal("callout"),
    variant: z.enum(["info", "tip", "warning", "insight"]),
  }),
]);
export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type CalloutVariant = Extract<ContentBlock, { type: "callout" }>["variant"];
