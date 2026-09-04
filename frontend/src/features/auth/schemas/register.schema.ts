import { z } from "zod"

export const registerSchema = z
  .object({
    email: z.email("Ingresa un email válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(72, "La contraseña debe tener como máximo 72 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "La confirmación debe tener al menos 8 caracteres")
      .max(72, "La confirmación debe tener como máximo 72 caracteres"),
    username: z
      .string()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(30, "El nombre de usuario debe tener como máximo 30 caracteres"),
    displayName: z
      .string()
      .min(1, "El nombre para mostrar es obligatorio")
      .max(50, "El nombre para mostrar debe tener como máximo 50 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
