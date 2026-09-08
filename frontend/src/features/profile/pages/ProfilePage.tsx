import { useProfile } from "../api/profile.queries";
import { ProfileForm } from "../components/ProfileForm";
import { useUpdateProfile } from "../api/profile.queries";
import { toast } from "sonner";
import { LinkList } from "@/features/links/components/LinkList";
import { AvatarUploader } from "../components/AvatarUploader";

export function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();
  const updateProfile = useUpdateProfile();

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (isError || !profile) {
    return <p>No se pudo cargar el perfil.</p>;
  }

  return (
    <div className="flex w-full flex-1">
      <div className="mx-auto w-full max-w-2xl border-x border-border/70 px-6 pt-8 pb-20 shadow-[inset_8px_0_12px_-12px_rgb(0_0_0/0.2),inset_-8px_0_12px_-12px_rgb(0_0_0/0.2)]">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-center">
          Administrar perfil
        </h1>
        <section className="mb-10 flex flex-col items-center gap-5 p-6">
          <AvatarUploader
            avatarUrl={profile.avatarUrl}
            displayName={profile.displayName}
          />
        </section>
        <section className="mb-10 flex flex-col gap-5 border-2 border-border/70 rounded-3xl p-6">
          <ProfileForm
            initialValues={profile}
            isPending={updateProfile.isPending}
            onSubmit={(values) => {
              updateProfile.mutate(values, {
                onSuccess: () => {
                  toast.success("Perfil actualizado con éxito.");
                },
                onError: () => {
                  toast.error(
                    "No se pudo actualizar el perfil. Inténtalo de nuevo.",
                  );
                },
              });
            }}
          />
        </section>
        <section className="mb-10 flex flex-col gap-5 border-2 border-border/70 rounded-3xl p-6">
          <LinkList />
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
