angular.module("svgGraph", []).directive("linearGraph", [function(){
  const
  UPU = 10.0; // units-per-unit - inner multiplier for viewBox (plot) units per data unit

  function Rect(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  Rect.prototype = {
    get maxX(){
      return this.x + this.width;
    },
    get maxY(){
      return this.y + this.height;
    },
    toString: function(){
      return [this.x, this.y, this.width, this.height].join(" ");
    }
  }
  Rect.fromRange = function(minX, maxX, minY, maxY){
    return new Rect(minX, minY, maxX - minX, maxY - minY);
  }

  function LinearGraphController($scope){
    this.bounds = new Rect(0, 0, 1, 1);
    this.unit = {x: 1, y: 1};
    this.viewBox = new Rect(0, 0, 1, 1);
    this.points = [];
    
    var updater = function(newValue){
      this.update($scope.seriesX, $scope.seriesY);
    }.bind(this);
    
    $scope.$watchCollection('seriesX', updater);
    $scope.$watchCollection('seriesY', updater);
  }
  LinearGraphController.prototype = {
    update: function(seriesX, seriesY){
      this.bounds = this.computeDataBounds(seriesX, seriesY);
      this.unit = {
          x: this.computeOptimalUnit(this.bounds.x, this.bounds.maxX),
          y: this.computeOptimalUnit(this.bounds.y, this.bounds.maxY)
      }
      var rangeX, rangeY;
      rangeX = this.computeScaledRange(this.bounds.x, this.bounds.maxX, this.unit.x);
      rangeY = this.computeScaledRange(this.bounds.y, this.bounds.maxY, this.unit.y);
      rangeX = [-2.0, 2.0];
      rangeY = [-1.0, 7.0];
      this.ticksX = [-1.0, 1.0];
      this.ticksY = [-1.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0];
      this.viewBox = this.computeViewBox(rangeX, rangeY);
      this.points = this.computePoints(seriesX, seriesY);
    },
    computeDataBounds: function(seriesX, seriesY){
      var minX = Math.min.apply(null, seriesX);  
      var maxX = Math.max.apply(null, seriesX);
      var minY = Math.min.apply(null, seriesY);
      var maxY = Math.max.apply(null, seriesY);      
      return Rect.fromRange(minX, maxX, minY, maxY);
    },
    computeOptimalUnit: function(min, max){
      return 1.0;
    },
    computeScaledRange: function(min, max, unit){
      return [-1, 1];
    },
    computeViewBox: function(rangeX, rangeY){
      var topLeft = this.computePoint(rangeX[0],rangeY[1]);
      var bottomRight = this.computePoint(rangeX[1],rangeY[0]);
      return Rect.fromRange(topLeft.x, bottomRight.x, topLeft.y, bottomRight.y);
    },
    computePoints: function(seriesX, seriesY){
      return [{x:-15,y:-70},{x:-10,y:-35},{x:-5,y:-10},{x:0,y:5},{x:5,y:10},{x:10,y:5},{x:15,y:-10}];
    },
    computePoint: function(x, y){
      return {
        x: x * 10,
        y: -y * 10
      };
    }
  };
  return {
    templateUrl: "/linear-graph.html",
    controller: ["$scope", LinearGraphController],
    scope: {
      seriesX: "=",
      seriesY: "="
    },
    restrict: "E",
    controllerAs: "graph",
    bindToController: false,
    link: function($scope, $element, $attrs){}
  };
}]).filter('svgPath', function(){
  return function(points){
    var pathString = "M-" + points[0].x + "-" + points[0].y;
    for (var i = 1; i < points.length; i++){
      pathString += "L-" + points[i].x + "-" + points[i].y;
    }
    return pathString;
  };
})
