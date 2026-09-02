import z from "zod";

export const askQuestionSchema = z.object({
  question: z.string().trim().min(1),
});

export type askQuestionType = z.infer<typeof askQuestionSchema>;
