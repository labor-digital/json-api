# Json API
Provides the implementation to communicate with an [json api compatible](https://jsonapi.org/) endpoint.
The package is build with [axios](https://www.npmjs.com/package/axios) as http client and utilizes [jsonapi-serializer](https://www.npmjs.com/package/json-api-serializer) to normalize the results into javascript objectes.

## Installation
Install this package using npm:

```
npm install @labor-digital/json-api
```

## Usage
```typescript
import {JsonApiState} from "./lib/JsonApiState"; 
import {JsonApi} from "./lib/JsonApi";

// Create the instance
const api = new JsonApi({baseUrl: "https://example.org/api/resources"});

// Request the resources of type "myResource" that are on page 2
// The query object has some types already defined but as specified in the json-api 
// definition, it can be extended with your own keys
const results = api.get("myResource", {page: {number: 2}});

// Iterate all results in the list and print the value of "myKey" into the console
results.forEach((result: JsonApiState) => {
    console.log(result.get("myKey"));
});

// You can also request a single resource by using the unique id as a lookup query
const state = api.getSingle("myResource", 12);
console.log(state.get("myKey"));
```

## Documentation
The documentation / API can be found [here](https://json-api.labor.tools) but is also rendered at "./doc/index.html" for local usage

## Postcardware
You're free to use this package, but if it makes it to your production environment we highly appreciate you sending us a postcard from your hometown, mentioning which of our package(s) you are using.

Our address is: LABOR.digital - Fischtorplatz 21 - 55116 Mainz, Germany

We publish all received postcards on our [company website](https://labor.digital).