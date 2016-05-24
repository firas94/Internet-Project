(function(){



  'use strict';
var module = angular.module('app', ['onsen','angularTreeview']);
module.controller('DetailController', function($scope, $mqtt) {

$.ajax({
         type: "GET",
         url: "http://localhost:5984/prolist/ID:10/?jsonp=callback",
         dataType : 'jsonp',
         async: false,
         contentType: "application/json",
         jsonpCallback: 'callback',

         success : function(data){
              console.log(data.title); 
              // assigning scope variables inside the user interface
              $scope.$apply(function() {
              $scope.roleList = [data];
              });
          }
      });
$scope.printParent = function ($event) {
          var root = $scope;

          var currentScope = angular.element($event.target).scope();
          var clicked = currentScope.node.title;
          console.log('selected Node details: ', currentScope.node);
          currentScope = currentScope.$parent;
          console.log('parents::')
          $scope.parentone ="";
          while(currentScope.$id !== root.$id) {
              console.log(currentScope.node);
              $scope.parentone = currentScope.node.title + "/" + $scope.parentone ;
              currentScope = currentScope.$parent;
          }
          $scope.parentone = "/" + $scope.parentone + clicked;
          $scope.topic = $scope.parentone;
      }

$scope.doSubscribe = function() {
console.log($scope.topic);
$mqtt.subscribe($scope.topic);
};

$scope.doPublish = function() {
console.log($scope.topic);
console.log($scope.message);
$mqtt.publish($scope.topic,$scope.message);
//$scope.question = $scope.message;
};


$scope.submit = function(){
var grade= "False";

if($scope.truefalse=="T"){
grade="Correct";
}
window.alert("your answer is: " + grade);
};

});



module.factory('$mqtt', function() {
var wsbroker = "m12.cloudmqtt.com"; //mqtt websocket enabled broker
var wsport = 37554 // port for above
var client = new Paho.MQTT.Client(wsbroker, wsport,

"myclientid_" + parseInt(Math.random() * 100, 10));
client.onConnectionLost = function (responseObject) {
console.log("connection lost: " + responseObject.errorMessage);
};
client.onMessageArrived = function (message) {
console.log(message.destinationName, ' -- ', message.payloadString);
var appElement = document.querySelector('[ng-app=app]');
    var $scope = angular.element(appElement).scope();
    $scope = $scope.$$childHead;
    $scope.$apply(function() {
        if (message.destinationName == "/Dubai/Dubai_Mall")
        $scope.question1 = message.destinationName + ": " + message.payloadString;
        else
        $scope.question2 = message.destinationName + ": " + message.payloadString;
        $scope.question1 = "/Dubai/Dubai_Mall: Empty";
    });
};
var options = {
timeout: 3,
useSSL: true,
userName: "vjtovbxj",
password: "_3au3PZ_zfNK",
onSuccess: function () {
console.log("mqtt connected");
},
onFailure: function (message) {
console.log("Connection failed: " + message.errorMessage);
}
};
// will connect only once
client.connect(options);
return{
subscribe : function(topic){
client.subscribe(topic, {qos: 1});
},
publish: function(topic, msg) {
var message = new Paho.MQTT.Message
(msg);
message.destinationName = topic;
client.send(message);
}}
});
})();




(function(l){l.module("angularTreeview",[]).directive("treeModel",function($compile){return{restrict:"A",link:function(a,g,c){var e=c.treeModel,h=c.nodeLabel||"label",d=c.nodeChildren||"children",k='<ul><li data-ng-repeat="node in '+e+'"><i class="collapsed" data-ng-show="node.'+d+'.length && node.collapsed" data-ng-click="selectNodeHead(node, $event)"></i><i class="expanded" data-ng-show="node.'+d+'.length && !node.collapsed" data-ng-click="selectNodeHead(node, $event)"></i><i class="normal" data-ng-hide="node.'+
d+'.length"></i> <span data-ng-class="node.selected" data-ng-click="selectNodeLabel(node, $event)">{{node.'+h+'}}</span><div data-ng-hide="node.collapsed" data-tree-model="node.'+d+'" data-node-id='+(c.nodeId||"id")+" data-node-label="+h+" data-node-children="+d+"></div></li></ul>";e&&e.length&&(c.angularTreeview?(a.$watch(e,function(m,b){g.empty().html($compile(k)(a))},!1),a.selectNodeHead=a.selectNodeHead||function(a,b){b.stopPropagation&&b.stopPropagation();b.preventDefault&&b.preventDefault();b.cancelBubble=
!0;b.returnValue=!1;a.collapsed=!a.collapsed},a.selectNodeLabel=a.selectNodeLabel||function(c,b){b.stopPropagation&&b.stopPropagation();b.preventDefault&&b.preventDefault();b.cancelBubble=!0;b.returnValue=!1;a.currentNode&&a.currentNode.selected&&(a.currentNode.selected=void 0);c.selected="selected";a.currentNode=c}):g.html($compile(k)(a)))}}})})(angular);
