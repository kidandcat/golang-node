# golang-node
Execute Go code from NodeJS

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
    fmt.Println("    Testing another line")
}
`;
```
then execute it and get the result:
```javascript
const res = await code.run();
```
