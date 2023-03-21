#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import ora from 'ora';
var spinner = ora({
    spinner: 'dots',
    text: "Loading",

});
inquirer
    .prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'What Is The name Of Project That You Would Like',

        },

        {
            type: 'list',
            name: 'designLibrary',
            message: 'Which Design Library Would You Like To Use ? ',
            choices: ['TailwindCss', 'bootstrap']

        }
    ],).then((userAnswer) => {

        spinner.start()
        try {
            execSync('ng version')
        } catch (error) {

            execSync('npm install -g @angular/cli');

        }

        // Create new Angular project
        execSync(`ng new ${userAnswer.projectName} --style=scss --routing`);
        if (userAnswer.designLibrary === 'TailwindCss') {
            execSync('npm install -D tailwindcss postcss autoprefixer');
            execSync('npx tailwindcss init');
            const stylesFilePath = path.join(process.cwd(), `${userAnswer.projectName}`, 'src', 'styles.scss');
            fs.appendFileSync(stylesFilePath, "@import 'tailwindcss/base';\n@import 'tailwindcss/components';\n@import 'tailwindcss/utilities';\n");
            const configFilePath = path.join(process.cwd(), `${userAnswer.projectName}`, 'tailwind.config.js');
            const config = "module.exports = {\n  content: [\n    './src/**/*.{html,ts}',\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};\n";
            fs.writeFileSync(configFilePath, config);
            // Stop the spinner after installing TailwindCss
            console.log('TailwindCss has been installed successfully');
            spinner.stop();

        } else if (userAnswer.designLibrary === 'bootstrap') {
            try {
                spinner.text = 'Installing Angular bootstrap...';
                execSync(`cd ${userAnswer.projectName} && ng add @ng-bootstrap/ng-bootstrap --skip-confirmation`);
                spinner.succeed('Bootstrap has been installed successfully.');
                console.log('Angular Bootstrap has been installed successfully');
            } catch (error) {
                console.error('Failed to install Angular Bootstrap:', error);
            }
        }
    }).catch((err) => {
        console.log(err);
    });