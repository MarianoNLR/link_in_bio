import { Button } from '@/components/ui/button'
import type { Link } from '../link.types'

type DeleteLinkDialogProps = {
  open: boolean
  link: Link | null
  isPending?: boolean
  onClose: () => void
  onConfirm: (link: Link) => void
}

export function DeleteLinkDialog({
  open,
  link,
  isPending = false,
  onClose,
  onConfirm,
}: DeleteLinkDialogProps) {
  if (!open || !link) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-link-title"
      aria-describedby="delete-link-description"
    >
      <div className="w-full max-w-md rounded-xl bg-card p-6 text-card-foreground shadow-xl">
        <h2 id="delete-link-title" className="text-lg font-semibold">
          Eliminar link
        </h2>
        <p
          id="delete-link-description"
          className="mt-2 text-sm text-muted-foreground"
        >
          ¿Seguro que quieres eliminar “{link.title}”? Esta acción no se puede
          deshacer.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            className="cursor-pointer"
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="cursor-pointer"
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => onConfirm(link)}
          >
            {isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
