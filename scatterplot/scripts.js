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
  const circleRadius = 7;
  const colorSampleSize = 20;

  const dataset = data.map((item) => {
    const [minutes, seconds] = item.Time.split(":");
    const newTime = new Date(1970, 0, 1, 0, minutes, seconds);

    return {
      ...item,
      Time: newTime,
    };
  });

  const tooltip = d3.select(".tooltip");

  const minDate = new Date(d3.min(dataset, (d) => d.Year - 1).toString());
  const maxDate = new Date(d3.max(dataset, (d) => d.Year + 1).toString());

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

  const minTime = d3.min(dataset, (d) => d.Time);
  const maxTime = d3.max(dataset, (d) => d.Time);

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

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", (d) => (d.Doping ? "dot dot_dopping" : "dot"))
    .attr("cx", (d) => xScale(new Date(d.Year.toString())))
    .attr("cy", (d) => yScale(d.Time))
    .attr("r", circleRadius)
    .attr("data-index", (_, i) => i)
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time)
    .on("mouseover", (event, d) => {
      const index = event.target.dataset.index;

      tooltip.transition().duration(100).style("opacity", 0.9);
      tooltip
        .html(
          `
        <div class="tooltip__row">
          <div class="tooltip__place">Place: ${d.Place}</div>
          <div class="tooltip__country">${d.Nationality}</div>
        </div>
        <div class="tooltip__row">
          <div class="tooltip__time">Time: ${data[index].Time}</div>
          <div class="tooltip__year">${data[index].Year}</div>
        </div>
        <div class="tooltip__name">${d.Name}</div>
        <div class="tooltip__doping">${d.Doping}</div>
      `
        )
        .attr("data-year", d.Year);
    })
    .on("mouseout", () => {
      tooltip.transition().duration(100).style("opacity", 0);
    });

  const legend = svg.append("g").attr("id", "legend").attr("class", "legend");

  legendWithoutDoping = legend
    .append("g")
    .attr("class", "legend__item legend__item_withoutDoping")
    .attr("transform", "translate(0, 160)");
  legendWithoutDoping
    .append("rect")
    .attr("width", colorSampleSize)
    .attr("height", colorSampleSize)
    .attr("x", 840);
  legendWithoutDoping
    .append("text")
    .text("No doping")
    .attr("x", 780)
    .attr("y", 14);

  legendWithDoping = legend
    .append("g")
    .attr("class", "legend__item legend__item_withDoping")
    .attr("transform", "translate(0, 190)");
  legendWithDoping
    .append("rect")
    .attr("width", colorSampleSize)
    .attr("height", colorSampleSize)
    .attr("x", 840);
  legendWithDoping
    .append("text")
    .text("With doping")
    .attr("x", 770)
    .attr("y", 14);
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
