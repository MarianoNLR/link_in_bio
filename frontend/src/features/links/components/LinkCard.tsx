import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Link } from '../link.types'

type LinkCardProps = {
  link: Link
  onEdit: (link: Link) => void
  onDelete?: (link: Link) => void
}

export function LinkCard({
  link,
  onEdit,
  onDelete,
}: LinkCardProps) {
  return (
    <Card className={link.isActive ? undefined : 'opacity-60'}>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-medium">{link.title}</p>
          <a
            className="block truncate text-sm text-muted-foreground hover:underline"
            href={link.url}
            target="_blank"
            rel="noreferrer"
          >
            {link.url}
          </a>
          <p className="mt-1 text-xs text-muted-foreground">
            {link.clickCount} clics
            {link.platform ? ` · ${link.platform.name}` : ''}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            className="cursor-pointer"
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(link)}
          >
            Editar
          </Button>
          {onDelete && (
            <Button
              className="cursor-pointer"
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onDelete(link)}
            >
              Eliminar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
