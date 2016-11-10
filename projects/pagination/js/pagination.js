angular.module("pagination", []).component("pagination", 
	{
	templateUrl: "/pagination.html",
	controller: ['$scope', function($scope){
		$scope.pageItems = [{
				type: 'arrow',
				value: -1,
				disabled: false
			},{
				type: 'number',
				value: 1,
				active: false
			},{
				type: 'dots',
				disabled: true
			},{
				type: 'number',
				value: 9,
				active: false
			},{
				type: 'number',
				value: 10,
				active: true
			},{
				type: 'number',
				value: 11,
				active: false
			},{
				type: 'dots',
				disabled: true
			},{
				type: 'number',
				value: 15,
				active: false
			},{
				type: 'arrow',
				value: 1,
				disabled: false
			}
		];
	
		this.createPage = function(type, value, active, disabled){
			var page = {
				type: type
			};
			switch(type) {
				case "arrow": 
					page.value = value;
					page.disabled = disabled;
					break;
				case "number":
					page.value = value;
					page.active = active;
					break;
				case "dots":
					page.disabled = disabled;

			}
			return page;
		};

		this.createPages = function(){
			var completedArray = [];
		     completedArray.push(this.createPage("arrow", -1, false, this.state.current == 1));
		     if (this.state.current - 1 < 4){
			 for(var i = 1; i <= 3; i++){
			     completedArray.push(this.createPage("number", i, false, false));
			 }
		     }else{
			 completedArray.push(this.createPage("number", 1, false, false));
			 completedArray.push(this.createPage("dots", null, false, true));
			 completedArray.push(this.createPage("number", this.state.current - 1, false, false));
		     }
		     completedArray.push(this.createPage("number", this.state.current, true, false));
		     if (this.state.last - this.state.current < 4){
			 for(var j = this.state.current + 1; j <= this.state.last; j++){
			     completedArray.push(this.createPage("number", j, false, false));
			 }
		     }else{
			 completedArray.push(this.createPage("number", this.state.current + 1, false, false));
			 completedArray.push(this.createPage("dots", null, false, true));
			 completedArray.push(this.createPage("number", this.state.last, false, false));
		     }
		     completedArray.push(this.createPage("arrow", 1, false, this.state.current == this.state.last));
		     return completedArray;
    	}
    }],

	bindings:{
		state: "="
	},
	
	controllerAs: "$ctrl"
});