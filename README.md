# ionic-component-router

**This is a really early conceptualization of some ideas I had as a solution to the shortcomings 
of ui-router in a mobile app.**

### Why
- Because ionic v2's navigation system is awesome but unfortunately it's also months away. 
Besides, ionic v1 apps that are not ready to migrate yet can make use this approach.
- I am planning to use it in my own Ionic v1 medium to large project

### What does it do?
- It mostly tries to follow what react-native, ios or Ionic v2 navigation looks like, but in Ionic & Angular 1.
- Eliminates the need to define routes/states at config time. There is no idea of route anymore,
 just what will the next screen show. Each screen shows a *component* at a time, which is represented by:
    - a directive that has a `<ion-view>...</ion-view>` template
    - a View Controller pair which is simply an object looking like: 
    ```
    {
       template: "<ion-view>...</ion-view>",
       controller: ['$scope', ($scope) => {...}]
    }
    ```

### To Do:    

- Ask more people if they think this can be useful!!! Please share your thoughts with me at @gabrielctroia on twitter.

- To make the migration easier from ui-router, it can support an already defined state
- Optimize the changes made to the DOM
- Cache a limited amount of viewed components
- Connect it to angular's animation system for transitions
- look into lazy loading the templates??

### How:

I promise I will update this as I move further, but for now please look at www/index.html and www/js/components