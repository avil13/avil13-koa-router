import Koa from 'koa';
import { makeRouter } from '@avil13/koa-router';
import { join } from 'path';

const PORT = 3000;

const app = new Koa();

const configFile = join(__dirname, 'router-config.yaml');

app.use(makeRouter(configFile));

app.listen(PORT);

console.log(`http://localhost:${PORT}/`);
