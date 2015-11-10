define(["d3"], function (d3) {

	function mapConceptData(data) {
		var result;

		if (data.COUNT_VALUE instanceof Array) // multiple rows, each value of each column is in the indexed properties.
		{
			result = data.COUNT_VALUE.map(function (d, i) {
				var datum = {}
				datum.id = (this.CONCEPT_ID|| this.CONCEPT_NAME)[i];
				datum.label = this.CONCEPT_NAME[i];
				datum.value = this.COUNT_VALUE[i];
				return datum;
			}, data);

			result = result.sort(function (a, b) {
				return b.label < a.label ? 1 : -1;
			});
		} else // the dataset is a single value result, so the properties are not arrays.
		{
			result = [
				{
					id: data.CONCEPT_ID,
					label: data.CONCEPT_NAME,
					value: data.COUNT_VALUE
			}];
		}
		return result;
	}

	function mapHistogram(histogramData) {
		// result is an array of arrays, each element in the array is another array containing information about each bar of the histogram.
		var result = new Array();
		var minValue = histogramData.MIN;
		var intervalSize = histogramData.INTERVAL_SIZE;

		histogramData.DATA = normalizeDataframe(histogramData.DATA);
		for (var i = 0; i <= histogramData.INTERVALS; i++) {
			var target = new Object();
			target.x = minValue + 1.0 * i * intervalSize;
			target.dx = intervalSize;
			target.y = histogramData.DATA.COUNT_VALUE[histogramData.DATA.INTERVAL_INDEX.indexOf(i)] || 0;
			result.push(target);
		};

		return result;
	}

	function mapMonthYearDataToSeries(data, options) {
		var defaults = {
			dateField: "x",
			yValue: "y",
			yPercent: "p"
		};

		var options = $.extend({}, defaults, options);

		var series = {};
		series.name = "All Time";
		series.values = [];
		for (var i = 0; i < data[options.dateField].length; i++) {
			var dateInt = data[options.dateField][i];
			series.values.push({
				xValue: new Date(Math.floor(data[options.dateField][i] / 100), (data[options.dateField][i] % 100) - 1, 1),
				yValue: data[options.yValue][i],
				yPercent: data[options.yPercent][i]
			});
		}
		series.values.sort(function (a, b) {
			return a.xValue - b.xValue;
		});

		return [series]; // return series wrapped in an array
	}

	function mapMonthYearDataToSeriesByYear(data, options) {
		// map data in the format yyyymm into a series for each year, and a value for each month index (1-12)
		var defaults = {
			dateField: "x",
			yValue: "y",
			yPercent: "p"
		};

		var options = $.extend({}, defaults, options);

		// this function takes month/year histogram data from Achilles and converts it into a multi-series line plot
		var series = [];
		var seriesMap = {};

		for (var i = 0; i < data[options.dateField].length; i++) {
			var targetSeries = seriesMap[Math.floor(data[options.dateField][i] / 100)];
			if (!targetSeries) {
				targetSeries = {
					name: (Math.floor(data[options.dateField][i] / 100)),
					values: []
				};
				seriesMap[targetSeries.name] = targetSeries;
				series.push(targetSeries);
			}
			targetSeries.values.push({
				xValue: data[options.dateField][i] % 100,
				yValue: data[options.yValue][i],
				yPercent: data[options.yPercent][i]
			});
		}
		series.forEach(function (d) {
			d.values.sort(function (a, b) {
				return a.xValue - b.xValue;
			});
		});
		return series;
	}

	function dataframeToArray(dataframe) {
		// dataframes from R serialize into an obect where each column is an array of values.
		var keys = d3.keys(dataframe);
		var result;
		if (dataframe[keys[0]] instanceof Array) {
			result = dataframe[keys[0]].map(function (d, i) {
				var item = {};
				var container = this;
				keys.forEach(function (p) {
					item[p] = container[p][i];
				});
				return item;
			}, dataframe);
		} else {
			result = [dataframe];
		}
		return result;
	}
	
	function normalizeDataframe(dataframe) {
		// rjson serializes dataframes with 1 row as single element properties.  This function ensures fields are always arrays.
		var keys = d3.keys(dataframe);
		keys.forEach(function (key) {
			if (!(dataframe[key] instanceof Array))
			{
				dataframe[key] = [dataframe[key]];	
			}
		});
		return dataframe;
	}
	
	function buildHierarchyFromJSON(data, threshold, separator) {
		var total = 0;

		var root = {
			"name": "root",
			"children": []
		};

		for (i = 0; i < data.length; i++) {
			total += data[i].count;
		}

		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var parts = item.path.split(separator);
			var currentNode = root;
			for (var j = 0; j < parts.length; j++) {
				var children = currentNode["children"];
				var nodeName = parts[j];
				var childNode;
				if (j + 1 < parts.length) {
					// Not yet at the end of the path; move down the tree.
					var foundChild = false;
					for (var k = 0; k < children.length; k++) {
						if (children[k]["name"] == nodeName) {
							childNode = children[k];
							foundChild = true;
							break;
						}
					}
					// If we don't already have a child node for this branch, create it.
					if (!foundChild) {
						childNode = {
							"name": nodeName,
							"children": []
						};
						children.push(childNode);
					}
					currentNode = childNode;
				} else {
					// Reached the end of the path; create a leaf node.
					childNode = {
						"name": nodeName,
						"id": item.id,
						"path": item.path,
						"size": item.count,
						"percent": (1.0*item.count)/total,
						"data":  item
					};

					// we only include nodes with sufficient size in the treemap display
					// sufficient size is configurable in the calculation of threshold
					// which is a function of the number of pixels in the treemap display
					if (childNode.percent > threshold) {
						children.push(childNode);
					}
				}
			}
		}
		return root;
	};

	var module = {
		mapHistogram: mapHistogram,
		mapConceptData: mapConceptData,
		mapMonthYearDataToSeries: mapMonthYearDataToSeries,
		mapMonthYearDataToSeriesByYear: mapMonthYearDataToSeriesByYear,
		dataframeToArray: dataframeToArray,
		normalizeDataframe: normalizeDataframe,
		buildHierarchyFromJSON: buildHierarchyFromJSON
	};

	
	return module;
});
