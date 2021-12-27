const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

class Alias {
  constructor() {
    this.aliasParams = [
      { label: "application", alias: "src/application" },
      { label: "assets", alias: "src/assets" },
      { label: "domain", alias: "src/domain" },
      { label: "factory", alias: "src/factory" },
      { label: "lib", alias: "src/lib" },
      { label: "middleware", alias: "src/middleware" },
      { label: "modules", alias: "src/modules" },
      { label: "repository", alias: "src/repository" },
      { label: "route", alias: "src/route" }
    ];
  }

  toTsconfigJson() {
    const paths = {};
    for (const aliasParam of this.aliasParams) {
      const alias = `${aliasParam.alias}/*`;
      paths[`~${aliasParam.label}/*`] = [alias];
    }

    return {
      compilerOptions: {
        paths: paths
      }
    };
  }

  toWebpack() {
    const paths = {};
    for (const aliasParam of this.aliasParams) {
      const alias = path.resolve(__dirname, `../${aliasParam.alias}`);
      paths[`~${aliasParam.label}`] = alias;
    }
    return paths;
  }

  toJest() {
    const paths = {};
    for (const aliasParam of this.aliasParams) {
      const alias = `<rootDir>/${aliasParam.alias}/$1`;
      paths[`^~${aliasParam.label}(.*)$`] = alias;
    }
    return paths;
  }

  updateTsconfigAliasJson(pathname = "./config/tsconfig.alias.json") {
    const json = this.toTsconfigJson();
    fs.writeFile(pathname, JSON.stringify(json), error => {
      if (!error) {
        console.log(
          chalk.blueBright("> Success : update 'tsconfig.alias.json'")
        );
      } else {
        console.log(chalk.redBright("> Failed : update 'tsconfig.alias.json'"));
        console.log(error);
      }
    });
  }
}

const alias = new Alias();
alias.updateTsconfigAliasJson();

exports.alias = alias;
