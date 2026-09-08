// src/features/platforms/lib/platform-icons.tsx

import type { IconType } from 'react-icons'

import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaReddit,
  FaSpotify,
  FaSteam,
  FaTwitch,
  FaYoutube,
} from 'react-icons/fa'

import {
  FaDiscord,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6'

import { SiKick } from 'react-icons/si'

import {
  Globe,
  Link as LinkIcon,
  Mail,
  type LucideIcon,
} from 'lucide-react'

type PlatformIcon = IconType | LucideIcon

const platformIcons: Record<string, PlatformIcon> = {
  github: FaGithub,
  instagram: FaInstagram,
  x: FaXTwitter,
  facebook: FaFacebook,
  tiktok: FaTiktok,
  twitch: FaTwitch,
  kick: SiKick,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  discord: FaDiscord,
  reddit: FaReddit,
  spotify: FaSpotify,
  steam: FaSteam,
  website: Globe,
  email: Mail,
}

export function getPlatformIcon(
  slug?: string | null,
): PlatformIcon {
  if (!slug) {
    return LinkIcon
  }

  return platformIcons[slug.toLowerCase()] ?? LinkIcon
}