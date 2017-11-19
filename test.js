//import Go from "./index";
const Go = require("./index");

async function test() {
  const goCode = await Go`
  package main
  
  import "fmt"

  func main(){
      fmt.Println("Hello World!!")
  }
  `;

  console.log(await goCode.run());
}

test();
setTimeout(() => {
  console.log("Waiter finished");
}, 20000);
