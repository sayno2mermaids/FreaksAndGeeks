define(['knockout', 'text!./measureTreemap.html', 'modules/knockout.ohdsi.chart'], function (ko, template) {

	function dqTreemapViewModel(params) {
		var self = this;
		var format_comma = d3.format(',');
		
		self.data = params.data;
		self.chartOptions = {
			getsizevalue: function (node) {
				return node.size;
			},
			getcolorvalue: function (node) {
				return node.id;
			},
			getcontent: function (node) {
				var result = '',
					steps = node.path.split('||'),
					i = steps.length - 1;
				result += '<div class="pathleaf">' + steps[i] + '</div>';
				result += '<div class="pathleafstat">Number of People: ' + format_comma(node.size) + '</div>';
				return result;
			},
			gettitle: function (node) {
				var title = '',
					steps = node.path.split('||');
				for (i = 0; i < steps.length - 1; i++) {
					title += ' <div class="pathstep">' + Array(i + 1).join('&nbsp;&nbsp') + steps[i] + ' </div>';
				}
				return title;
			}
		}
	};

	var component = {
		viewModel: dqTreemapViewModel,
		template: template
	};

	ko.components.register('dqcdm-treemap', component);

	// return compoonent definition
	return component;

});