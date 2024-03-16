function init() {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
        let dropdownMenu = d3.select("#selDataset");
        data.names.forEach(sample => {
            dropdownMenu.append("option").text(sample).property("value", sample);
        });

        let initialSample = data.names[0];
        buildCharts(initialSample);
        showMetadata(initialSample);
    });
}

function buildCharts(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
        let selectedSample = data.samples.find(obj => obj.id === sample);

        let top10OTUs = selectedSample.otu_ids.slice(0, 10);
        let top10Values = selectedSample.sample_values.slice(0, 10);
        let top10Labels = selectedSample.otu_labels.slice(0, 10);

        let barData = [{
            x: top10Values.reverse(),
            y: top10OTUs.map(otuID => `OTU ${otuID}`).reverse(),
            text: top10Labels.reverse(),
            type: "bar",
            orientation: "h"
        }];

        let barLayout = {
            title: "Top 10 OTUs",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        Plotly.newPlot("bar", barData, barLayout);

        let bubbleData = [{
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            text: selectedSample.otu_labels,
            mode: "markers",
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids,
                colorscale: "Earth"
            }
        }];

        let bubbleLayout = {
            title: "OTU ID vs. Sample Values",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

function showMetadata(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
        let selectedMetadata = data.metadata.find(obj => obj.id == sample);
        let metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    });
}

function optionChanged(newSample) {
    buildCharts(newSample);
    showMetadata(newSample);
}

init();