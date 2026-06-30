#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { input, confirm } from "@inquirer/prompts";

const program = new Command();

program
  .name("create-neutralinojs-vite-app")
  .description(
    "Create a Neutralinojs + Vite app with React, pre-configured and ready to run."
  )
  .version("2.1.2")
  .argument("[project-name]", "Name of the project to create")
  .option("-t, --template <name>", "Template to use (react-js, react-ts)")
  .option("-f, --force", "Overwrite target directory if it exists")
  .option("-y, --yes", "Skip prompts and use defaults (React-TS, overwrite)")
  .action(async (projectNameArg: string | undefined, options) => {
    console.log();
    console.log(
      chalk.bold.cyan("  create-neutralinojs-vite-app") +
        chalk.gray(" — Neutralinojs + Vite scaffolding tool")
    );
    console.log();

    // Step 1: Get project name
    let projectName: string = projectNameArg || "";

    if (!projectName) {
      if (options.yes) {
        projectName = "my-neu-app";
      } else {
        projectName = await input({
          message: "Project name:",
          default: "my-neu-app",
          validate: (value: string) => {
            if (!value.trim()) return "Project name cannot be empty.";
            if (!/^[a-z0-9-_]+$/i.test(value))
              return "Project name can only contain letters, numbers, hyphens, and underscores.";
            return true;
          },
        });
      }
    }

    // Step 2: Template / TypeScript prompt
    let template: string = options.template || "";

    if (!template) {
      if (options.yes) {
        template = "react-ts";
      } else {
        const useTypeScript = await confirm({
          message: "Use TypeScript?",
          default: true,
        });
        template = useTypeScript ? "react-ts" : "react-js";
      }
    } else if (template !== "react-js" && template !== "react-ts") {
      console.log(chalk.red(`\n  Invalid template "${template}". Valid options are: react-js, react-ts.`));
      process.exit(1);
    }

    const targetDir: string = path.resolve(process.cwd(), projectName);

    // Step 3: Check if directory already exists
    if (fs.existsSync(targetDir)) {
      if (options.force || options.yes) {
        await fs.remove(targetDir);
      } else {
        const overwrite = await confirm({
          message: `Directory "${projectName}" already exists. Overwrite?`,
          default: false,
        });

        if (!overwrite) {
          console.log(chalk.yellow("\n  Aborted."));
          process.exit(0);
        }

        await fs.remove(targetDir);
      }
    }

    // Step 4: Scaffold
    const spinner = ora({
      text: chalk.gray("  Scaffolding project..."),
      spinner: "dots",
    }).start();

    try {
      const templateDir: string = path.resolve(
        __dirname,
        "../templates",
        template
      );

      if (!fs.existsSync(templateDir)) {
        spinner.fail(chalk.red(`Template "${template}" not found.`));
        process.exit(1);
      }

      await fs.copy(templateDir, targetDir, {
        filter: (src: string) => {
          const rel = path.relative(templateDir, src);
          return !rel.split(path.sep).includes("node_modules");
        },
      });

      // Inject project name into package.json
      const pkgPath: string = path.join(targetDir, "package.json");
      if (fs.existsSync(pkgPath)) {
        const pkg = await fs.readJson(pkgPath);
        pkg.name = projectName;
        await fs.writeJson(pkgPath, pkg, { spaces: 2 });
      }

      // Inject project name into neutralino.config.json
      const neuConfigPath: string = path.join(
        targetDir,
        "neutralino.config.json"
      );
      if (fs.existsSync(neuConfigPath)) {
        const neuConfig = await fs.readJson(neuConfigPath);
        const safeId: string = projectName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        neuConfig.applicationId = `js.neutralino.${safeId}`;
        neuConfig.cli.binaryName = projectName;
        await fs.writeJson(neuConfigPath, neuConfig, { spaces: 2 });
      }

      spinner.succeed(chalk.green("  Project scaffolded successfully!"));
    } catch (err) {
      spinner.fail(chalk.red("  Failed to scaffold project."));
      console.error(err);
      process.exit(1);
    }

    // Step 5: Print next steps
    console.log();
    console.log(
      chalk.bold("  Your Neutralinojs + Vite app is ready! Next steps:\n")
    );
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan("  npm install"));
    console.log(
      chalk.cyan("  npm run neu:update") +
        chalk.gray("  # downloads Neutralinojs binaries")
    );
    console.log(
      chalk.cyan("  npm run dev") +
        chalk.gray("       # starts Vite + Neutralinojs together")
    );
    console.log();
    console.log(chalk.gray("  Docs: https://neutralino.js.org/docs") + "\n");
  });

program.parse();
