import { z } from "zod"

const emptyStringToUndefined = z.literal("").transform(() => undefined)

export const profileSchema = z.object({
  username: z
    .union([
      emptyStringToUndefined,
      z
        .string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .max(30, "El nombre de usuario debe tener como máximo 30 caracteres"),
    ])
    .optional(),
  displayName: z
    .union([
      emptyStringToUndefined,
      z
        .string()
        .min(1, "El nombre para mostrar es obligatorio")
        .max(50, "El nombre para mostrar debe tener como máximo 50 caracteres"),
    ])
    .optional(),
  bio: z
    .union([
      emptyStringToUndefined,
      z.string().max(160, "La biografía debe tener como máximo 160 caracteres"),
    ])
    .optional(),
  avatarUrl: z
    .union([emptyStringToUndefined, z.url("Ingresa una URL válida")])
    .optional(),
  isPublic: z.boolean().optional(),
})

export type ProfileFormInput = z.input<typeof profileSchema>
export type ProfileFormValues = z.output<typeof profileSchema>
