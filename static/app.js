(function(){
	var app = angular.module('dashboard', []);

	app.controller('DashboardCtrl', function($scope, $http){
		$scope.spaces = [];
		$scope.statuses = [];
		$scope.currentSpace = null;
		$scope.currentStatus = null;
		$scope.user_id = '';

		$scope.allSpaces = function(){
			return $scope.currentSpace === null;
		};

		$scope.allStatuses = function(){
			return $scope.currentStatus === null;
		}

		$scope.filterSpace = function(space){
			$scope.currentSpace = space;
		}

		$scope.filterStatus = function(status){
			$scope.currentStatus = status;
		}

		$scope.isCurrentSpace = function(space){
			return $scope.currentSpace === space;
		}

		$scope.isCurrentStatus = function(status){
			return $scope.currentStatus === status;
		}

		$scope.spaceVisible = function(space){
			if (space.tickets) {
				if (space.tickets.length) {
					if (!$scope.currentStatus && !$scope.currentSpace)
						return true;
					else if (!$scope.currentStatus && $scope.currentSpace) {
						if ($scope.currentSpace === space) return true;
						return false;
					}
					else if (!$scope.currentSpace && $scope.currentStatus) {
						for (var i in space.tickets) {
							var ticket = space.tickets[i];
							if ($scope.currentStatus === ticket.status) return true;
						}
						return false;
					}
					else if ($scope.currentSpace && $scope.currentStatus) {
						if ($scope.currentSpace == space) {
							for (var i in space.tickets) {
								if ($scope.currentStatus === space.tickets[i].status) return true;
							}
						}
						return false;
					}
				}
			}
			return false;
		}

		$scope.statusVisible = function(status){
			if ($scope.currentStatus !== null) {
				if ($scope.currentStatus === status) return true
				else return false
			}
			else return true
		}

		$scope.isUser = function(user_id1, user_id2){
			return user_id1 === user_id2;
		}

		getUserID = function(){
			$http
				.get('/get_user')
				.success(function(user){
					$scope.user_id = user.id;
				});
		}

		getSpaces = function(){
			$http
				.get('/get_spaces')
				.success(function(spaces){
					$scope.spaces = spaces;
					for (var i in spaces) {
						getTickets(spaces[i].id);
					}
				});
		};

		getSpaceIndexByID = function(space_id){
			for (var i in $scope.spaces) {
				if ($scope.spaces[i].id === space_id) return i;
			}
		}

		function getSpaceWikiName(id) {
            for (var i in $scope.spaces) {
                if ($scope.spaces[i]['id'] == id) {
                    return $scope.spaces[i].wiki_name;
                    break;
                }
            }
        }

        function getTicketHref(space_id, t_number) {
        	return 'https://www.assembla.com/spaces/'+getSpaceWikiName(space_id)+'/tickets/'+t_number;
        }

		getTickets = function(space_id){
			$http
				.get('/get_tickets/'+space_id)
				.success(function(tickets){
					var i = getSpaceIndexByID(space_id);
					var new_tickets = [];
					var temp_statuses = $scope.statuses;
					for (var ii in tickets) {
						var ticket = tickets[ii];
						temp_statuses.push(ticket.status);
						if (ticket.assigned_to_id === $scope.user_id) {
							ticket.href = getTicketHref(space_id, ticket.number);
							new_tickets.push(ticket);
						}
					}
					$scope.spaces[i].tickets = new_tickets;
					$scope.statuses = temp_statuses.filter(function(elem, pos) {
					    return temp_statuses.indexOf(elem) == pos;
					});
				});
		}

		getUserID();

		$scope.load = getSpaces;
	});
})();