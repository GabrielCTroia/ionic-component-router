angular.module('ionic-component-router', [])

  .directive('navController', [
    '$compile', '$controller', '$interpolate',
    ($compile, $controller) => {
      return {
        //transclude: true,
        //replace: true,
        restrict: 'E',
        priority: 99999, // highest priority
        terminal: true, // needs to be terminal so the child directive will not render 2 times
        scope: {},
        compile(tElm) {
          let $rootElm = tElm.children();
          return {
            pre($scope, $elm) {
              const nav = new Nav($compile, $scope, $elm, angular, $controller);

              nav.push({root: $rootElm});
              nav.onChange((history) => {
                console.log('Current View', history.slice(-1)[0]);
                console.log('  history:', history);
              });

            }
          }
        }
      }
    }
  ]);

class Nav {
  constructor($compile, $scope, $wrapperElm, angular, $controller) {
    this._history = [];
    this._rendered = {};
    this._onChangeSubscribers = [];

    this._$parentScope = $scope;
    this._$wrapperElm = $wrapperElm;
    this._$compile = $compile;
    this._$controller = $controller;
    this._angular = angular;
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

  _compile({template, controller}, params) {
    const localScope = this._$parentScope.$new();
    localScope.nav = this;
    localScope.params = params;

    if (controller) {
      const c = this._$controller(controller, {
        $scope: localScope
      });
      template.data('$ngControllerController', c);
    }

    return this._$compile(template)(localScope);
  }

  _render(vc, params) {
    const nextId = 'vc-' + this.history.length;

    if (this._rendered[nextId]) {
      console.log("I'm already rendered", this._rendered);

      this._cleanDOM();
      document.getElementById(nextId).style.display = '';
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

      // if view-controller pair
    } else {
      template = this._angular.element(vc.template);
    }

    //

    const compiled = this._compile({template, controller: vc.controller}, params);


    // append to the DOM only if the VC is not root
    if (this.history.length > 0) {
      //this._cleanDOM();
      this._$wrapperElm.append(compiled);
    }

    //this._rendered[nextId] = compiled;
  };

  _cleanDOM() {
    const lastID = 'vc-' + (this.history.length - 1);
    document.getElementById(lastID).style.display = 'none';
  }

  get history() {
    return this._history;
  }
}
