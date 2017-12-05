const https = require("follow-redirects").https;
const fs = require("fs");
const targz = require("targz");
const extract = require("extract-zip");

switch (process.platform) {
  case "win32":
    deleteFolderRecursive(`${__dirname}\\compilers\\windows_64`);
    console.log("Downloading Windows x64 Go binaries");
    https.get(
      "https://redirector.gvt1.com/edgedl/go/go1.9.2.windows-amd64.zip",
      function(response) {
        response.on("end", () => {
          console.log("Finished downloading, now decompressing...");
          extract(
            `${__dirname}\\compilers\\windows_64.zip`,
            { dir: `${__dirname}\\compilers` },
            function(err) {
              if (err) console.log(err);
              console.log("Decompressed!");
              fs.rename(
                `${__dirname}\\compilers\\go`,
                `${__dirname}\\compilers\\windows_64`,
                function(err) {
                  if (err) throw err;
                }
              );
              fs.unlink(`${__dirname}\\compilers\\windows_64.zip`);
            }
          );
        });
        response.pipe(
          fs.createWriteStream(`${__dirname}\\compilers\\windows_64.zip`)
        );
      }
    );
    break;
  case "linux":
    deleteFolderRecursive(`${__dirname}/compilers/linux_64`);
    console.log("Downloading Linux x64 Go binaries");
    https.get(
      "https://redirector.gvt1.com/edgedl/go/go1.9.2.linux-amd64.tar.gz",
      function(response) {
        response.on("end", () => {
          console.log("Finished downloading, now decompressing...");
          targz.decompress(
            {
              src: `${__dirname}/compilers/linux_64.tar.gz`,
              dest: `${__dirname}/compilers/`
            },
            function(err) {
              fs.rename(
                `${__dirname}/compilers/go`,
                `${__dirname}/compilers/linux_64`,
                function(err) {
                  if (err) throw err;
                }
              );
              fs.unlink(`${__dirname}/compilers/linux_64.tar.gz`);
              if (err) {
                console.log(err);
              } else {
                console.log("Decompressed!");
              }
            }
          );
        });
        response.pipe(
          fs.createWriteStream(`${__dirname}/compilers/linux_64.tar.gz`)
        );
      }
    );
    break;
  default:
    console.log(process.platform);
    throw new Error("Platform not supported");
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
