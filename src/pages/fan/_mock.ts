// eslint-disable-next-line import/no-extraneous-dependencies
import type { Request, Response } from 'express';
import type { InnovateManageListItem } from './data.d';

const types = [
  '城轨',
  '机车',
  '磁浮',
];
const obj = [
  '制动',
  '电气',
  '车体',
];
const parts = [
  '研发',
  '生产',
  '销售',
];

const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];

function manageList(count: number): InnovateManageListItem[] {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: i,
      name: user[i % 10],
      type: types[i % 8],
      object: obj[i % 8],
      part: parts[i % 8],
      category: ['技术创新', '生成创新'][i % 8],
      procedure: ['解决问题', '发现问题'][i % 8],
      example: ['有', '无'][i % 8],
      time: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
      source: '--',
    });
  }

  return list;
}

function getManageList(req: Request, res: Response) {
  const params: any = req.query;

  const count = params.count * 1 || 20;

  const result = manageList(count);
  console.log('re[[[[[[[[[[[========', result);
  return res.json({
    data: {
      list: result,
    },
  });
}

export default {
  'GET  /api/manage_list': getManageList,
};
