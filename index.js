const { exec } = require("child_process");
const fs = require("fs");

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
    const name = this.genRandomName();
    const code = this.injectVariables(aCode, vars);
    this.Path = await this.saveCode(name, code);
  }

  genRandomName() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  injectVariables(code, vars) {
    if (vars.length > 0) {
      code = code.map(c => (c += `${vars[code.indexOf(c)] || ""}`));
      return code.join("");
    }
    return code;
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
          `go build -o ${__dirname}/.go.compiled/${path
            .split("/")
            .pop()
            .split(".")
            .shift()}.exe ${path}`
        );
        break;
      case "linux":
        await this.executeCmd(
          `go build -o ${__dirname}/.go.compiled/${path
            .split("/")
            .pop()
            .split(".")
            .shift()} ${path}`
        );
        break;
    }
  }

  async runBinary() {
    switch (process.platform) {
      case "win32":
        let win32 = await this.executeCmd(`${this.Path}.exe`);
        return win32.trim();
        break;
      case "linux":
        let linux = await this.executeCmd(`${this.Path}`);
        return linux.trim();
        break;
      default:
        throw new Error("Platform not supported");
    }
  }

  async executeCmd(cmd) {
    return new Promise((ac, re) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) re(err);
        ac(stdout);
        if (stderr) re(stderr);
      });
    });
  }
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
