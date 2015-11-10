requirejs.config({
	baseUrl: 'js',
	packages: [],
	config: {
		text: {
			useXhr: function (url, protocol, hostname, port) {
				return true;
			}
		}
	},
	map: {},
	shim: {
		"bootstrap": {
			"deps": [
				'jquery'
			]
		},
	},
	paths: {
		"css": "requirejs/plugins/css.min",
		"text": "requirejs/plugins/text",
		"jquery": ["//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min", "fallback/jquery-1.1.3.min"],
		"bootstrap": ["//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min", "fallback/bootstrap.min"],
		"knockout": ["//cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min", "fallback/knockout-min"],
		"d3": ["//cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min","fallback/d3.min"],
		"d3_tip": ["//cdnjs.cloudflare.com/ajax/libs/d3-tip/0.6.7/d3-tip", "fallback/d3-tip.min"],
		"ohdsi.chart": "modules/ohdsi.chart",
	}
});

requirejs(['knockout', './app'], function (ko, app, chart) {
	var appModel = new app();
	// todo: load some sample data
	
	ko.applyBindings(appModel);
});
