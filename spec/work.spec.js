const Go = require("../index");
let code;

describe("Works", function() {
  it("It compiles with variables", async function() {
    const verb = "Hello";
    const name = "World";
    code = await Go`
package main

import "fmt"

func main(){
    fmt.Println("${verb} ${name} from Golang!!")
    fmt.Println("    Testing another line")
}`;
    expect(code).not.toBeUndefined();
    expect(code.run).not.toBeUndefined();
  });

  it("It executes", async function() {
    const res = await code.run();
    expect(res).toEqual(`Hello World from Golang!!
    Testing another line`);
  });
});
