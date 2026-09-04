import { useProfile } from '../api/profile.queries'
import { ProfileForm } from '../components/ProfileForm'
import { useUpdateProfile } from '../api/profile.queries'
import { toast } from 'sonner'
import { useLinks } from '@/features/links/api/links.queries'
import { LinkList } from '@/features/links/components/LinkList'

export function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile()
  const updateProfile = useUpdateProfile()
  const { data: links = [], isLoading: isLinksLoading } = useLinks()

  if (isLoading) {
    return <p>Cargando...</p>
  }

  if (isError || !profile) {
    return <p>No se pudo cargar el perfil.</p>
  }

  return (
    <section className="w-full">
      <div className="mx-auto min-h-svh w-full max-w-2xl border-x border-border/70 px-6 py-8 shadow-[inset_8px_0_12px_-12px_rgb(0_0_0/0.2),inset_-8px_0_12px_-12px_rgb(0_0_0/0.2)]">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          Administrar perfil
        </h1>
        <ProfileForm
          initialValues={profile}
          isPending={updateProfile.isPending}
          onSubmit={(values) => {
            updateProfile.mutate(values, {
              onSuccess: () => {
                toast.success('Perfil actualizado con éxito.')
              },
              onError: () => {
                toast.error(
                  'No se pudo actualizar el perfil. Inténtalo de nuevo.',
                )
              },
            })
          }}
        />
        <div className="mt-10">
          {isLinksLoading ? (
            <p>Cargando links...</p>
          ) : (
            <LinkList links={links} />
          )}
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
