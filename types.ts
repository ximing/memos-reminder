// 定义基本的资源类型接口
interface Resource {
  name: string;
  uid: string;
  createTime: string;
  filename: string;
  content: string;
  externalLink: string;
  type: string;
  size: number;
  memo: string;
}

// 定义节点类型接口
interface Node {
  type: string;
  paragraphNode?: ParagraphNode;
  lineBreakNode?: {};
  // 根据实际需要，可以添加其他节点类型定义
}

// 定义段落节点接口
interface ParagraphNode {
  children: TextNode[];
}

// 定义文本节点接口
interface TextNode {
  type: "TEXT";
  content: string;
}

// 定义备忘录类型接口
export interface Memo {
  name: string;
  uid: string;
  rowStatus: "ACTIVE" | "INACTIVE";
  creator: string;
  createTime: string;
  updateTime: string;
  displayTime: string;
  content: string;
  nodes: Node[];
  visibility: "PRIVATE" | "PUBLIC";
  tags: string[];
  pinned: boolean;
  resources: any[]; // 需要根据实际资源类型定义
  relations: any[]; // 需要根据实际关系类型定义
  reactions: any[]; // 需要根据实际反应类型定义
  property: any; // 需要根据实际属性类型定义
}

export interface MemosResponse {
  memos: Memo[];
  nextPageToken?: string;
}
