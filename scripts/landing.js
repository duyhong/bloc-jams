 var animatePoints = function() {

/*     var points = document.getElementsByClassName('point');
     for(var i=0; i < points.length; i++) {
         points[i].style.opacity = 1;
         points[i].style.transform = "scaleX(1) translateY(0)";
         points[i].style.msTransform = "scaleX(1) translateY(0)";
         points[i].style.WebkitTransform = "scaleX(1) translateY(0)";         
     }

*/
     var revealPoint = function(point) {
         point.style.opacity = 1;
         point.style.transform = "scaleX(1) translateY(0)";
         point.style.msTransform = "scaleX(1) translateY(0)";
         point.style.WebkitTransform = "scaleX(1) translateY(0)";
     };
     
     var points = document.getElementsByClassName('point');
     
     for(var i=0; i < points.length; i++) {
         revealPoint(points[i])       
     }
 };