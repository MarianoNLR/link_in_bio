import { useState } from "react";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useCreateLink,
  useDeleteLink,
  useUpdateLink,
  useReorderLinks,
  useLinks,
} from "../api/links.queries";
import { usePlatforms } from "@/features/platforms/api/platforms.queries";
import type { Link } from "../link.types";
import type { AddLinkFormValues } from "../schemas/add-link.schema";
import { AddLinkDialog } from "./AddLinkDialog";
import { DeleteLinkDialog } from "./DeleteLinkDialog";
import { EditLinkDialog, type EditLinkData } from "./EditLinkDialog";
import { SortableLinkCard } from "./SortableLinkCard";

export function LinkList() {
  const { data: links = [], isPending, isError } = useLinks();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [deletingLink, setDeletingLink] = useState<Link | null>(null);
  const { data: platforms = [] } = usePlatforms();
  const updateLink = useUpdateLink();
  const deleteLink = useDeleteLink();
  const createLink = useCreateLink();
  const reorderLinks = useReorderLinks();
  const [pendingOrder, setPendingOrder] = useState<string[] | null>(null);
  const sortedLinks = (() => {
    if (!pendingOrder) {
      return [...links].sort((a, b) => a.position - b.position);
    }
    const byId = new Map(links.map((l) => [l.id, l]));
    return pendingOrder
      .map((id) => byId.get(id))
      .filter((l): l is Link => l !== undefined);
  })();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id || reorderLinks.isPending) {
      return;
    }

    const oldIndex = sortedLinks.findIndex((link) => link.id === active.id);

    const newIndex = sortedLinks.findIndex((link) => link.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedIds = arrayMove(sortedLinks, oldIndex, newIndex).map(
      (link) => link.id,
    );
    setPendingOrder(reorderedIds);
    reorderLinks.mutate(reorderedIds, {
      onSettled: () => setPendingOrder(null),
      onError: () => toast.error("No se pudo guardar el orden de los links."),
    });
  };

  const handleAddSubmit = (data: AddLinkFormValues) => {
    createLink.mutate(data, {
      onSuccess: () => setIsAddDialogOpen(false),
    });
  };

  const handleEditSubmit = (linkId: string, data: EditLinkData) => {
    updateLink.mutate(
      { linkId, data },
      { onSuccess: () => setEditingLink(null) },
    );
  };

  const handleDeleteConfirm = (link: Link) => {
    deleteLink.mutate(link.id, {
      onSuccess: () => setDeletingLink(null),
    });
  };

  if (isPending) {
    return <p>Cargando links...</p>;
  }

  if (isError) {
    return <p role="alert">No se pudieron cargar los links.</p>;
  }

  return (
    <>
      {links.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Todavía no agregaste ningún link.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event)}
        >
          <SortableContext
            items={sortedLinks.map((link) => link.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {sortedLinks.map((link) => (
                <SortableLinkCard
                  key={link.id}
                  link={link}
                  disabled={
                    reorderLinks.isPending ||
                    createLink.isPending ||
                    updateLink.isPending ||
                    deleteLink.isPending
                  }
                  onEdit={setEditingLink}
                  onDelete={setDeletingLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
  );
}
