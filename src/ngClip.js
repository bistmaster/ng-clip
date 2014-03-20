/*jslint node: true */
/*global ZeroClipboard */
'use strict';

angular.module('ngClipboard', []).
  provider('ngClip', function() {
    var self = this;
    this.path = '//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/1.3.2/ZeroClipboard.swf';
    this.noCache = true;
    return {
      setPath: function(newPath) {
       self.path = newPath;
      },

      setNoCache : function (isCache) {
        self.noCache = isCache;
      },

      $get: function() {
        return {
          path: self.path,
          noCache: self.noCache
        };
      }
    };
  }).
  run(['ngClip', function(ngClip) {
    ZeroClipboard.config({
      moviePath: ngClip.path,
      trustedDomains: ["*"],
      allowScriptAccess: "always",
      forceHandCursor: true,
      useNoCache: ngClip.noCache      
    });
  }]).
  directive('clipCopy', ['ngClip', function (ngClip) {
    return {
      scope: {
        clipCopy: '&',
        clipClick: '&'
      },
      restrict: 'A',
      link: function (scope, element, attrs) {
        // Create the clip object
        var clip = new ZeroClipboard(element);
        clip.on( 'load', function(client) {
          var onMousedown = function (client) {
            client.setText(scope.$eval(scope.clipCopy));
            if (angular.isDefined(attrs.clipClick)) {
              scope.$apply(scope.clipClick);
            }
          };
          client.on('mousedown', onMousedown);

          scope.$on('$destroy', function() {
            client.off('mousedown', onMousedown);
            client.unclip(element);
          });
        });
      }
    };
  }]);
