//dropzone directive for uploading files
//modifies the local scope's files array
//
var dropzone = angular.module('directives.fileDropzone', []);

function Dropzone($rootScope) {
  return {
    restrict: 'A',

    scope: {
      file: '=',
      fileName: '='
    },

    link: function(scope, element, attrs) {
      var checkSize, processDragOverOrEnter;
      processDragOverOrEnter = function(event) {
        console.log('in here');
        if (event !== null) {
          event.preventDefault();
        }
        event.dataTransfer.effectAllowed = 'copy';
        return false;
      };
      checkSize = function(size) {
        console.log(size);
        var _ref;
        if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || 
            (size / 1024) / 1024 < attrs.maxFileSize) {
          return true;
        } else {
          alert('File must be smaller than ' + attrs.maxFileSize + ' MB');
          return false;
        }
      };

      element.bind('dragover', processDragOverOrEnter);
      element.bind('dragenter', processDragOverOrEnter);

      return element.bind('drop', function(event) {
        var currDirId = $rootScope.currentUser.dirPath[
          $rootScope.currentUser.dirPath.length - 1].id;
        var file, name, reader, size;
        if (event !== null) {
          event.stopPropagation();
          event.preventDefault();
        }
        reader = new FileReader();
        reader.onload = function(evt) {
          if (checkSize(size)) {
            return scope.$apply(function() {
              scope.files.push({
                idParent: currDirId,
                file: evt.target.result,
                fileName: name
              });
              scope.upload();
            });
          }
        };
        file = event.dataTransfer.files[0];
        name = file.name;
        size = file.size;
        reader.readAsDataURL(file);
        return false;
      });

    }
  };
}

dropzone.directive('dropzone', ['$rootScope', Dropzone]);