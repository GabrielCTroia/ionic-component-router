# ionic-component-router

**This is a really early conceptualization of some ideas I had as a solution to the shortcomings 
of ui-router in a mobile app.**

### Why
- Because ionic-nav's is awesome but unfortunately it's also months away. Besides, ionic v1 apps that 
are not ready to migrate yet, can use this approach.
- It works 

### What does it do?
- It mostly tries to follow what react-native, ios or ionic 2 navigation look like, but in Ionic & Angular 1.
- Eliminates the need to define routes/states at config time. There is no idea of route anymore,
 just about what will the next screen show. Each screen represent a component, which is represented by:
    - a directive that has a `<ion-view>...</ion-view>` template
    - a View Controller pair which is simply an object looking like: 
    ```
    {
       template: "<ion-view>...</ion-view>",
       controller: ['$scope', ($scope) => {...}]
    }
    ```

### To Do:    

- To make the migration easier from ui-router, it can support an already defined state


### How:

```
<body>
  <nav-controller>
    <app></app>
  </nav-controller>
</body>
```