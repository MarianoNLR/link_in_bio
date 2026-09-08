import { z } from 'zod'

const emptyStringToUndefined = z.literal('').transform(() => undefined)

export const addLinkSchema = z.object({
  title: z
    .union([
      emptyStringToUndefined,
      z.string().max(50, 'El título debe tener como máximo 50 caracteres'),
    ])
    .optional(),
  url: z.url('Ingresa una URL válida'),
  platformId: z
    .union([emptyStringToUndefined, z.uuid('Selecciona una plataforma válida')])
    .optional(),
  position: z
    .union([
      emptyStringToUndefined,
      z.coerce
        .number()
        .int('La posición debe ser un número entero')
        .min(1, 'La posición debe ser al menos 1')
        .transform((position) => position - 1),
    ])
    .optional(),
})

export type AddLinkFormInput = z.input<typeof addLinkSchema>
export type AddLinkFormValues = z.output<typeof addLinkSchema>
