# golang-node

Execute Go code from NodeJS

Golang code compiles so fast, but may be not worth if the Go program task is not
too intensive for NodeJS. In the other case, if you need to make a high
intensive task, you may want to do it in Go.

## ToDO

* Testing in different Go environments (with and without golang installed)
* Develop more platforms (now only working for linux_64 and windows_64)

## Requirements

* NodeJS > 8.5.0

## Features

* Download custom Go compiler, no need to have Go installed
* Automatically "go get" all imported packages

## Example

Compile program:

```javascript
const Go = require("golang-node");

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
