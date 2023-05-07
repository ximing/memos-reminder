export interface Resource {
  id: number;
  creatorId: number;
  createdTs: number;
  updatedTs: number;
  filename: string;
  internalPath: string;
  externalLink: string;
  type: string;
  size: number;
  publicId: string;
  linkedMemoAmount: number;
}

export interface Memo {
  id: number;
  rowStatus: string;
  creatorId: number;
  createdTs: number;
  updatedTs: number;
  content: string;
  visibility: string;
  pinned: boolean;
  creatorName: string;
  resourceList: Resource[];
}
