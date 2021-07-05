## Making and routing a component
#### Create and add a new component

* A component contains the following files in a folder ```component-name```:
  - ```component-name.component.ts```
  
    This file contains TypeScript code used to program the functionality of the component
  - ```component-name.component.html```
  
    This file contains the html used to set up the UI of the component
  - ```component-name.component.css```
  
    This file stores the styles used by the html file
  - ```component-name.component.spec.ts```
  
    This file contains test functions that can be run to unit test the functionality of the component
    
    
* The Angular CLI can be used to create a new component in the project
* The CLI command creates a folder with the component's name in the ```An-Scealai/ngapp/src/app``` path or in a sub-folder if in that directory when creating the new component
```bash
ng generate component [component-name]
```
shorthand version
```bash
ng g c [component-name]
```

* If using the CLI command, the component will automatically be imported into the ```app.module.ts``` file where it belongs to an NgModule.  This allows the component to to be available to another component or application.  To do this in the file manually:

  Import the component at the top of the file
```ts
import { ComponentName } from './component-name/component-name.component';
```
  Add the component to the ```declarations``` list
```ts
  declarations: [
    ...,
    ComponentName,
    ...
  ]
```

* Component TypeScript files follow a conventional structure.  The top of the file contains all the imports necessary for the component.  This includes node libraries, Angular dependencies, service files, and other components.
```ts
...
import { Component, OnInit, HostListener } from '@angular/core';
import { Classroom } from '../classroom';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
...
```

* Components then declare the different files and HTML tag selector that make up the component
```ts
@Component({
  selector: 'app-component-name',
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.css']
})
```  

* Next, the component class is declared
```ts 
export class ComponentNameComponent implements OnInit {
}
```

* Inside the class you can declare your global variables.  Variables have a name, followed by a colon and their datatype.  They are either initialized to a particular value or simply left declared. 
```ts
  createNewMessage: boolean = false;
  students : User[] = [];
  receivedMessages: Message[] = [];
  classroom : Classroom = new Classroom;
  studentId: string = '';
```

* Each class has a constructor.  Here you can initialize any services needed that you imported at the top of the file
```ts
constructor(...
            private classroomService: ClassroomService,
            private userService: UserService, 
            private route: ActivatedRoute
            ...) { }
```

* Finally, you can declare any functions in the class to manipulate data.  Functions can be used to change values in the corresponding html and css files.
```ts
  playbackAudio() {
    ...
  }

  saveAudio() {
    ...
  }

  showModal() {
    ...
  }
```

* the function ```ngOnInit``` is run every time the component is loaded and is normally the first function declared in the component.
```ts
  ngOnInit() {
    ...
  }
```

* Any time global variables or functions are referenced within the file, they must be preceded by the ```this.``` quantifier.
```ts
  incrementCounter() {
    this.counter = 10;
    this.updateMessage();
}
```

  
#### Create and add a new services
* Services are files that contain function calls to the backend.  They serve as a middleman to send and receive data between the backend and the components.  If a service file contains functions that are called from a particular component, the name of the service file matches the name of the component: ```component-name.service.ts```.

* Service files contain functions that make a call to the backend to send and retrieve data.  Components use the service object declared in the constructor to call on the service functions and wait for their response.  The service functions return observables that the components can subscribe to.
  
   Example of ```component-name.ts``` using the ```itemService``` to call a function ```getItems()``` declared in ```component-name.service.ts```
```ts
   this.itemService.getItems().subscribe((res: Item) => {
     console.log(res);
   }
```
   
  The service function as declared in ```component-name.service.ts```:
```ts
getItems() : Observable<any> {
    return this.http.get(this.baseUrl + 'getItems');
}
```

* Service files contain a ```baseUrl``` that defines the path to the route which contains the endpoints needed in the service.  For example, an ```item.service.ts``` would need to connect to endpoints defined in an ```item``` route.  The ```baseUrl``` would then be defined as:
```ts 
baseUrl: string = config.baseurl + "item/";
```

* This ```baseUrl``` can then be used as a base for calling all the different ```item``` endpoints.  Each call to an endpoint adds the additional endpoint route information necessary for calling a specific endpoint.  For example, this is added as a string after the ```baseUrl``` in the ```this.http.get()``` call.
```ts 
this.http.get(this.baseUrl + 'getItems');
```

* Sometimes an endpoint needs more information in order to retrieve the correct data, such as an id.  These values can be passed through the parameters of the function and added to the route url.
```ts 
getItemById(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + 'getItemById/' + id);
}
```

* For a post request, the service is sending data to the backend instead of simply retrieving.  This data can be passed through the function parameters and then added as a parameter to the http request.
```ts
saveItem(item): Observable<any> {
    return this.http.post(this.baseUrl + "saveItem/", {item: item});
}
```


Services / calling endpoints
UI logic
Handling endpoint errors
Testing
CSS
Navigation