import {
  useSortable,
  defaultAnimateLayoutChanges,
  type AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { LinkCard, type LinkCardProps } from "./LinkCard";

type SortableLinkCardProps = Omit<LinkCardProps, "dragHandle"> & {
  disabled?: boolean;
};

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  if (args.wasDragging) {
    return false;
  }

  return defaultAnimateLayoutChanges(args);
};

export function SortableLinkCard({
  disabled = false,
  ...props
}: SortableLinkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.link.id,
    disabled,
    animateLayoutChanges,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "relative z-10 opacity-70" : undefined}
    >
      <LinkCard
        {...props}
        dragHandle={
          <button
            ref={setActivatorNodeRef}
            type="button"
            className="shrink-0 touch-none cursor-grab rounded p-2 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring active:cursor-grabbing disabled:cursor-default disabled:opacity-50"
            {...attributes}
            {...listeners}
            disabled={disabled}
            aria-label={`Cambiar orden de ${props.link.title}`}
          >
            <GripVertical className="size-5" aria-hidden="true" />
          </button>
        }
      />
    </div>
  );
}
