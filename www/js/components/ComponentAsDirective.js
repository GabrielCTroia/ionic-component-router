const ComponentAsDirective = () => ({
  //replace: 'true',
  template: `
    <ion-view>
      <button ng-click="nav.pop()">back</button>
      <h3>Component As Directive</h3>
      passed params: {{ params }}
      <br/>
      local vars: {{ local }}
      <br/>
      <br/>
      <button ng-click="pushNextViewCtrl()">
        Go To Component As View
      </button>
    </ion-view>
      `,
  scope: {
    nav: '=',
    params: '=',
  },
  controller: ['$scope', ($scope) => {
    $scope.local = 'just a local var';
    const nextParams = {
      msg: 'params from directive'
    };

    $scope.pushNextViewCtrl = $scope.nav.push.bind($scope.nav, ComponentAsViewController, nextParams);
  }]
});
