import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlatformSelect } from '@/features/platforms/components/PlatformSelect'
import type { Platform } from '@/features/platforms/types/platform.types'
import {
  addLinkSchema,
  type AddLinkFormInput,
  type AddLinkFormValues,
} from '../schemas/add-link.schema'

type AddLinkDialogProps = {
  open: boolean
  platforms: Platform[]
  isPending?: boolean
  onClose: () => void
  onSubmit: (data: AddLinkFormValues) => void
}

export function AddLinkDialog({
  open,
  platforms,
  isPending = false,
  onClose,
  onSubmit,
}: AddLinkDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddLinkFormInput, unknown, AddLinkFormValues>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: { title: '', url: '', platformId: '', position: '' },
  })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-link-dialog-title"
    >
      <div className="w-full max-w-md rounded-xl bg-card p-6 text-card-foreground shadow-xl">
        <h2 id="add-link-dialog-title" className="text-lg font-semibold">
          Agregar link
        </h2>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="add-link-title">Título</Label>
            <Input
              id="add-link-title"
              maxLength={50}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'add-link-title-error' : undefined}
              {...register('title')}
            />
            {errors.title && (
              <p id="add-link-title-error" className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-link-url">URL</Label>
            <Input
              id="add-link-url"
              type="url"
              aria-invalid={Boolean(errors.url)}
              aria-describedby={errors.url ? 'add-link-url-error' : undefined}
              {...register('url')}
            />
            {errors.url && (
              <p id="add-link-url-error" className="text-sm text-destructive">
                {errors.url.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-link-platform">Plataforma</Label>
            <Controller
              name="platformId"
              control={control}
              render={({ field }) => (
                <PlatformSelect
                  id="add-link-platform"
                  platforms={platforms}
                  name={field.name}
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  invalid={Boolean(errors.platformId)}
                />
              )}
            />
            {errors.platformId && (
              <p className="text-sm text-destructive">{errors.platformId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-link-position">Posición</Label>
            <Input
              id="add-link-position"
              type="number"
              min={1}
              placeholder="Al final si queda vacío"
              aria-invalid={Boolean(errors.position)}
              {...register('position')}
            />
            {errors.position && (
              <p className="text-sm text-destructive">{errors.position.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button className="cursor-pointer" type="submit" disabled={isPending}>
              {isPending ? 'Agregando...' : 'Agregar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
