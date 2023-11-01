export type Member = {
  avatar: string;
  name: string;
  id: string;
};

export interface Params {
  count: number;
}
export interface ListItemDataType {
  id: number,
  methodNumber,
  methodName: string,
  methodContent: string,
  innovativeProducts: string,
  innovativeObjects: string,
  innovativeChain: string,
  innovativeType: string,
  innovativeProgram: string,
  applicationCase: string,
  createTime: number,
  patentsNo: string,
  icon: string,
  demand: string,
  processDesc: string,
  zjUse: string,
  methodType: string,
  likeStatus: string,
  likeCount: string,
  storeStatus: string,
  storeCount: string,
  methodCategory: string,
  commentCount: number,
  showComment: boolean,
}

export interface KnowledgeItemDataType {
  author: string,
  category: string,
  content: string,
  abstracts: string,
  createDate: string,
  department: string,
  id: number,
  keyWords: string,
  keys: string[],
  knowledgeLevel: string,
  knowledgeName: string,
  knowledgeNumber: string,
  knowledgeType: string,
  library: string,
  processType: string,
  productType: string,
  score: string,
  secret: string,
  stage: string,
  submissionTime: string,
  submitter: string,
  validTime: string,
  versionInfo: string,
  icon: string,
}
