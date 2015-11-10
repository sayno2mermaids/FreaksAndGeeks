define(['knockout',
				'd3',
				'jquery',
				'./common',
				'bootstrap',
				'modules/knockout.ohdsi.chart',
				'components/measureTreemap'
], function (ko, d3, $, common) {
	function app() {
		var self = this;

		self.multiSeriesOptions = {
			xFormat: d3.time.format("%m/%Y"),
			tickFormat: d3.time.format("%Y"),
			xValue: "X_CALENDAR_MONTH",
			yValue: "Y_RECORD_COUNT",
			xLabel: "Year",
			yLabel: "# of Records",
			showLegend: true,
			colors: d3.scale.category10()
		}

		self.multiSeries = ko.observable();
		self.boxplot = ko.observable();
		self.treemap = ko.observable();
		
		// startup actions
		$.ajax({
			type: "GET",
			url: "data/dataDensity.json",
			contentType: "application/json; charset=utf-8",
		}).done(function (result) {
			var totalRecords = result.TOTAL_RECORDS;
			// convert yyyymm to date
			totalRecords.X_CALENDAR_MONTH.forEach(function (d, i, ar) {
				ar[i] = new Date(Math.floor(d / 100), (d % 100) - 1, 1)
			});

			// convert data-frame structure to array of objects
			var normalizedTotalRecords = common.dataframeToArray(totalRecords);

			// nest dataframe data into key->values pair																					
			var totalRecordsData = d3.nest()
				.key(function (d) {
					return d.SERIES_NAME;
				})
				.entries(normalizedTotalRecords)
				.map(function (d) {
					return {
						name: d.key,
						values: d.values
					};
				});

			self.multiSeries(totalRecordsData);

			var conceptsData = common.normalizeDataframe(result.CONCEPTS_PER_PERSON);
			var conceptsSeries = [];
			for (i = 0; i < conceptsData.CATEGORY.length; i++) {
				conceptsSeries.push({
					Category: conceptsData.CATEGORY[i],
					min: conceptsData.MIN_VALUE[i],
					max: conceptsData.MAX_VALUE[i],
					median: conceptsData.MEDIAN_VALUE[i],
					LIF: conceptsData.P10_VALUE[i],
					q1: conceptsData.P25_VALUE[i],
					q3: conceptsData.P75_VALUE[i],
					UIF: conceptsData.P90_VALUE[i]
				});
			}

			self.boxplot(conceptsSeries);

		});
		
		$.ajax({
			type: "GET",
			url: "data/overview.csv",
			contentType: "application/json; charset=utf-8",
		}).done(function (result) {
			var rawData = d3.csv.parse(result, function (d) {
				return {
					id : +d.id,
					path: d.category,
					count: +d.count
				}
			});
			
			var treeData = common.buildHierarchyFromJSON(rawData, 0.01, '||');
			console.log('tree data loaded...');
			self.treemap(treeData);
			
		});
	}

	return app;
});