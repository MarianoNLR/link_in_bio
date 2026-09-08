import type { FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlatformSelect } from '@/features/platforms/components/PlatformSelect'
import type { Platform } from '@/features/platforms/types/platform.types'
import type { Link, UpdateLinkInput } from '../link.types'

export type EditLinkData = UpdateLinkInput

type EditLinkDialogProps = {
  open: boolean
  link: Link | null
  platforms: Platform[]
  onClose: () => void
  onSubmit: (linkId: string, data: EditLinkData) => void
}

export function EditLinkDialog({
  open,
  link,
  platforms,
  onClose,
  onSubmit,
}: EditLinkDialogProps) {
  if (!open || !link) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const platformId = String(formData.get('platformId') ?? '')

    onSubmit(link.id, {
      title: String(formData.get('title') ?? '').trim(),
      url: String(formData.get('url') ?? ''),
      platformId: platformId || undefined,
      isActive: formData.get('isActive') === 'on',
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-link-title"
    >
      <div className="w-full max-w-md rounded-xl bg-card p-6 text-card-foreground shadow-xl">
        <h2 id="edit-link-title" className="text-lg font-semibold">
          Editar link
        </h2>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-link-title-input">Título</Label>
            <Input
              id="edit-link-title-input"
              name="title"
              maxLength={50}
              defaultValue={link.title}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-link-url">URL</Label>
            <Input
              id="edit-link-url"
              name="url"
              type="url"
              required
              defaultValue={link.url}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-link-platform">Plataforma</Label>
            <PlatformSelect
              key={link.id}
              id="edit-link-platform"
              name="platformId"
              platforms={platforms}
              defaultValue={link.platform?.id ?? ''}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="edit-link-active"
              name="isActive"
              type="checkbox"
              defaultChecked={link.isActive}
              className="size-4 cursor-pointer accent-primary"
            />
            <Label className="cursor-pointer" htmlFor="edit-link-active">
              Link activo
            </Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button className="cursor-pointer" type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
