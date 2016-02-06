
// The component as View Controller is what gives the real power to
// the component-router - it can be loaded on the fly, without previously
// being defined at the configuration time.
const ComponentAsViewController = {
  template: `
    <ion-view>
      <button ng-click="nav.pop()"> back</button>
      <h3>View Controller</h3>
      <br/>
      Passed Params: {{ params }}
      <br/>
      Local Vars: {{ localVar }}
      <br/>
      <button ng-click="nav.push('component-as-directive', nextParams)">
        Go To Component As Directive
      </button>
    </ion-view>
  `,
  controller: ['$scope', ($scope) => {
    $scope.nextParams = {
      msg: 'params passed from ViewCtrl'
    };
    $scope.localVar = 'This is a local var defined in the controller!';
  }]
};
