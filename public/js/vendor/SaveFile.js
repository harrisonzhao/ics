var sf = angular.module('vendor.services.SaveFile', []);

function destroyClickedElement(event)
{
  document.body.removeChild(event.target);
}

function saveAsFile(data, name) {
  var fileNameToSaveAs = name;

  var downloadLink = document.createElement('a');
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = 'Download File';
  if (window.webkitURL !== null)
  {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(data);
  }
  else
  {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(data);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}

//exports the save function which takes data (dataURL string) and name (string)
function SaveFile() {
  return {
    save: saveAsFile
  };
}

sf.factory('SaveFile', SaveFile);