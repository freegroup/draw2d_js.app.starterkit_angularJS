app.controller('AboutController',  function($scope, $modalInstance) {



	// ng-click for "Ok"
	//
	$scope.ok = function() {
		$modalInstance.close();
	};

} );