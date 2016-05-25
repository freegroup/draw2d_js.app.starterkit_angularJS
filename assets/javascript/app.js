
var d2=angular.module('draw2d', []);
;
d2.directive("draw2dCanvas", ["$window","$parse", "$timeout", function($window,$parse, $timeout){

       return {
    		   restrict: 'E,A',
   	           link: function(scope, element, attrs,controller) {

   	                // provide the scope properties and override the defaults with the user settings
   	                //
	   	            scope.editor= $.extend(true,{
	   	        	    canvas: {
	   	        	    	width : 2000,
    	                    height: 2000,
	   	        	    	onDrop: function(droppedDomNode, x, y, shiftKey, ctrlKey){}
	   	        	    },
	   	        	    palette:{
	   	        	    	figures: []
	   	        	    },
	   	            	state:{
	   	            		dirty  : false,
		                	canUndo: false,
		                	canRedo: false
	   	            	},
	   	            	selection:{
	   	            		className:null,
	   	            		figure:null,
	   	            		attr:null
	   	            	}
	   	            	
	   	           }, scope.editor);
   	        	    
	   	           // init the Draw2D Canvas with the given user settings and overriden hooks
	   	           //
	   	           var canvas = new draw2d.Canvas(element.attr("id"), scope.editor.canvas.width, scope.editor.canvas.height);
   	               canvas.setScrollArea("#"+element.attr("id"));
    	           canvas.onDrop = $.proxy(scope.editor.canvas.onDrop, canvas);

    	           // update the scope model with the current state of the
    	           // CommandStack
    	           var stack = canvas.getCommandStack();
    	           stack.addEventListener(function(event){
    	               $timeout(function(){
    	                   scope.editor.state.canUndo= stack.canUndo();
    	                   scope.editor.state.canRedo= stack.canRedo();
    	               },0);
    	           });
    	           
    	           // Update the selection in the model
    	           // and Databinding Draw2D -> Angular
    	           var changeCallback = function(emitter, attribute){
    	        	   $timeout(function(){
    	        		   if(scope.editor.selection.attr!==null){
    	        			   scope.editor.selection.attr[attribute]= emitter.attr(attribute);
    	        		   }
    	               },0);
    	           };
    	           canvas.on("select", function(canvas,event){
					   var figure = event.figure;
					   if(figure instanceof draw2d.Connection){
						   return; // silently
					   }

    	               $timeout(function(){
    	            	   if(figure!==null){
    	            		   scope.editor.selection.className = figure.NAME;
    	            		   scope.editor.selection.attr = figure.attr();
    	            	   }
    	            	   else {
    	            		   scope.editor.selection.className = null;
    	            		   scope.editor.selection.attr = null;
    	            	   }
    	            	   
    	            	   // unregister and register the attr listener to the new figure
    	            	   //
    	            	   if(scope.editor.selection.figure!==null){scope.editor.selection.figure.off("change",changeCallback);}
    	            	   scope.editor.selection.figure = figure;
    	            	   if(scope.editor.selection.figure!==null){scope.editor.selection.figure.on("change",changeCallback);}
    	               },0);
    	           });

    	           // Databinding: Angular UI -> Draw2D
    	           // it is neccessary to call the related setter of the draw2d object. "Normal" Angular 
    	           // Databinding didn't work for draw2d yet
    	           //
	               scope.$watchCollection("editor.selection.attr", function(newValues, oldValues){
    	        	   
    	               if(oldValues !== null && scope.editor.selection.figure!==null){
    	            	   // for performance reason we post only changed attributes to the draw2d figure
    	            	   //
    	            	   var changes = draw2d.util.JSON.diff(newValues, oldValues);
   	            		   scope.editor.selection.figure.attr(changes); 
    	               }
    	           });
    	           
	               // push the canvas function to the scope for ng-action access
	               //
    	           scope.editor.undo = $.proxy(stack.undo,stack);
    	           scope.editor.redo = $.proxy(stack.redo,stack);
    	           scope.editor["delete"] = $.proxy(function(){
    	   			  var node = this.getCurrentSelection();
    				  var command= new draw2d.command.CommandDelete(node);
    				  this.getCommandStack().execute(command);
    	           },canvas);
                   scope.editor.load = $.proxy(function(json){
                       canvas.clear();
                       var reader = new draw2d.io.json.Reader();
                       reader.unmarshal(canvas, json);
                   },canvas);
    	       }
      };
}]);

  ;
d2.directive("draw2dPalette",  ["$window","$parse",'$timeout', function($window,$parse, $timeout){
   return {
		   restrict: 'E,A',
           link: function(scope, element, attrs,controller) {

               // $timeout is used just to ensure that the template is rendered if we want access them
               // (leave the render cycle)
               $timeout(function(){
                   $(".draw2d_droppable").draggable({
                       appendTo:"body",
                       stack:"body",
                       zIndex: 27000,
                       helper:"clone",
                       drag: function(event, ui){
                       },
                       stop: function(e, ui){
                       },
                       start: function(e, ui){
                           $(ui.helper).addClass("shadow");
                       }
                  });
               },0); 
    	   },
    	   template:"<div ng-repeat='figure in editor.palette.figures' data-shape='{{figure.class}}'  class='palette_node_element draw2d_droppable'>{{figure.name}}</div>"
   };
}]);

;// inject the version of the used Draw2D lib into the header of the app
// (just to inform the developer which version is used))
$("#version").html(draw2d.Configuration.version);

var app = angular.module('draw2dApp', ["draw2d", 'ui.bootstrap']);
;var DemoData = [
                {
                    name:"Demo1.draw2d",
                    content:[  {  "type":"draw2d.shape.node.Start","id":"354fa3b9-a834-0221-2009-abc2d6bd852a","x":113,"y":321,"width":50,"height":50,"userData":{ },"cssClass":"draw2d_shape_node_Start","bgColor":"#4D90FE","color":"#000000","stroke":1,"alpha":1,"radius":2},{  "type":"draw2d.shape.node.Start","id":"354fa3b9-a834-0221-2009-abc2d6bd898952a","x":125,"y":97,"width":50,"height":50,"userData":{  },"cssClass":"draw2d_shape_node_Start","bgColor":"#4D90FE","color":"#000000","stroke":1,"alpha":1,"radius":2},{ "type":"draw2d.shape.node.Start","id":"354fa3b9-a834-0221-2009-a12bc2d6bd898952a","x":462,"y":89,"width":50,"height":50,"userData":{ },"cssClass":"draw2d_shape_node_Start","bgColor":"#4D90FE","color":"#000000","stroke":1,"alpha":1,"radius":2},{  "type":"draw2d.shape.node.End","id":"ebfb35bb-5767-8155-c804-14bda7759dc2","x":579,"y":456,"width":50,"height":50,"userData":{  },"cssClass":"draw2d_shape_node_End","bgColor":"#4D90FE","color":"#000000","stroke":1,"alpha":1,"radius":2},{  "type":"draw2d.Connection","id":"74ce9e7e-5f0e-8642-6bec-4ff9c54b3f0a","userData":{ },"cssClass":"draw2d_Connection","stroke":1,"color":"#1B1B1B","outlineStroke":0,"outlineColor":"none","policy":"draw2d.policy.line.VertexSelectionFeedbackPolicy","router":"draw2d.layout.connection.VertexRouter","vertex":[  {  "x":163,"y":346},{  "x":325,"y":191},{  "x":383,"y":298},{  "x":353,"y":288},{  "x":579,"y":481}],"source":{  "node":"354fa3b9-a834-0221-2009-abc2d6bd852a","port":"output0"},"target":{  "node":"ebfb35bb-5767-8155-c804-14bda7759dc2","port":"input0"}},{  "type":"draw2d.Connection","id":"ceea6415-f45c-2f62-30bc-61124c099ab8","userData":{ },"cssClass":"draw2d_Connection","stroke":3,"color":"#1B1B1B","radius":80,"outlineStroke":1,"outlineColor":"#30f090","policy":"draw2d.policy.line.VertexSelectionFeedbackPolicy","router":"draw2d.layout.connection.VertexRouter","vertex":[  {  "x":512,"y":114},{  "x":613,"y":114},{  "x":502,"y":281},{  "x":579,"y":481}],"source":{  "node":"354fa3b9-a834-0221-2009-a12bc2d6bd898952a","port":"output0"},"target":{  "node":"ebfb35bb-5767-8155-c804-14bda7759dc2","port":"input0"}}]
                },
                {
                    name:"Demo2.draw2d",
                    content:[  {  "type":"draw2d.shape.node.Start","id":"354fa3b9-a834-0221-2009-abc2d6bd852a","x":113,"y":321,"width":50,"height":50,"userData":{ },"cssClass":"draw2d_shape_node_Start","bgColor":"#4D90FE","color":"#000000","stroke":1,"alpha":1,"radius":2},{  "type":"draw2d.shape.node.Start","id":"354fa3b9-a834-0221-2009-abc2d6bd898952a","x":75,"y":84,"width":50,"height":50,"userData":{ },"cssClass":"draw2d_shape_node_Start","bgColor":"#4D90FE","color":"#000000","stroke":1,"alpha":1,"radius":2},{  "type":"draw2d.shape.node.Start","id":"354fa3b9-a834-0221-2009-a12bc2d6bd898952a","x":326,"y":329,"width":50,"height":50,"userData":{ },"cssClass":"draw2d_shape_node_Start","bgColor":"#4D90FE","color":"#000000","stroke":1,"alpha":1,"radius":2},{  "type":"draw2d.shape.node.End","id":"ebfb35bb-5767-8155-c804-14bda7759dc2","x":442,"y":128,"width":50,"height":50,"userData":{ },"cssClass":"draw2d_shape_node_End","bgColor":"#4D90FE","color":"#000000","stroke":1,"alpha":1,"radius":2},{ "type":"draw2d.shape.note.PostIt","id":"12317cbd-b3af-c116-756f-7de55783a0bd","x":20,"y":20,"width":486,"height":23.1875,"userData":{ },"cssClass":"draw2d_shape_note_PostIt","bgColor":"#5B5B5B","color":"#FFFFFF","stroke":1,"alpha":1,"radius":5,"text":"Connections with FanConnectionRouter","outlineStroke":0,"outlineColor":"none","fontSize":14,"fontColor":"#FFFFFF","fontFamily":null},{  "type":"draw2d.Connection","id":"3919bb06-9731-14b6-7d1e-c024ec86fe58","userData":{ },"cssClass":"draw2d_Connection","stroke":2,"color":"#00A8F0","outlineStroke":1,"outlineColor":"#303030","policy":"draw2d.policy.line.LineSelectionFeedbackPolicy","router":"draw2d.layout.connection.FanConnectionRouter","radius":2,"source":{  "node":"354fa3b9-a834-0221-2009-abc2d6bd852a","port":"output0"},"target":{  "node":"ebfb35bb-5767-8155-c804-14bda7759dc2","port":"input0"}},{  "type":"draw2d.Connection","id":"0f32be8f-e16b-4bac-9f06-005fa95603b0","userData":{ },"cssClass":"draw2d_Connection","stroke":2,"color":"#00A8F0","outlineStroke":1,"outlineColor":"#303030","policy":"draw2d.policy.line.LineSelectionFeedbackPolicy","router":"draw2d.layout.connection.FanConnectionRouter","radius":2,"source":{  "node":"354fa3b9-a834-0221-2009-abc2d6bd898952a","port":"output0"},"target":{  "node":"ebfb35bb-5767-8155-c804-14bda7759dc2","port":"input0"}},{  "type":"draw2d.Connection","id":"36049a06-1555-d327-d8b9-a7f8a965611a","userData":{ },"cssClass":"draw2d_Connection","stroke":2,"color":"#00A8F0","outlineStroke":1,"outlineColor":"#303030","policy":"draw2d.policy.line.LineSelectionFeedbackPolicy","router":"draw2d.layout.connection.FanConnectionRouter","radius":2,"source":{  "node":"354fa3b9-a834-0221-2009-abc2d6bd898952a","port":"output0"},"target":{  "node":"ebfb35bb-5767-8155-c804-14bda7759dc2","port":"input0"}},{  "type":"draw2d.Connection","id":"7e07dae9-b46c-8df5-ef23-78d7ad24b855","userData":{ },"cssClass":"draw2d_Connection","stroke":2,"color":"#00A8F0","outlineStroke":1,"outlineColor":"#303030","policy":"draw2d.policy.line.LineSelectionFeedbackPolicy","router":"draw2d.layout.connection.FanConnectionRouter","radius":2,"source":{  "node":"354fa3b9-a834-0221-2009-a12bc2d6bd898952a","port":"output0"},"target":{  "node":"ebfb35bb-5767-8155-c804-14bda7759dc2","port":"input0"}},{  "type":"draw2d.Connection","id":"3570891e-5544-50ff-8165-20da0cae1917","userData":{ },"cssClass":"draw2d_Connection","stroke":2,"color":"#00A8F0","outlineStroke":1,"outlineColor":"#303030","policy":"draw2d.policy.line.LineSelectionFeedbackPolicy","router":"draw2d.layout.connection.FanConnectionRouter","radius":2,"source":{  "node":"354fa3b9-a834-0221-2009-a12bc2d6bd898952a","port":"output0"},"target":{  "node":"ebfb35bb-5767-8155-c804-14bda7759dc2","port":"input0"}}]
                }
                ];;app.factory('FileFactory', ["$timeout",function fileStorage($timeout) {
    return {
    	// get all availabel files
    	//
        getFileEntries : function(successCallback, errorCallback){
        	$timeout(function(){
	        	successCallback( DemoData);
        	},0);
        },
        
        // load the file content from the given file description
        //
        getContent : function(fileEntry, onSuccessCallback, onErrorCallback){
            $timeout(function(){
                onSuccessCallback(fileEntry.content);
            },0);
        }
    };
}]);
;app.controller('AboutController',  function($scope, $modalInstance) {



	// ng-click for "Ok"
	//
	$scope.ok = function() {
		$modalInstance.close();
	};

} );;/* jshint evil:true */
app.controller('EditorController',[ '$scope', "$modal", function($scope,  $modal) {
	

    $scope.editor = {
    		// ng-click Callbacks
            //
            // Open the FileOpenDialog and let the user select a new file for open
    		//
    		fileOpen: function(){
    		    var modalInstance = $modal.open({
    		      templateUrl:'assets/templates/FileOpenController.html',
    		      controller: 'FileOpenController'
    		    });
    		    
    		    modalInstance.result.then(
    		        // [OK]
    		    	function (content) {
    		    	    $scope.editor.load(content);
	    		    }, 
	    		    // [Cancel]
	    		    function () {
	    		        
	    		    }
	    	   );
    		},

            // ng-click Callbacks
            //
            // Open the FileOpenDialog and let the user select a new file for open
            //
            about: function(){
                var modalInstance = $modal.open({
                    templateUrl:'assets/templates/AboutController.html',
                    controller: 'AboutController'
                });

                modalInstance.result.then(
                    // [OK]
                    function () {

                    },
                    // [Cancel]
                    function () {

                    }
                );
            },

            //------------------------------------------------------------------------
    		
    		
    		// Configuration of the editor
    		//
    		// 
            canvas : {
                // callback if a DOM node from the palette is dropped inside the canvas
                //
                onDrop: function(droppedDomNode, x, y, shiftKey, ctrlKey){
                    var type = $(droppedDomNode).data("shape");
                    var figure = eval("new "+type+"();");
                    // create a command for the undo/redo support
                    var command = new draw2d.command.CommandAdd(this, figure, x, y);
                    this.getCommandStack().execute(command);
                }
            },
 
            // provide all figures to show in the left hand palette.
            // Used by the directrives/canvas.js
            palette: {
                    figures: [
                        {class:"draw2d.shape.node.Start", name:"Start"},
                        {class:"draw2d.shape.node.End"  , name:"End"}
                    ]
            }
    };
}]);
;app.controller('FileOpenController',  function($scope, $modalInstance, FileFactory) {

	$scope.files    = [];
	$scope.selected = {file:null};

	// Retrieve the file definitions from the FileFactory and
	// provide them to the scope
	//
	FileFactory.getFileEntries(function(entries) {
		$scope.$apply(function() {
	       $scope.files = entries;
		});
	});

	// ng-click for "Ok"
	//
	$scope.ok = function() {
	    FileFactory.getContent($scope.selected.file, function(content) {
	        $scope.$apply(function() {
	            $modalInstance.close(content);
	        });
	    });
	};

	// ng-click for "Cancel"
	//
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
} );