export interface ExampleListItem {
  id: number,
  name: string,
  type: string,
  object: string,
  part: string,
  category: string,
  procedure: string,
  example: string,
  time: number,
  source: string,
}

export interface Params {
  count: number;
}

export interface ListItemDataType {
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
  showComment: boolean,
  likeStatus: string,
  likeCount: string,
  storeStatus: string,
  storeCount: string,
  commentCount: string,
}
