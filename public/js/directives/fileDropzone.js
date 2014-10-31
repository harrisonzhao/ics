//dropzone directive for uploading files
//modifies the local scope's file and fileName attributes
//
var dropzone = angular.module('directives.fileDropzone', []);

function Dropzone() {
  return {
    restrict: 'A',

    scope: {
      file: '=',
      fileName: '='
    },

    link: function(scope, element, attrs) {
      var checkSize, processDragOverOrEnter;
      processDragOverOrEnter = function(event) {
        if (event !== null) {
          event.preventDefault();
        }
        event.dataTransfer.effectAllowed = 'copy';
        return false;
      };
      checkSize = function(size) {
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
        var file, name, reader, size;
        if (event !== null) {
          event.preventDefault();
        }
        reader = new FileReader();
        reader.onload = function(evt) {
          if (checkSize(size)) {
            scope.file = evt.target.result;
            scope.fileName = name;
            scope.$apply(attrs.dropzone);
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

dropzone.directive('dropzone', Dropzone);