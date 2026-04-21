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

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
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
