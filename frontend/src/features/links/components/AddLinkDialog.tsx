import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    handleSubmit,
    formState: { errors },
  } = useForm<AddLinkFormInput, unknown, AddLinkFormValues>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: { title: '', url: '', platformId: '', position: '' },
  })

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
            <select
              id="add-link-platform"
              aria-invalid={Boolean(errors.platformId)}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
              {...register('platformId')}
            >
              <option value="">Link personalizado</option>
              {platforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
            {errors.platformId && (
              <p className="text-sm text-destructive">{errors.platformId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-link-position">Posición</Label>
            <Input
              id="add-link-position"
              type="number"
              min={0}
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
