async function getJSONData() {
  try {
    const response = await fetch("./GDP-data.json");

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

async function createChart(data) {
  const w = 900;
  const h = 500;
  const padding = 40;
  const dataset = data.data;

  const minDate = new Date(data.from_date);
  const maxDate = new Date(data.to_date);

  const xScale = d3
    .scaleLinear()
    .domain([minDate, maxDate])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding]);

  const svg = d3
    .select(".barchart__wrapper")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const xAxis = d3.axisBottom().scale(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (h - padding) + ")")
    .call(xAxis.tickFormat(d3.timeFormat("%Y")));

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);
}

async function main() {
  const data = await getJSONData();

  if (!data) {
    const errorText = "Failed to receive data";

    const barchartWrapper =
      document.getElementsByClassName("barchart__wrapper")[0];
    if (!barchartWrapper) {
      console.error(errorText);
    } else {
      const errorElement = document.createElement("div");
      errorElement.className = "barchart__error";
      errorElement.innerText = errorText;

      barchartWrapper.append(errorElement);
    }

    return;
  }

  await createChart(data);
  console.log("BarChart is ready!");
}

main();
