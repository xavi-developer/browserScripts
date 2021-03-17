// ==UserScript==
// @name     Macrator
// @version  1
// @grant    none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// ==/UserScript==


var DEBUG = true;

localStorage.setItem('macratorElements', JSON.stringify([]));

function macratorSaveAction(event)
{
  var element = event.target;
	if(DEBUG) console.log('Macrator: adding element: ', element);
  
  if(element.id.includes('macrator_')) {
    return false;
  }
	
  var elements = localStorage.getItem('macratorElements');
  elements = JSON.parse(elements);
  var elementXPath = getElementXPath(element);
  elements.push(elementXPath);
  localStorage.setItem('macratorElements', JSON.stringify(elements));
  if(DEBUG) console.log('new elements list: ', elements);
}

function getElementXPath(element) {
	if (element && element.id) {
		// has id, so use it instead of full xpath
		return '//' + element.nodeName.toLowerCase() + '[@id="' + element.id + '"]';
	} else {
		// gets absolute xpath
    var paths = [];
    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; element && element.nodeType == 1; element = element.parentNode) {
      var index = 0;
      for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
        // Ignore document type declaration.
        if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE) continue;
        if (sibling.nodeName == element.nodeName) ++index;
      }

      var tagName = element.nodeName.toLowerCase();
      var pathIndex = ('[' + (index+1) + ']');
      paths.splice(0, 0, tagName + pathIndex);
    }
    return paths.length ? '/' + paths.join('/') : null;
	}
}

window.setTimeout(function() {
  
  var macratorCapturing = false;
  
  var controls = $('<div id="macrator_controls" style="position:absolute;top:0;left:0;z-index:99999999999999;border:2px dashed black;padding:5px;background-color:red">Macrator<div><span id="macrator_start" style="cursor:pointer">Start</span> | <span id="macrator_stop" style="cursor:pointer">Stop</span></div><div>');
  $('body').append(controls);
  
  $('#macrator_start').on('click', function() {
    macratorCapturing = true;
  });
  
  $(window).on('mousedown', function(e) {
      if(macratorCapturing == true) {
        macratorSaveAction(e);
      }
    	
  });
  
  $('#macrator_stop').on('click', function() {
      var elements = localStorage.getItem('macratorElements');
  		elements = JSON.parse(elements);
    	var host = window.location.hostname.replace('www.','');
    	var msg = "'" + host + "': '" + elements + "',";
    	alert(msg);
  });
  
});

