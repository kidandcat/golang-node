# golang-node
Execute Go code from NodeJS

## Requirements

* Go command line accesible by NodeJS
* Go version > 1.9.0
* NodeJS > 8.5.0
* ```go get package``` all packages used

## Example

Compile program:
```
code = await Go`
package main
      
import "fmt"
      
func main(){
    fmt.Println("Hello World from Golang!!")
    fmt.Println("    Testing another line")
}
`;
```
then execute it and get the result:
```
const res = await code.run();
```
