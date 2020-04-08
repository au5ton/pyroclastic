#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import puppet from './puppet'
import { info, error, success } from './prettyPrint'
import { program, Command, Option } from 'commander'
import { Credentials } from './Credentials'

program
    .version(process.env.npm_package_version || "")
    .description(process.env.npm_package_description || "")
    .requiredOption('--cred <string>', 'Location of .env file with credentials', '.env')
    .option('--puppet <string>', 'Location of .json file with puppeteer.launch() configuration', 'config.json')
    .action(async (command: Command) => {
        const cred: unknown = dotenv.parse(
            fs.readFileSync(
                path.resolve(command.cred!)
            )
        )

        const config: unknown = program.puppet! === '' ? {} : JSON.parse(
            fs.readFileSync(
                path.resolve(command.puppet!)
            ).toString()
        )

        console.log(config)

        await puppet(cred as Credentials, config as any)
    })
    .parse(process.argv);

