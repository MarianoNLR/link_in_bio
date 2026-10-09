import { useProfile } from "../api/profile.queries";
import { ProfileForm } from "../components/ProfileForm";
import { useUpdateProfile } from "../api/profile.queries";
import { toast } from "sonner";
import { LinkList } from "@/features/links/components/LinkList";
import { AvatarUploader } from "../components/AvatarUploader";
import { ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePage() {
  const { data: profile, isPending, isError } = useProfile();
  const updateProfile = useUpdateProfile();

  useDocumentTitle("Administrar perfil | Link in Bio");

  if (isPending) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !profile) {
    return <p>No se pudo cargar el perfil.</p>;
  }

  return (
    <div className="flex w-full flex-1">
      <div className="mx-auto w-full max-w-2xl border-x border-border/70 px-6 pt-20 pb-20 shadow-[inset_8px_0_12px_-12px_rgb(0_0_0/0.2),inset_-8px_0_12px_-12px_rgb(0_0_0/0.2)]">
        <div className="mb-6 flex flex-col items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Administrar perfil
          </h1>
          <a
            href={`/${encodeURIComponent(profile.username)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            Ver perfil público
            <ExternalLink aria-hidden="true" />
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>
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

function ProfilePageSkeleton() {
  return <div className="flex w-full flex-1" role="status" aria-busy="true"><span className="sr-only">Cargando perfil...</span><div className="mx-auto w-full max-w-2xl space-y-10 border-x border-border/70 px-6 pt-20 pb-20"><div className="flex flex-col items-center gap-3"><Skeleton className="h-8 w-52" /><Skeleton className="h-9 w-40" /></div><section className="flex flex-col items-center gap-5 p-6"><Skeleton className="size-28 rounded-full" /><Skeleton className="h-9 w-36" /></section><section className="space-y-5 rounded-3xl border-2 border-border/70 p-6"><ProfileFormSkeleton /></section><section className="space-y-3 rounded-3xl border-2 border-border/70 p-6"><LinkListSkeleton /><Skeleton className="mx-auto mt-5 size-11 rounded-full" /></section></div></div>;
}
function ProfileFormSkeleton() {
  return <>{["username", "display-name", "bio", "theme"].map((field, index) => <div key={field} className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className={index === 2 ? "h-24 w-full" : "h-9 w-full"} /></div>)}<Skeleton className="h-9 w-full" /></>;
}
function LinkListSkeleton() {
  return <div className="space-y-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="flex items-center gap-4 rounded-xl border bg-card p-4"><Skeleton className="size-5" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/5" /><Skeleton className="h-3 w-3/5" /></div><Skeleton className="h-8 w-16" /></div>)}</div>;
}
