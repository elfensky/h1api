import fs, { promises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import prisma from '../prisma/prisma.js';

const execAsync = promisify(exec);

export default async function configureDB() {
    const provider = getPrismaProvider();

    if (provider === 'sqlite') {
        console.log('db: using sqlite');
        const currentMode = await prisma.$queryRaw`PRAGMA journal_mode;`;
        console.log('db: Current journal mode:', currentMode);

        // If the current mode is not WAL, set it to WAL
        if (currentMode[0].journal_mode !== 'wal') {
            const result = await prisma.$queryRaw`PRAGMA journal_mode = WAL;`;
            console.log('db: Journal mode set to:', result);
        } else {
            console.log('db: Journal mode is already set to WAL.');
        }

        // migrate the database if needed
        await runMigrations();
        console.log('db: Database migrations completed successfully.');

        return true;
    }

    if (provider === 'mysql') {
        console.log('db: using mySQL');

        // migrate the database if needed
        await runMigrations();
        console.log('db: Database migrations completed successfully.');

        return true;
    }

    throw new Error('db: Unknown database provider:', provider);
}

function getPrismaProvider() {
    // Convert import.meta.url to a file path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Define the path to your schema.prisma file
    const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

    // Read the contents of the schema.prisma file
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

    // Use a regular expression to find the provider in the datasource block
    const providerMatch = schemaContent.match(/provider\s*=\s*"([^"]+)"/);

    if (providerMatch && providerMatch[1]) {
        return providerMatch[1];
    } else {
        throw new Error('Could not find the provider in schema.prisma');
    }
}

async function runMigrations() {
    console.log('db: starting database migrations...');
    const version = await getAppVersion();

    try {
        //`npx prisma migrate dev --name "app:${version}"`
        const { stdout, stderr } = await execAsync(`npx prisma migrate deploy`);
        if (stderr) {
            console.error(`Migration error: ${stderr}`);
            throw new Error(stderr);
        }
        console.log(`Migration output: ${stdout}`);
    } catch (error) {
        console.error('Failed to run migrations:', error);
        throw error;
    }
}

async function getAppVersion() {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = await promises.readFile(packageJsonPath, 'utf-8');
    const { version } = JSON.parse(packageJson);
    console.log(`App version: ${version}`);
    return version;
}
