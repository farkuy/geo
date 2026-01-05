import { z } from "zod";

export const Form2Schema = z.object({
  title: z
    .string()
    .min(2, { message: "Имя должно содержать минимум 2 символа" }),
});

export type Form2DataScheme = z.infer<typeof Form2Schema>;
