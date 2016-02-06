const RootComponentAsDirective = () => ({
  //replace: 'true',
  template: `
    <ion-view>
      <h3>Root Component (as directive)</h3>

      <button ng-click="pushNextViewCtrl()">
        Component as View Controller
      </button>
      <br/>
      <button ng-click="pushNextDirective()">
        Component as Directive
      </button>
    </ion-view>
      `,
  scope: {
    nav: '=',
    params: '@',
  },
  controller: ['$scope', ($scope) => {
    console.log('root component as directive', $scope);

    const nextParams = {
      msg: 23
    };

    $scope.pushNextViewCtrl = $scope.nav.push.bind($scope.nav, ComponentAsViewController, nextParams);
    $scope.pushNextDirective = $scope.nav.push.bind($scope.nav, 'component-as-directive', nextParams);
  }]
});
