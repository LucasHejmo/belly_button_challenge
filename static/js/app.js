// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.find(meta => meta.id.toString() === sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.find(s => s.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    const otuIds = result.otu_ids;
    const sampleValues = result.sample_values;
    const otuLabels = result.otu_labels;

    // Build a Bubble Chart
    const bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    }];

    const bubbleLayout = {
      title: "OTU Distribution",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 },
      hovermode: "closest"
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    const barLayout = {
      title: "Top 10 OTUs",
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
      selector.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
