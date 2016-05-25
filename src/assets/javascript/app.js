// inject the version of the used Draw2D lib into the header of the app
// (just to inform the developer which version is used))
$("#version").html(draw2d.Configuration.version);

var app = angular.module('draw2dApp', ["draw2d", 'ui.bootstrap']);
