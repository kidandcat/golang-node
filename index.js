const { exec } = require("child_process");
const fs = require("fs");

deleteFolderRecursive(`${__dirname}/.go.home`);
deleteFolderRecursive(`${__dirname}/.go.sources`);
deleteFolderRecursive(`${__dirname}/.go.compiled`);

module.exports = async (text, ...vars) => {
  const cl = new GoClass();
  await cl.init(text, vars);
  return {
    run: async () => {
      return await cl.runBinary();
    }
  };
};

class GoClass {
  async init(aCode, vars) {
    if (!fs.existsSync(`${__dirname}/.go.home`)) {
      fs.mkdirSync(`${__dirname}/.go.home`);
    }
    const name = this.genRandomName();
    const code = this.injectVariables(aCode, vars);
    await this.getImports(code);
    this.Path = await this.saveCode(name, code);
  }

  genRandomName() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    // Seven is the number of Luck
    for (let i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  injectVariables(code, vars) {
    if (vars.length > 0) {
      code = code.map(c => (c += `${vars[code.indexOf(c)] || ""}`));
      return code.join("");
    }
    return code.join("");
  }

  async saveCode(name, code) {
    await this.writeToFile(`${__dirname}/.go.sources/${name}.go`, code);
    await this.compileFile(`${__dirname}/.go.sources/${name}.go`);
    return `${__dirname}/.go.compiled/${name}`;
  }

  async writeToFile(path, text) {
    if (!fs.existsSync(`${__dirname}/.go.sources`)) {
      fs.mkdirSync(`${__dirname}/.go.sources`);
    }
    if (!fs.existsSync(`${__dirname}/.go.compiled`)) {
      fs.mkdirSync(`${__dirname}/.go.compiled`);
    }
    return new Promise((ac, re) => {
      fs.writeFile(path, text, err => {
        if (err) re(err);
        ac();
      });
    });
  }

  async compileFile(path) {
    switch (process.platform) {
      case "win32":
        await this.executeCmd(
          this.getWindowsCompiler(
            `build -o ${__dirname}\\.go.compiled\\${path
              .split("/")
              .pop()
              .split(".")
              .shift()}.exe ${path.split("/").join("\\")}`
          ),
          this.getWindowsEnvironment()
        );
        break;
      case "linux":
        await this.executeCmd(
          this.getLinuxCompiler(
            `build -o ${__dirname}/.go.compiled/${path
              .split("/")
              .pop()
              .split(".")
              .shift()} ${path}`
          ),
          this.getLinuxEnvironment()
        );
        break;
      case "darwin":
        await this.executeCmd(
          this.getDarwinCompiler(
            `build -o ${__dirname}/.go.compiled/${path
              .split("/")
              .pop()
              .split(".")
              .shift()} ${path}`
          ),
          this.getDarwinEnvironment()
        );
        break;
    }
  }

  async getImports(code) {
    const aCode = code.split("\n");
    let insideImport = false;
    const imports = [];
    aCode.forEach(line => {
      if (line.indexOf("import") != -1) {
        if (line.indexOf('"') != -1) {
          const splited = line.split('"');
          imports.push(splited[1]);
        } else if (line.indexOf("(") != -1) {
          insideImport = true;
        }
      } else if (insideImport && line.indexOf(")") != -1) {
        insideImport = false;
      } else if (insideImport) {
        imports.push(line.split('"')[1]);
      }
    });
    for (let pkg in imports) {
      switch (process.platform) {
        case "win32":
          await this.executeCmd(
            this.getWindowsCompiler(`get ${imports[pkg]}`),
            this.getWindowsEnvironment()
          );
          break;
        case "linux":
          await this.executeCmd(
            this.getLinuxCompiler(`get ${imports[pkg]}`),
            this.getLinuxEnvironment()
          );
          break;
        case "darwin":
          await this.executeCmd(
            this.getDarwinCompiler(`get ${imports[pkg]}`),
            this.getDarwinEnvironment()
          );
          break;
      }
    }
  }

  async runBinary() {
    switch (process.platform) {
      case "win32":
        let win32 = await this.executeCmd(
          `${this.Path.split("/").join("\\")}.exe`,
          this.getWindowsEnvironment()
        );
        return win32.trim();
        break;
      case "linux":
        let linux = await this.executeCmd(
          `${this.Path}`,
          this.getLinuxEnvironment()
        );
        return linux.trim();
      case "darwin":
        let darwin = await this.executeCmd(
          `${this.Path}`,
          this.getDarwinEnvironment()
        );
        return darwin.trim();
      default:
        throw new Error("Platform not supported");
    }
  }

  getDarwinCompiler(command) {
    return `${__dirname}/compilers/darwin_${this.getArch()}/bin/go ${command}`;
  }
  getLinuxCompiler(command) {
    return `${__dirname}/compilers/linux_${this.getArch()}/bin/go ${command}`;
  }
  getWindowsCompiler(command) {
    return `${__dirname}\\compilers\\windows_${this.getArch()}\\bin\\go.exe ${command}`;
  }

  getWindowsEnvironment() {
    return {
      GOPATH: `${__dirname}\\.go.home`,
      GOROOT: `${__dirname}\\compilers\\windows_${this.getArch()}`
    };
  }

  getLinuxEnvironment() {
    return {
      GOPATH: `${__dirname}/.go.home`,
      GOROOT: `${__dirname}/compilers/linux_${this.getArch()}`
    };
  }

  getDarwinEnvironment() {
    return {
      GOPATH: `${__dirname}/.go.home`,
      GOROOT: `${__dirname}/compilers/darwin_${this.getArch()}`
    };
  }

  getArch() {
    return process.arch == "x64" ? "64" : "32";
  }

  async executeCmd(cmd, env) {
    return new Promise((ac, re) => {
      exec(
        cmd,
        {
          env: {
            ...process.env,
            ...env
          }
        },
        (err, stdout, stderr) => {
          if (err) re(err);
          ac(stdout);
          if (stderr) re(stderr);
        }
      );
    });
  }
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
