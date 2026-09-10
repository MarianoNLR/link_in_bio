import type { ProfileFormValues } from '../schemas/profile.schema'
import type { Profile } from '../api/profile.api'

export type ProfileFormProps = {
  initialValues: {
    username: string
    displayName: string
    bio?: string | null
    isPublic: boolean
    theme: Profile['theme']
  }
  onSubmit: (values: ProfileFormValues) => void
  isPending?: boolean
}
