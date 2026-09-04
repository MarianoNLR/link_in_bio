import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCreateLink, useDeleteLink, useUpdateLink } from '../api/links.queries'
import { usePlatforms } from '@/features/platforms/api/platforms.queries'
import type { Link } from '../link.types'
import type { AddLinkFormValues } from '../schemas/add-link.schema'
import { AddLinkDialog } from './AddLinkDialog'
import { DeleteLinkDialog } from './DeleteLinkDialog'
import { EditLinkDialog, type EditLinkData } from './EditLinkDialog'
import { LinkCard } from './LinkCard'

type LinkListProps = {
  links: Link[]
}

export function LinkList({ links }: LinkListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [deletingLink, setDeletingLink] = useState<Link | null>(null)
  const { data: platforms = [] } = usePlatforms()
  const updateLink = useUpdateLink()
  const deleteLink = useDeleteLink()
  const createLink = useCreateLink()

  const handleAddSubmit = (data: AddLinkFormValues) => {
    createLink.mutate(data, {
      onSuccess: () => setIsAddDialogOpen(false),
    })
  }

  const handleEditSubmit = (linkId: string, data: EditLinkData) => {
    updateLink.mutate(
      { linkId, data },
      { onSuccess: () => setEditingLink(null) },
    )
  }

  const handleDeleteConfirm = (link: Link) => {
    deleteLink.mutate(link.id, {
      onSuccess: () => setDeletingLink(null),
    })
  }

  return (
    <>
      {links.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Todavía no agregaste ningún link.
        </p>
      ) : (
        <div className="space-y-3">
          {[...links]
            .sort((a, b) => a.position - b.position)
            .map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={setEditingLink}
              onDelete={setDeletingLink}
            />
            ))}
        </div>
      )}

      <div className="mt-5 flex justify-center">
        <Button
          className="cursor-pointer rounded-full"
          type="button"
          size="icon-lg"
          aria-label="Agregar link"
          title="Agregar link"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>

      <AddLinkDialog
        open={isAddDialogOpen}
        platforms={platforms}
        isPending={createLink.isPending}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddSubmit}
      />

      <EditLinkDialog
        open={editingLink !== null}
        link={editingLink}
        platforms={platforms}
        onClose={() => setEditingLink(null)}
        onSubmit={handleEditSubmit}
      />

      <DeleteLinkDialog
        open={deletingLink !== null}
        link={deletingLink}
        isPending={deleteLink.isPending}
        onClose={() => setDeletingLink(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
