import fs, { promises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import prisma from '../prisma/prisma.js';
import { getLogger } from '../utilities/loggers.js';
import chalk from 'chalk';

const log = getLogger();
const execAsync = promisify(exec);

export default async function configureDB() {
    const provider = getPrismaProvider();

    if (provider === 'sqlite') {
        log.info('DATABASE - using ' + chalk.yellow('sqlite') + ' provider.');

        const currentMode = await prisma.$queryRaw`PRAGMA journal_mode;`;

        // If the current mode is not WAL, set it to WAL
        if (currentMode[0].journal_mode !== 'wal') {
            log.info(
                'DATABASE - journal mode is set to ' + chalk.yellow(currentMode)
            );
            log.info('DATABASE - setting journal mode to WAL...');
            const result = await prisma.$queryRaw`PRAGMA journal_mode = WAL;`;
            log.info(
                'DATABASE - successfully set journal mode to ' +
                    chalk.yellow(currentMode)
            );
        } else {
            log.info('DATABASE - journal mode is already set to WAL');
        }

        // migrate the database if needed
        await runMigrations();
        log.info('DATABASE - completed configuration.');
        return true;
    }

    if (provider === 'mysql') {
        log.info(
            'DATABASE' +
                chalk.white(' - using ') +
                chalk.yellow('mysql') +
                chalk.white(' provider')
        );

        // migrate the database if needed
        await runMigrations();
        log.info('DATABASE' + chalk.white(' - completed configuration'));
        return true;
    }

    log.error('DATABASE - unknown database provider:', chalk.yellow(provider));
    throw new Error('DATABASE - unknown database provider:', provider);
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
    const start = performance.now();
    log.info('DATABASE' + chalk.white(' - starting migrations...'));
    try {
        const { stdout, stderr } = await execAsync(`npx prisma migrate deploy`);
        if (stderr) {
            throw new Error(stderr);
        }

        const cleanedStdout = stdout.replace(/(\r?\n){3,}/g, '\n');
        log.info('\n' + cleanedStdout);
        log.info(
            'DATABASE' +
                chalk.white(' - finished migrations in ') +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );
    } catch (error) {
        log.error('DATABASE - failed migrations \n' + error);
        throw error;
    }
}
