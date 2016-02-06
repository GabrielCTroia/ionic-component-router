class Nav {
  constructor($compile, $scope, $wrapperElm) {
    this._history = [];
    this._rendered = {};
    this._onChangeSubscribers = [];

    this._$parentScope = $scope;
    this._$wrapperElm = $wrapperElm;
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
    const last = this._history.slice(-1)[0];
    this._render(last.viewController, last.params);

    Array.prototype.map.call(this._onChangeSubscribers, f => f(this._history));
  }

  _normalizeViewController(vc) {
    console.log('normalize', vc);
    if (typeof vc === 'string') {
      return {template: `<${vc}></${vc}>`, controller: null}
    } else if (vc.root) {
      return {template: vc.root};
    }
    return vc;
  }

  _compile({template}, params) {
    const localScope = this._$parentScope.$new();
    localScope.nav = this;
    localScope.params = params;

    return this._$compile(template)(localScope);
  }

  _render(vc, params) {
    const nextId = 'vc-' + this.history.length;

    if (this._rendered[nextId]) {
      return this._rendered[nextId];
    }



    // normalize vc

    let template;
    // if directive
    if (typeof vc === 'string') {
      template = `<${vc} id="${nextId}" nav="nav" params="params"></${vc}>`;
    // if root
    } else if (vc.root) {
      template = vc.root;

      template.attr('id', nextId);
      template.attr('nav', 'nav');
      template.attr('params', 'params');

    // if view controller pair
    } else {
      template = vc.template;
    }

    //

    const compiled = this._compile({template});

    // append to the DOM only if the VC is not root
    if (this.history.length > 0) {
      this._$wrapperElm.append(compiled);
    }

    rendered[nextId] = compiled;

    //return rendered[nextId] = $compile(tpl)(localScope);

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
          let $child = tElm.children();

          return {
            pre($scope, $elm) {
              const nav = new Nav($compile, $scope, $elm);

              nav.push({root: $child});
              nav.onChange((history) => {
                console.log('Nav.push', history.slice(-1)[0]);
                console.log('  history:', history);
              });

            }
          }
        }
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
          <button ng-click="nav.pop()"> back</button>
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

