# QuiVZ_APP

QuiVZ Frontend built in [InfernoJS](https://www.infernojs.org/), to be used in conjuction with [QuiVZ API](https://github.com/seph86/QuiVZ_API)

## Installation

Clone repo to a directory of your choosing
```
git clone https://github.com/seph86/QuiVZ_APP.git
```

Install neccessary npm packages
```
npm i
```

Build
```
npm run build
```

Copy result from `/build` directory to wherever you wish to serve the front end.
API may need to be set as seen in [index.js](src/index.js)


## Roadmap

### Code changes
- [ ] Include inline commenting
- [ ] Refactor code to be cleaner 
- [ ] Migrate to a new UI Framework
- [ ] Move from SSE to websockets

### Visual changes
- [ ] Implement visual feedback that menu segments are interactable
- [ ] Move popups away from ugly toast messages
- [ ] Implement sound design


## UX3

- The readme details technical information on deployment of the application so that team members or fresh developers have a easier start to developing the product.
- An in app help system provides new users a way to learn how to use the app without guesswork.  No matter how "intuative" a product may be, some users may still struggle to understand how to use it.
- The roadmap provides a list of future goals for developers to implement as well as show general users of planned features for the app.
- A existing built product allows users to use the product without the need of setting it up themselves which may be impossible for those who have no experience in setting up applications.

A general help document or wiki as to the workings and procedures of the apps systems can help in the further development of the product.


## Experience

### What portions of the development went particularly well
Initial setup of the building blocks for the app, such as frameworks, libraries and technologies such as SSE was easy to implement/develop.

### What was the most difficult to implement
Due to the nature of the app, Server Side Events was a requirement.  Finding a solution where multiple sessions could cross communicate took a substantial ammount of time.

### If you had the chance to do this again, what would you do differently
Implementation and customisation of Fomantic UI framework; while a nice looking framework, is too clunky, bloated, and almost impossible to optimize.  Causing a required huge CSS file to make the app work reducing the app's responsiveness low.  A more mobile centric UI framework would of been a better choice.
Using SSE might of also been a poor choice for real time event handling.  Websocket's might of been a better choice

### What parts of the implementation incomplete at this stage of delivery.
Part of the design proposal was to implement the ability for users to create their own quiz questions, rate them, and report ones deemed not appropriate or wrong.
While this would of been easy to make server side, it would of added significantly more development time then was available, as well as identifying the logic required to provide quiz questions from both the Open Trivia API and QuiVZ in a way that seemed "random".

### Write and reflect on “Quality Assurance” how are you practicing this?
By constantly switching environments while testing the app during multiple phases of development has provided example edge cases that I didn't anticipate during development.

### How much of the prototype UX1 remains in the final project.
The original code used for UX1 is completely non-existant in this project as it was developed using ReactJS with FomanticUI integrated and using a CDN instead of a compiled product using NodeJS.  However the general visual layout has remained largely the same.

Where has your project Object Oriented programming implemented
The app was built InfernoJS using mostly component classes which is a form of OOP.
