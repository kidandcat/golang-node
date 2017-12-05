const Go = require("../index");
let code;

describe("Works", function() {
  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  it("It compiles with variables", async function() {
    const verb = "Hello";
    const name = "World";
    code = await Go`
package main

import (
  "fmt"
  "github.com/phayes/freeport"
)

func main(){
  getFreePort()
  fmt.Println("${verb} ${name} from Golang!!")
  fmt.Println("    Testing another line")
}

func getFreePort(){
  _, err := freeport.GetFreePort()
  if err != nil {
    fmt.Println(err)
  }
}
`;
    expect(code).not.toBeUndefined();
    expect(code.run).not.toBeUndefined();
  });

  it("It executes", async function() {
    const res = await code.run();
    expect(res).toEqual(`Hello World from Golang!!
    Testing another line`);
  });
});
