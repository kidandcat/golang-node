# golang-node
Execute Go code from NodeJS

Golang code compiles so fast, but may be not worth if the Go program task is not too intensive for NodeJS. In the other case, if you need to make a high intensive task, you may want to do it in Go. For example, this package has been used for 

## Requirements

* Go command line accesible by NodeJS
* Go version > 1.9.0
* NodeJS > 8.5.0

## Features

* Automatically "go get" all imported packages

## Example

Compile program:
```javascript
const name = "World";
const code = await Go`
package main
      
import "fmt"
      
func main(){
    fmt.Println("Hello ${name} from Golang!!")
}
`;
```
then execute it and get the result:
```javascript
const res = await code.run();
console.log(res);
// ""Hello World from Golang!!"
```
