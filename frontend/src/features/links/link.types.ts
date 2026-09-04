export type Platform = {
  id: string;
  name: string;
  slug: string;
};

export type Link = {
  id: string;
  title: string;
  url: string;
  position: number;
  isActive: boolean;
  clickCount: number;
  platform: Platform | null;
};

export type UpdateLinkInput = {
  title: string;
  url: string;
  platformId?: string;
  isActive: boolean;
};

export type CreateLinkInput = {
  title?: string;
  url: string;
  platformId?: string;
  position?: number;
};
