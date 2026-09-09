import { useParams } from 'react-router-dom'
import { useRegisterClick } from '@/features/links/api/links.queries'
import { PublicLinkList } from '@/features/links/components/PublicLinkList'
import { usePublicProfile } from '../api/profile.queries'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const themeClasses = {
  LIGHT: 'bg-slate-50 text-slate-900',
  DARK: 'bg-zinc-950 text-zinc-100',
  MIDNIGHT: 'bg-slate-950 text-slate-100',
  GRADIENT: 'bg-linear-to-br from-indigo-950 via-purple-950 to-slate-950 text-white',
}

export function PublicProfilePage() {
  const { username = '' } = useParams<{ username: string }>()
  const { data: profile, isLoading, isError } = usePublicProfile(username)
  const { mutate: registerClick } = useRegisterClick()

  useDocumentTitle(profile ? `${profile.displayName ?? profile.username} | Link in Bio` : 'Link in Bio')

  if (isLoading) {
    return (
      <div role="status" className="flex flex-1 justify-center px-6 py-24">
        <span className="sr-only">Cargando perfil público...</span>
        <span
          aria-hidden="true"
          className="mt-8 size-5 animate-spin rounded-full border-2 border-foreground/10 border-t-foreground/30 motion-reduce:animate-none"
        />
      </div>
    )
  }

  if (isError || !profile) {

    return <p>No se pudo cargar el perfil público.</p>
  }

  return (
    <section className={`flex-1 px-6 py-20 sm:py-24 ${themeClasses[profile.theme] ?? themeClasses.LIGHT}`}>
      <div
        data-public-profile-content
        className={`mx-auto w-full max-w-md rounded-3xl border px-5 py-8 shadow-lg shadow-black/5 backdrop-blur-md sm:px-8 ${
          profile.theme === 'LIGHT'
            ? 'border-slate-200/60 bg-white/50'
            : 'border-white/15 bg-white/5'
        }`}
      >
        <header className="mb-8 text-center">
          <Avatar className="mx-auto mb-6 size-42">
            <AvatarImage src={profile.avatarUrl ?? undefined} alt={profile.displayName || profile.username} />
            <AvatarFallback>
              {(profile.displayName || profile.username)
                .split(' ')
                .map((word) => word[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <h1 className="wrap-anywhere text-3xl font-bold tracking-tight sm:text-4xl">
            {profile.displayName || profile.username}
          </h1>
          <p className="mt-2 wrap-anywhere text-sm opacity-60">@{profile.username}</p>
          {profile.bio && (
            <p className="mt-5 whitespace-pre-line wrap-anywhere text-base leading-relaxed opacity-80">
              {profile.bio}
            </p>
          )}
        </header>

        <PublicLinkList links={profile.links} onVisit={(link) => registerClick(link.id)} />
      </div>
    </section>
  )
}

export default PublicProfilePage
