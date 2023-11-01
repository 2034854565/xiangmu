export interface KnowledgeStandingBookItem {
  id: number,
  knowledgeNumber: string,
  knowledgeName: string,
  knowledgeLevel: string,
  fileId: number,
}

export interface TreeDataItem {
  id: number,
  name: string,
  parentId: number,
  level: number,
  children: TreeDataItem[],
}
