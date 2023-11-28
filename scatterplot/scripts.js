async function getJSONData() {
  try {
    const response = await fetch("./cyclist-data.json");

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

async function createChart(data) {
  const svg = d3.select(".scatterplot__chart");
  const w = svg.attr("width");
  const h = svg.attr("height");
  const padding = 40;

  const minDate = new Date(d3.min(data, (d) => d.Year - 1).toString());
  const maxDate = new Date(d3.max(data, (d) => d.Year + 1).toString());

  const xScale = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .range([padding, w - padding]);
  const xAxis = d3.axisBottom(xScale);
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (h - padding) + ")")
    .call(xAxis);

  data.forEach((item) => {
    const [minutes, seconds] = item.Time.split(":");
    item.Time = new Date(1970, 0, 1, 0, minutes, seconds);
  });
  const minTime = d3.min(data, (d) => d.Time);
  const maxTime = d3.max(data, (d) => d.Time);

  const yScale = d3
    .scaleTime()
    .domain([minTime, maxTime])
    .range([padding, h - padding]);
  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis.tickFormat(d3.timeFormat("%M:%S")));
}

async function main() {
  const data = await getJSONData();

  if (!data) {
    const errorText = "Failed to receive data";

    const scatterplotWrapper = document.getElementsByClassName(
      "scatterplot__wrapper"
    )[0];
    if (!scatterplotWrapper) {
      console.error(errorText);
    } else {
      d3.select(".scatterplot__chart")
        .append("text")
        .text(errorText)
        .attr("class", "scatterplot__error")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle");
    }

    return;
  }

  await createChart(data);
  console.log("Scatterplot is ready!");
}

main();
