export interface Source {
  id: string;
  name: string;
  type: string;
  url: string;
  description: string | null;
  category: string;
  tags: string[];
  iconUrl: string | null;
  voteCount: number;
  submitter: {
    name: string | null;
  };
}

export interface Contributor {
  id: string;
  name: string | null;
  image: string | null;
}
