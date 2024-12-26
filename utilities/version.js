export default async function getAppVersion() {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = await promises.readFile(packageJsonPath, 'utf-8');
    const { version } = JSON.parse(packageJson);
    log.info('APP - app version is ' + chalk.yellow(version));
    return version;
}
