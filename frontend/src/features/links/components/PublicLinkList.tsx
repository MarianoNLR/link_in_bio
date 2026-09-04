import type { Link } from '../link.types'
import { PublicLinkItem } from './PublicLinkItem'

type PublicLinkListProps = {
  links: Link[]
  onVisit?: (link: Link) => void
}

export function PublicLinkList({ links, onVisit }: PublicLinkListProps) {
  const activeLinks = links
    .filter((link) => link.isActive)
    .sort((a, b) => a.position - b.position)

  if (activeLinks.length === 0) return null

  return (
    <div className="space-y-3">
      {activeLinks.map((link) => (
        <PublicLinkItem key={link.id} link={link} onVisit={onVisit} />
      ))}
    </div>
  )
}
