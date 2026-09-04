import type { Link } from '../link.types'

type PublicLinkItemProps = {
  link: Link
  onVisit?: (link: Link) => void
}

export function PublicLinkItem({ link, onVisit }: PublicLinkItemProps) {
  return (
    <a
      className="block w-full rounded-xl border bg-card px-4 py-3 text-center font-medium text-card-foreground transition-colors hover:bg-muted"
      href={link.url}
      target="_blank"
      rel="noreferrer"
      onClick={() => onVisit?.(link)}
    >
      {link.title}
    </a>
  )
}
