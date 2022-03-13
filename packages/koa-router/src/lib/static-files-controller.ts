import { RouteController } from '../types';
import path from 'path';
import fs from 'fs';

export const staticFilesController: RouteController = async (ctx) => {
  const fPath = path.join(__dirname, ctx.path);
  const fStat = await stat(fPath);

  if (fStat.isFile()) {
    ctx.type = path.extname(fPath);
    ctx.body = fs.createReadStream(fPath);
  }
};


function stat(file: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stat) => {
      if (err) {
        reject(err);
      } else {
        resolve(stat);
      }
    });
  });
}
