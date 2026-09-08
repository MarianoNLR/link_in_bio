import type { PublicLink } from '../link.types'
import { PublicLinkItem } from './PublicLinkItem'

type PublicLinkListProps = {
  links: PublicLink[]
  onVisit?: (link: PublicLink) => void
}

export function PublicLinkList({ links, onVisit }: PublicLinkListProps) {
  const sortedLinks = [...links].sort((a, b) => a.position - b.position)

  return (
    <section aria-label="Enlaces del perfil">
      {sortedLinks.length === 0 ? (
        <p className="text-center text-sm opacity-60">Todavía no hay enlaces publicados.</p>
      ) : (
        <ul className="space-y-3">
          {sortedLinks.map((link) => (
            <li key={link.id}>
              <PublicLinkItem link={link} onVisit={onVisit} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
