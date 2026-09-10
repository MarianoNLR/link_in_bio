import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  profileSchema,
  type ProfileFormInput,
  type ProfileFormValues,
} from "@/features/profile/schemas/profile.schema"
import type { ProfileFormProps } from "@/features/profile/types/profile-form.types"

export function ProfileForm({
  initialValues,
  onSubmit,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialValues.username,
      displayName: initialValues.displayName,
      bio: initialValues.bio || "",
      isPublic: initialValues.isPublic,
      theme: initialValues.theme ?? "LIGHT",
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="profile-username">Nombre de usuario</Label>
        <Input
          id="profile-username"
          type="text"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          aria-describedby={
            errors.username ? "profile-username-error" : undefined
          }
          {...register("username")}
        />
        {errors.username && (
          <p id="profile-username-error" className="text-sm text-destructive">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-display-name">Nombre para mostrar</Label>
        <Input
          id="profile-display-name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.displayName)}
          aria-describedby={
            errors.displayName ? "profile-display-name-error" : undefined
          }
          {...register("displayName")}
        />
        {errors.displayName && (
          <p
            id="profile-display-name-error"
            className="text-sm text-destructive"
          >
            {errors.displayName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-bio">Biografía</Label>
        <textarea
          id="profile-bio"
          rows={4}
          aria-invalid={Boolean(errors.bio)}
          aria-describedby={errors.bio ? "profile-bio-error" : undefined}
          className="w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
          {...register("bio")}
        />
        {errors.bio && (
          <p id="profile-bio-error" className="text-sm text-destructive">
            {errors.bio.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-theme">Tema del perfil</Label>
        <select
          id="profile-theme"
          aria-invalid={Boolean(errors.theme)}
          aria-describedby={errors.theme ? "profile-theme-error" : undefined}
          className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
          {...register("theme")}
        >
          <option value="LIGHT">Claro</option>
          <option value="DARK">Oscuro</option>
          <option value="MIDNIGHT">Medianoche</option>
          <option value="GRADIENT">Degradado</option>
        </select>
        {errors.theme && (
          <p id="profile-theme-error" className="text-sm text-destructive">
            {errors.theme.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="profile-is-public"
          type="checkbox"
          className="size-4 cursor-pointer accent-primary"
          {...register("isPublic")}
        />
        <Label className="cursor-pointer" htmlFor="profile-is-public">
          Perfil público
        </Label>
      </div>

      <Button className="w-full cursor-pointer" type="submit">
        Guardar perfil
      </Button>
    </form>
  )
}
