import { Category, SourceType, Status } from "@prisma/client";

export type { Category, SourceType, Status };

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  url: string;
  description: string | null;
  category: Category;
  tags: string[];
  iconUrl: string | null;
  voteCount: number;
  status: Status;
  config?: unknown;
  submitter: {
    name: string | null;
  };
}

export interface Contributor {
  id: string;
  name: string | null;
  image: string | null;
}

export interface CommunityStats {
  totalUsers: number;
  approvedSources: number;
  githubStars: number | null;
}

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  isAdmin: boolean;
  createdAt: string;
  sourceCount: number;
  approvedSourceCount: number;
  voteCount: number;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  name_zh: string;
  description: string;
  description_zh: string;
  keywords: string[];
}

export interface SourceFormData {
  name: string;
  url: string;
  description: string;
  type: SourceType;
  category: Category;
  tags: string[];
  iconUrl: string;
}
