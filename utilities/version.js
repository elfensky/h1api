import fs, { promises } from 'fs';
import path from 'path';

export async function getAppVersionAsync() {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = await promises.readFile(packageJsonPath, 'utf-8');
    const { version } = JSON.parse(packageJson);
    // log.info('APP - app version is ' + chalk.yellow(version));
    return version;
}

export function getAppVersionSync() {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf-8');
    const { version } = JSON.parse(packageJson);
    // log.info('APP - app version is ' + chalk.yellow(version));
    return version;
}
