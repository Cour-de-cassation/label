import { promises as fs } from 'fs';
import format from 'string-template';

export { bootstrap };

async function bootstrap(files: Array<{ template: string; target: string }>, env: { [key: string]: number | string }) {
  await Promise.all(files.map((file) => bootstrapFile(file, env)));
}

async function bootstrapFile(
  { template, target }: { template: string; target: string },
  env: { [key: string]: number | string },
) {
  const content = await fs.readFile(template, {
    encoding: 'utf8',
  });

  await fs.writeFile(target, format(content, env), {
    encoding: 'utf8',
  });
}
