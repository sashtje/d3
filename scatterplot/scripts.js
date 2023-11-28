async function getJSONData() {
  try {
    const response = await fetch("./cyclist-data.json");

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

async function createChart(data) {}

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
