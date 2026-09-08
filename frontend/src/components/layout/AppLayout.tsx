import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LoaderCircle, LogIn, UserRound } from 'lucide-react'
import { useMe } from '@/features/auth/api/auth.queries'

export function AppLayout() {
  const { pathname } = useLocation()
  const showHeader = pathname.replace(/\/+$/, '') !== '/app/profile'
  const isPublicProfile = /^\/[^/]+\/?$/.test(pathname) && pathname !== '/app'
  const [hasContentBehindHeader, setHasContentBehindHeader] = useState(false)
  const showGlass = isPublicProfile && hasContentBehindHeader
  const { data: user, isLoading } = useMe()
  const accountLabel = user ? 'Ir al perfil' : 'Iniciar sesión'

  useEffect(() => {
    const updateHeader = () => {
      const content = document.querySelector('[data-public-profile-content]')
      setHasContentBehindHeader(
        isPublicProfile && !!content && content.getBoundingClientRect().top <= 56,
      )
    }

    const frame = requestAnimationFrame(updateHeader)
    window.addEventListener('scroll', updateHeader, { passive: true })
    window.addEventListener('resize', updateHeader)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateHeader)
      window.removeEventListener('resize', updateHeader)
    }
  }, [pathname, isPublicProfile])

  return (
    <div className="relative flex min-h-svh flex-col text-foreground">
      {showHeader && (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-x-0 top-0 z-40 h-14 border-b border-white/10 bg-white/5 shadow-sm shadow-black/5 backdrop-blur-md transition-opacity duration-3000 ease-in-out motion-reduce:transition-none ${showGlass ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {showHeader && <header className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-transparent text-white mix-blend-difference">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-end px-6">
          <nav aria-label="Cuenta" className="pointer-events-auto">
            {isLoading ? (
              <span role="status" className="flex size-10 items-center justify-center opacity-60">
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                <span className="sr-only">Cargando sesión...</span>
              </span>
            ) : (
              <Link
                to={user ? '/app/profile' : '/'}
                aria-label={accountLabel}
                title={accountLabel}
                className="flex size-10 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              >
                {user ? <UserRound className="size-6" aria-hidden="true" /> : <LogIn className="size-6" aria-hidden="true" />}
              </Link>
            )}
          </nav>
        </div>
      </header>}
      <main className="flex min-h-svh flex-1 flex-col [&>p]:px-6 [&>p]:py-20">
        <Outlet />
      </main>
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 bg-transparent px-6 py-4 text-center text-xs text-white mix-blend-difference">
        <span className="opacity-60">© {new Date().getFullYear()} Link in Bio</span>
      </footer>
    </div>
  )
}
