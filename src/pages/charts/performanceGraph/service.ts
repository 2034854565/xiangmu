import { Request, Response } from 'express';
import { request } from 'umi';

export async function getMethodCategory() {
  return request('/imip/methods/category', {
    method: 'GET',
  });
}

  