import { RouteController } from '../types';
import path from 'path';
import fs from 'fs';

export const staticFilesController: RouteController = async (ctx) => {
  if (!ctx.route.staticFile) {
    return;
  }

  // TODO: добавить возможность скачивать файлы
  // ctx.set('content-disposition', contentDisposition(fileName))

  const filePath = await getFilePath(ctx.route.staticFile);

  if (filePath) {
    ctx.type = path.extname(filePath);
    ctx.body = fs.createReadStream(filePath);
  }
};

async function getFilePath(filePath: string): Promise<string | null> {
  let isFile = await checkIsFile(filePath);
  if (isFile) {
    return filePath;
  }
  const indexFilePath = `${filePath}/index.html`.replace(/\/+/g, '/');

  isFile = await checkIsFile(indexFilePath);
  if (isFile) {
    return indexFilePath;
  }
  return null;
}

function checkIsFile(file: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stat) => {
      if (err) {
        reject(err);
      } else {
        resolve(stat.isFile());
      }
    });
  });
}
