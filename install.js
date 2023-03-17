const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

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
            choices: ['TailwindCss', 'Material Design bootstrap']

        }
    ],).then((userAnswer) => {
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
        } else {
            try {
                execSync('ng add @ng-bootstrap/ng-bootstrap --force');
                console.log('Bootstrap has been installed successfully');

            } catch (error) {
                console.error('Failed to install Angular Material:', error);
            }
        }
    }).catch((err) => {
        console.log(err);
    });