import { useLinks } from "@/features/links/api/links.queries"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"

export function DashboardPage() {
  const { data: links, isPending, isError } = useLinks()
  useDocumentTitle("Dashboard | Link in Bio")

  if (isPending) {
    return <></>
  }

  if (isError || !links) {
    return <p role="alert">No se pudieron cargar las estadísticas.</p>
  }

  const totalClicks = links.reduce((total, link) => total + link.clickCount, 0)
  const activeLinks = links.filter((link) => link.isActive).length
  const sortedLinks = [...links].sort((a, b) => b.clickCount - a.clickCount)
  const maxClicks = sortedLinks[0]?.clickCount ?? 0
  const topLink = maxClicks > 0 ? sortedLinks[0] : undefined
  const topLinks = sortedLinks.slice(0, 3)
  const formatNumber = (value: number) => value.toLocaleString("es-AR")

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-20 pb-24">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Acá vas a encontrar las estadísticas de tu cuenta y tus links.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
          <h2 className="text-sm font-medium text-muted-foreground">Total de clicks</h2>
          <p className="mt-4 text-3xl font-semibold tabular-nums">{formatNumber(totalClicks)}</p>
          <p className="mt-2 text-sm text-muted-foreground">En todos tus links</p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
          <h2 className="text-sm font-medium text-muted-foreground">Links activos / total</h2>
          <p className="mt-4 text-3xl font-semibold tabular-nums">
            {formatNumber(activeLinks)}
            <span className="text-xl font-normal text-muted-foreground"> / {formatNumber(links.length)}</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Links visibles en tu perfil</p>
        </article>

        <article className="min-w-0 rounded-2xl border border-border bg-card p-6 text-card-foreground">
          <h2 className="text-sm font-medium text-muted-foreground">Link más clickeado</h2>
          {topLink ? (
            <>
              <a
                href={topLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block truncate text-xl font-semibold underline-offset-4 hover:underline"
                title={topLink.title || topLink.url}
              >
                {topLink.title || topLink.url}
              </a>
              <p className="mt-2 text-sm text-muted-foreground">{formatNumber(topLink.clickCount)} clicks</p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Todavía no hay clicks registrados.</p>
          )}
        </article>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 text-card-foreground" aria-labelledby="top-links-title">
        <h2 id="top-links-title" className="text-lg font-semibold">Top 3 links</h2>
        {topLinks.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Todavía no hay clicks registrados.</p>
        ) : (
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {topLinks.map((link, index) => (
              <li key={link.id} className="flex min-w-0 items-center gap-3 rounded-xl bg-muted/50 p-4">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm font-medium underline-offset-4 hover:underline"
                    title={link.title || link.url}
                  >
                    {link.title || link.url}
                  </a>
                  <p className="mt-1 text-xs text-muted-foreground tabular-nums">{formatNumber(link.clickCount)} clicks</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 text-card-foreground" aria-labelledby="link-clicks-title">
        <h2 id="link-clicks-title" className="text-lg font-semibold">Clicks por link</h2>
        <p className="mt-1 text-sm text-muted-foreground">Ordenados de mayor a menor. Las barras son relativas al link con más clicks.</p>

        {sortedLinks.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Todavía no agregaste ningún link.</p>
        ) : (
          <ul className="mt-6 space-y-5">
            {sortedLinks.map((link) => (
              <li key={link.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] sm:gap-6">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 rounded-sm underline-offset-4 hover:underline"
                  title={link.url}
                >
                  <span className="block truncate text-sm font-medium">{link.title || link.url}</span>
                  <span className="block truncate text-xs text-muted-foreground">{link.url}</span>
                </a>
                <div className="h-3 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${maxClicks > 0 ? (link.clickCount / maxClicks) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-right text-sm font-semibold tabular-nums">
                  {formatNumber(link.clickCount)}<span className="sr-only"> clicks</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}
