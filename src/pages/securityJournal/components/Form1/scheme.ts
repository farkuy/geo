import { z } from "zod";

export const Form1Schema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно содержать минимум 2 символа" })
    .max(50, { message: "Имя слишком длинное" }),
  email: z.string().email({ message: "Некорректный email" }),
});

export type Form1DataScheme = z.infer<typeof Form1Schema>;
