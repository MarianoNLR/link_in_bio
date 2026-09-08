import { createElement } from 'react'
import { getPlatformIcon } from '@/features/platforms/lib/platform-icons'
import type { PublicLink } from '../link.types'

type PublicLinkItemProps = {
  link: PublicLink
  onVisit?: (link: PublicLink) => void
}

export function PublicLinkItem({ link, onVisit }: PublicLinkItemProps) {
  const content = (
    <span className="flex items-center gap-4 text-left">
      {createElement(getPlatformIcon(link.platform?.slug), {
        'aria-hidden': true,
        className: 'size-6 shrink-0',
      })}
      <span className="min-w-0">
        <span className="block wrap-anywhere font-semibold">{link.title}</span>
        {link.platform && (
          <span className="mt-1 block wrap-anywhere text-xs opacity-60">{link.platform.name}</span>
        )}
      </span>
    </span>
  )

  if (!link.url) {
    return (
      <div aria-disabled="true" className="rounded-2xl border border-current/10 px-5 py-4 text-center opacity-50">
        {content}
        <span className="mt-2 block text-xs">Enlace no disponible</span>
      </div>
    )
  }

  return (
    <a
      className="block rounded-2xl border border-current/15 bg-current/5 px-5 py-4 text-center transition-colors hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onVisit?.(link)}
    >
      {content}
    </a>
  )
}
