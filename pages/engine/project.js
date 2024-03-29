
window.meanEngine.set('api', {
	protocol:	"http",
	hostname:	"fleetwit.dev",
	port:		2000
});

window.meanEngine.set('app', angular.module('main', []));

window.meanEngine.get('app').run(['$rootScope', function($rootScope) {
	$rootScope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else {
			this.$apply(fn);
		}
	};
}]);

window.meanEngine.get('app').directive('angularSelect', function($compile) {
	var link = function($scope, element, attrs, ngModel) {
		console.log("angularSelect",element, ngModel);
		/*
		$scope.$watch("ngListValue", function() {
			console.log("ngListValue",$scope.ngListValue);
		});*/
	}
	
	return {
		restrict: 		'A',
		require: 		'?ngModel',
		compile: function (tElement, tAttrs, transclude) {
			tElement.selectpicker();
			return function (scope, element, attrs, ngModel) {
				ngModel.$render = function() {
					element.val(ngModel.$viewValue || '').selectpicker('render');
				};
				ngModel.$viewValue = element.val();
			};
		}
	};
});


window.meanEngine.service("api", function() {
	return {
		apicall:	function(options) {
			/*
			method,
			params
			*/
			options = $.extend({
				method:		"",
				data:		{},
				callback:	function(data) {},
				onFail:		function(msg) {console.log(msg);}
			},options);
			
			var split 	= options.method.split(".");
			var api		= {
				endpoint:	split[0],
				method:		split[1]
			};
			
			console.log("JSONP :: "+api.endpoint+"/"+api.method);
			//console.info("Parameters: ", options.data);
			
			//console.log("url:",window.meanEngine.get('api').protocol+"://"+window.meanEngine.get('api').hostname+':'+window.meanEngine.get('api').port+'/'+api.endpoint+"/"+api.method+"/jsonp");
			
			$.ajax({
				url: 		window.meanEngine.get('api').protocol+"://"+window.meanEngine.get('api').hostname+':'+window.meanEngine.get('api').port+'/api/'+api.endpoint+"/"+api.method+"/jsonp",		// static url for the API calls
				dataType: 	'jsonp',
				type:		"POST",
				data:		options.data,
				success: 	function(data){
					//console.log("response",data);
					// check for error
					if (data.error) {
						if (data.error && data.error.message) {
							options.onFail(data.error.message);
							if (data.invalid_token) {
								$("#modal-disconnected").modal({backdrop:'static'}).modal('show');
							}
							return false;
						} else {
							options.onFail("Unknown error loading the data");
							return false;
						}
					}
					options.callback(data);
				//console.groupEnd();
				},
				error: function(jqXHR, data, errorThrown) {
					options.onFail("Response Format Error");
				//console.groupEnd();
				}
			});
			
		},
		
		getParams:		function() {
			var urlParams;
			var match,
			pl     = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
			query  = window.location.search.substring(1);
		
			urlParams = {};
			while (match = search.exec(query))
			urlParams[decode(match[1])] = decode(match[2]);
			return urlParams;
		},
		
		cookie:		function(name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			} else{
				var expires = "";
			}
			
			document.cookie = name+"="+value+expires+"; path=/;"; //  domain=.example.com
		},
		
		getCookie:	function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		
		location:		function(page) {
			//console.trace();
			document.location = page;
		},
		
		refresh:		function(page) {
			document.location = document.location;
		},
		
		refresh:		function(page) {
			document.location = document.location;
		},
		
		attributes: function(el, deep) {
			var attributes = {};
		
			$.each($(el)[0].attributes, function( index, attr ) {
				attributes[ attr.name ] = attr.value;
			} );
			
			if (!deep) {
				return attributes;
			} else {
				var i;
				var j;
				var output = {};
				for (i in attributes) {
					var obj = i.split('-');
					var pointer = output;
					for (j=0;j<obj.length;j++) {
						if (!pointer[obj[j]]) {
							pointer[obj[j]] = (j==obj.length-1)?attributes[i]:{};
						}
						pointer = pointer[obj[j]];
					}
				}
				return output;
			}
		},
		
		parse:	function(str, data) {
			var label;
			
			for (label in data) {
				str = str.replaceAll('%'+label+'%', data[label]);
			}
			
			return str;
		},
		
		nth:	function(number) {
			number 		= number*1;
			var str 	= number.toString();
			var end		= str.substr(-1,1)*1;
			
		//console.log("nth("+number+")",end);
			
			var suffix = "th";
			
			switch (end) {
				case 1:
					suffix = "st";
				break;
				case 2:
					suffix = "nd";
				break;
				case 3:
					suffix = "rd";
				break;
				case 4:
				default:
					suffix = "th";
				break;
			}
			
			// Exceptions
			switch (number) {
				case 11:
				case 12:
				case 13:
				break;
			}
			
			return str+suffix;
		}
	}
});