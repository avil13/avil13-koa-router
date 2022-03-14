import { RouteController } from '../types';
import path from 'path';
import fs from 'fs';

export const staticFilesController: RouteController = async (ctx) => {
  if (!ctx.route.staticFile) {
    return;
  }

  // console.log('=>', JSON.stringify(ctx.route, null, 2));

  if (ctx.route.isDownload) {
    ctx.set('Content-Description', 'File Transfer');
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.set(
      'Content-Disposition',
      `attachment; filename="${path.basename(ctx.route.staticFile)}"`
    );
    ctx.set('Expires', '0');
    ctx.set('Cache-Control', 'must-revalidate');
    ctx.set('Pragma', 'public');
  }

  const file = await getFile(ctx.route.staticFile);

  if (file) {
    ctx.set('Content-Length', `${file.size}`);
    ctx.type = path.extname(file.filePath);
    ctx.body = fs.createReadStream(file.filePath);
  }
};

async function getFile(
  filePath: string
): Promise<{ filePath: string; size: number } | null> {
  const stat = await getStat(filePath);
  if (stat.isFile()) {
    return { filePath, size: stat.size };
  }

  if (stat.isDirectory()) {
    const indexFilePath = `${filePath}/index.html`.replace(/\/+/g, '/');
    const stat = await getStat(indexFilePath);

    if (stat.isFile()) {
      return { filePath: indexFilePath, size: stat.size };
    }
  }

  return null;
}

function getStat(file: string): Promise<fs.Stats> {
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
