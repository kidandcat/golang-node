# golang-node
Execute Go code from NodeJS

Golang code compiles so fast, but may be not worth if the Go program task is not too intensive for NodeJS. In the other case, if you need to make a high intensive task, you may want to do it in Go. For example, this package has been used for 

## Requirements

* NodeJS > 8.5.0

## Features

* Download custom Go compiler, no need to have Go installed
```diff
- AUTOMATIC DOWNLOAD IS NOT SET YET, YOU WILL NEED TO DOWNLOAD 
- THE PROPER GO COMPILER AND COPY IT UNDER "compilers" FOLDER AND 
- CHANGE THE Go FOLDER'S NAME TO THE PLATFORM NAME 
- (windows_64 or linux_64 for example)
```
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
