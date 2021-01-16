var apiKey = "A6zVYRDws9GrZv9Zeqya";

/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
function unpack(rows, index) {
    return rows.map(function(row) {
        return row[index];
    });
}
$(document).ready(function() {
    buildPlot();
});

// function tickSubmit() {
//     d3.event.preventDefault();
//     var stockTick = d3.select("#stockInput").node().value;
//     console.log(stockTick);
//     d3.select("#stockInput").node().value = "";
//     getMonthlyData(stockTick);


function buildTable(dates, adjopen, adjhigh, adjlow, adjclose, volume) {
    var table = d3.select("#summary-table");
    var tbody = table.select("tbody");
    var trow;
    for (var i = 0; i < 12; i++) {
        trow = tbody.append("tr");
        trow.append("td").text(dates[i]);
        trow.append("td").text(adjopen[i]);
        trow.append("td").text(adjhigh[i]);
        trow.append("td").text(adjlow[i]);
        trow.append("td").text(adjclose[i]);
        trow.append("td").text(volume[i]);
    }
}

function buildPlot() {
    var url = `https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json?start_date=2017-01-01&end_date=2018-11-22&api_key=${apiKey}`;

    d3.json(url).then(function(data) {
        console.log(data)
        var rows = data.dataset.data;
        var dates = unpack(rows, 0);
        var adjclose = unpack(rows, 11);
        var adjhigh = unpack(rows, 9);
        var adjlow = unpack(rows, 10);
        var adjopen = unpack(rows, 8);
        var volume = unpack(rows, 12);
        var startDate = data.dataset.start_date;
        var endDate = data.dataset.end_date;

        buildTable(dates, adjopen, adjhigh, adjlow, adjclose, volume)

        // Closing Scatter Line Trace
        var trace1 = {
            type: "scatter",
            mode: "lines",
            // name: `${ticker} High`,
            x: unpack(rows, 0),
            y: unpack(rows, 2),
            line: { color: '#17BECF' }
        }


        // Candlestick Trace
        var trace2 = {
            type: "candlestick",
            x: dates,
            high: adjhigh,
            low: adjlow,
            open: adjopen,
            close: adjclose,
            volume: volume,
            // cutomise colors
            increasing: { line: { color: 'black' } },
            decreasing: { line: { color: 'red' } },

            type: 'candlestick',
            xaxis: 'x',
            yaxis: 'y'

        };

        var data = [trace1, trace2];

        var layout = {
            // title: `${stock} closing prices`,
            xaxis: {
                range: [startDate, endDate],
                type: "date"
            },
            yaxis: {
                autorange: true,
                type: "linear"
            },
            showlegend: false
        };

        Plotly.newPlot("plot", data, layout);

    });
}