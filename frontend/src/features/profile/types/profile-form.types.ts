import type { ProfileFormValues } from '../schemas/profile.schema'

export type ProfileFormProps = {
  initialValues: {
    username: string
    displayName: string
    bio?: string | null
    avatarUrl?: string | null
    isPublic: boolean
  }
  onSubmit: (values: ProfileFormValues) => void
  isPending?: boolean
}