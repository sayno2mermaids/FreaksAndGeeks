define(['jquery', 'knockout', './ohdsi.chart'], function ($, ko, ohdsiChart) {
		ko.bindingHandlers.lineChart = {
			init: function (element, valueAccessor) {
				return { controlsDescendantBindings: true };
			},
			update: function (element, valueAccessor, allBindings) {
				var chartData = ko.utils.unwrapObservable(valueAccessor());
				var chartOptions = ko.utils.unwrapObservable(allBindings.get('chartOptions')) || {};
				var chartResolution = allBindings.get('chartResolution');
				var lineChart = new ohdsiChart.line();

				d3.select(element).selectAll('svg').remove();
				lineChart.render(chartData, element, chartResolution.width, chartResolution.height, chartOptions);
				
			}
		};
	
		ko.bindingHandlers.boxplot = {
			init: function (element, valueAccessor) {
				return { controlsDescendantBindings: true };
			},
			update: function (element, valueAccessor, allBindings) {
				var chartData = ko.utils.unwrapObservable(valueAccessor());
				var chartOptions = ko.utils.unwrapObservable(allBindings.get('chartOptions')) || {};
				var chartResolution = allBindings.get('chartResolution');
				var boxplot = new ohdsiChart.boxplot();

				d3.select(element).selectAll('svg').remove();
				boxplot.render(chartData, element, chartResolution.width, chartResolution.height, chartOptions);
				
			}
		};
	
		ko.bindingHandlers.treemap = {
			init: function (element, valueAccessor) {
				return { controlsDescendantBindings: true };
			},
			update: function (element, valueAccessor, allBindings) {
				var chartData = ko.utils.unwrapObservable(valueAccessor());
				var chartOptions = ko.utils.unwrapObservable(allBindings.get('chartOptions')) || {};
				var chartResolution = allBindings.get('chartResolution');
				var treemap = new ohdsiChart.treemap();

				d3.select(element).selectAll('svg').remove();
				treemap.render(chartData, element, chartResolution.width, chartResolution.height, chartOptions);
			}
		};
	
		ko.bindingHandlers.zoomSunburst = {
			init: function (element, valueAccessor) {
				return { controlsDescendantBindings: true };
			},
			update: function (element, valueAccessor, allBindings) {
				var chartData = ko.utils.unwrapObservable(valueAccessor());
				var chartOptions = ko.utils.unwrapObservable(allBindings.get('chartOptions')) || {};
				var chartResolution = allBindings.get('chartResolution');
				var treemap = new ohdsiChart.zoomSunburst();

				d3.select(element).selectAll('svg').remove();
				treemap.render(chartData, element, chartResolution.width, chartResolution.height, chartOptions);
			}
		};	
	
	});
