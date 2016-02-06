class Nav {
  constructor($scope, $compile) {
    this._history = [];
    this._onChangeSubscribers = [];
    this._$scope = $scope;
    this._$compile = $compile;
  }

  push(viewController, params = {}) {
    if (typeof viewController === 'string') {
      console.log('is a registered directive view controller');
    } else {
      console.log('is an unregistered view ctrl');
    }

    this._history.push({viewController, params});
    this._publishOnChange();
  }

  pop() {
    this._history.pop();
    this._publishOnChange();
  }

  onChange(fn) {
    if (typeof fn === 'function') {
      this._onChangeSubscribers.push(fn);
    } else {
      console.warn('Nav.onChange(fn) must be a function!');
    }
  }

  _publishOnChange() {
    Array.prototype.map.call(this._onChangeSubscribers, f => f(this._history));
  }

  get history() {
    return this._history;
  }
}

const PageAViewController = {

  template: `
    Page A view controller
  `,
  controller: [($scope) => {
    console.log('page A view controller', $scope);
  }]
};

rendered = {};
const render = ($compile, $scope, params, tpl, nav, parent) => {
  const nextId = 'vc-' + nav.history.length;

  if (rendered[nextId]) {
    return rendered[nextId];
  }

  if (nav.history.length > 0) {
    let tpl = `<${last.viewController}
                  id="vc-${history.length}"
                  nav="nav"
                  params="params">
                </${last.viewController}>`;

    //const $nextElm = push($compile, $scope, {}, tpl, nav);
  }

  tpl.attr('nav', 'nav');
  tpl.attr('id', nextId);

  const localScope = $scope.$new();
  localScope.nav = nav;
  localScope.params = params;

  return rendered[nextId] = $compile(tpl)(localScope);

  // from ui-router
  //var locals = {};
  //var link = $compile($element.contents());

  //if (locals.$$controller) {
  //  locals.$scope = scope;
  //  var controller = $controller(locals.$$controller, locals);
  //  if (locals.$$controllerAs) {
  //    scope[locals.$$controllerAs] = controller;
  //  }
  //  $element.data('$ngControllerController', controller);
  //  $element.children().data('$ngControllerController', controller);
  //}
};

angular.module('nav', [])

  .directive('navController', [
    '$compile', '$controller', '$interpolate',
    ($compile, $controller, $interpolate) => {
      return {
        //transclude: true,
        //replace: true,
        restrict: 'E',
        priority: 99999, // highest importance
        terminal: true, // needs to be terminal so the child directive will not render 2 times
        template: ``,
        scope: {},
        compile(tElm) {
          let child = tElm.contents();

          //child.data('nav', 'nav');
          //child.attr('get-nav', 'getNav()');
          //child.attr('nav', 'nav');
          //child.attr('id', 'vc-root');
          console.log('child', child);

          var currentVCId = 'vc-root';
          //tElm.empty();
          return {
            pre($scope, $elm, attrs, ctrl, transclude) {
              const nav = new Nav();

              render($compile, $scope, {}, child, nav);

              nav.onChange((history) => {
                const last = history[history.length - 1];
                //render($compile, $scope, history)
                //const ctrlName = 'myCtrl' + history.length;
                //
                //var x = $controller(ctrlName, {
                //  $scope: $scope.$new(),
                //  //$element:
                //});
                //

                const nextId = 'vc-' + history.length;




                $elm.append($nextElm);

                console.log('Nav.push', last);
                console.log('  history:', history);
              });

            }
          }
        },
        nocontroller: ['$scope', '$controller', '$compile', ($scope, $controller, $compile) => {

          $scope.nav = nav;
          console.log('nav controller', $scope, $scope.nav);
        }],
      }
    }
  ])

  .directive('app', [
    () => ({
      //replace: 'true',
      template: `
        <ion-view>

          <button ng-click="nav.pop()"> back</button>
          <br/>
          app directive
          <br/>

          <button ng-click="pushB()">Component B</button>
          <button ng-click="pushViewCtrl()">Page A ViewController</button>
        </ion-view>
      `,
      //template: '<div>works? {{ params }}</div>',
      scope: {
        params: '@',
        getNav: '&',
        nav: '='
      },
      //link($scope, $elm, $attrs) {
      //  console.log('--- start ---');
      //  console.log('scope:', $scope);
      //  console.log('attrs:', $attrs);
      //  console.log('params in scope:', $scope.params);
      //  //console.log('nav in scope:', $scope.getNav());
      //  console.log('nav in scope:', $scope.nav);
      //  console.log('--- end ---');
      //}
      controller: ['$scope', ($scope) => {
        console.log('app nav', $scope, $scope.nav);

        $scope.pushB = $scope.nav.push.bind($scope.nav, 'first-page', {});

        $scope.pushViewCtrl = $scope.nav.push.bind($scope.nav, PageAViewController, {});
      }]
    })
  ])

  .directive('firstPage', [
    () => ({
      //replace: 'true',
      template: `
        <ion-view>
          First Page with params: {{ ::params }}
        </ion-view>
      `,
      scope: {
        nav: '=',
        params: '=',

        next: '&',
      },
      controller: ['$scope', ($scope) => {

      }]
    })
  ])

  .directive('secondPage', [
    () => ({
      template: `
        <ion-view>
          Second Page with params: {{ ::params }}
        </ion-view>
      `,
      scope: {},
      controller: ['$scope', ($scope) => {

      }]
    })
  ])

