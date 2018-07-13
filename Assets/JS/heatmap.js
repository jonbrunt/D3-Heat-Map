// main function of program, using D3 to create heat map
function main(dataSet) {
  // months used in tooltip and y axis label
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const width = 1300; // svg width
  const height = 700; // svg height
  const padding = 100; // padding for aesthetics
  const barWidth = (width - padding * 2) / 263; // data bar width
  const barHeight = (height - padding * 2.5) / 12; // data bar height
  // colors used to represent temp variance in color scale created below
  const colorBand = [
    "#053061",
    "#2166ac",
    "#4393c3",
    "#92c5de",
    "#d1e5f0",
    "#f7f7f7",
    "#fddbc7",
    "#f4a582",
    "#d6604d",
    "#b2182b",
    "#67001f"
  ];
  const varianceExtent = d3.extent(dataSet, d => d.variance);
  // creates x scale based on start and end year of data
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataSet, d => d.year))
    .range([padding * 1.5, width - padding / 2]); // accounts for padding
  // creates y scale
  const yScale = d3
    .scaleTime()
    .domain([12, 0])
    .range([height - padding, padding * 1.5]); // accounts for padding
  // creates color scale based on temperature variance in data
  const colorScale = d3
    .scaleQuantile()
    .domain(varianceExtent)
    .range(colorBand);
  // sets up x axis
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.format("d")) // used to prevent commas in numerical labels
    .tickSizeOuter(0);
  // sets up y axis
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat("") // removes D3 generated tick labels
    .tickSize(2);
  // appends svg with predetermined attributes to #main div
  const svg = d3
    .select("#main")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    // adds responsive negative margin to center svg based on CSS left: 50%
    .style("margin-left", `${-width / 2}px`)
    .classed("svg", true);
  // appends svg rectangles for data points to svg
  const rectangles = svg
    .selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .classed("bars", true)
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month - 1))
    .attr("width", barWidth)
    .attr("height", barHeight)
    .style("fill", d => colorScale(d.variance));
  // calls and appropriately places x axis
  svg
    .append("g")
    // translation to move axis down
    .attr("transform", `translate(0, ${height - padding})`)
    .classed("info", true)
    .call(xAxis);
  // calls and appropriately places y axis
  svg
    .append("g")
    // translation to move axis to the right
    .attr("transform", `translate(${padding * 1.5}, 0)`)
    .classed("info", true)
    .call(yAxis);
  // title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", padding / 2)
    .classed("info", true)
    .style("font-size", "2em")
    .style("text-anchor", "middle")
    .text("Global Temperature Variance By Month, 1753 - 2015");
  // subtitle
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", padding / 2 + 25)
    .classed("info", true)
    .style("font-size", "1em")
    .style("text-anchor", "middle")
    .text(
      "temperature variance relative to Jan 1951 - Dec 1980 average, reported in degrees Celsius"
    );
  // subtitle
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", padding / 2 + 50)
    .classed("info", true)
    .style("font-size", "1em")
    .style("text-anchor", "middle")
    .text("average absolute temperature(C): 8.66 +/- 0.07");
  // x axis label
  svg
    .append("text")
    .attr("x", width / 3.33)
    .attr("y", height - padding / 2.2)
    .classed("info", true)
    .style("font-size", "1.5em")
    .style("text-anchor", "middle")
    .text("Year");
  // custom tick labels
  svg
    .selectAll()
    .data(months)
    .enter()
    .append("text")
    .attr("x", padding / 1.5)
    .attr("y", (d, i) => padding * 1.5 + barHeight * 0.6 + i * barHeight)
    .classed("info", true)
    .style("text-anchor", "start")
    .text(d => d);
  // graph color legend
  const varianceScale = d3
    .scaleLinear()
    .domain(varianceExtent)
    .range([width * 0.6, width * 0.6 + colorBand.length * (barHeight * 0.75)]);
  const legendAxis = d3
    .axisBottom(varianceScale)
    .tickFormat(d3.format(".2f"))
    .tickValues([varianceExtent[0], -5.5, -4, -2, 0, 2, 4, varianceExtent[1]]);
  // generates data color legend rectangles
  svg
    .selectAll()
    .data(colorBand)
    .enter()
    .append("rect")
    .attr("x", (d, i) => width * 0.6 + i * (barHeight * 0.75))
    .attr("y", height - padding * 0.65)
    .attr("width", barHeight * 0.75)
    .attr("height", barHeight * 0.5)
    .style("fill", (d, i) => colorBand[i])
    .style("stroke", "#000");
  // calls and appropriately places color legend axis
  svg
    .append("g")
    // translation to move axis down
    .attr(
      "transform",
      `translate(-0.5, ${height - padding * 0.65 + barHeight * 0.5})`
    )
    .classed("info", true)
    .call(legendAxis);
  // footer text
  svg
    .append("text")
    .attr("x", width / 3.33)
    .attr("y", height - padding / 6)
    .classed("info", true)
    .style("font-size", "0.8em")
    .style("letter-spacing", "0.5px")
    .style("text-anchor", "middle")
    .text(
      `Design & Development By Jonathan M. Brunt | ${new Date().getFullYear()} | Data Courtesy of FCC`
    );
  // tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .classed("tooltip", true);
  // reveals tooltip data for rectangles
  function tooltipOn(d) {
    d3.event.preventDefault();
    tooltip
      .style("left", `${d3.event.x + 10}px`)
      .style("top", `${d3.event.y}px`)
      .style("opacity", "0.95").html(`
        <p>Year:&nbsp&nbsp${d.year}</p>
        <p>Month:&nbsp&nbsp${months[d.month - 1]}</p>
        <p>Variance:&nbsp&nbsp${d.variance}</p>
      `);
  }
  // hides tooltip data display
  function tooltipOff() {
    d3.event.preventDefault();
    tooltip.style("opacity", "0");
  }
  // tooltip activation/deactivation
  rectangles
    .on("mousemove", tooltipOn)
    .on("touchstart", tooltipOn)
    .on("mouseout", tooltipOff)
    .on("touchend", tooltipOff);
}
// AJAX
const makeRequest = async () => {
  const url =
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  let dataSet = [];
  await $.getJSON(url, results => {
    dataSet = results.monthlyVariance;
  });
  main(dataSet); // calls main function passing in data
};
// initialization on page load
document.addEventListener("DOMContentLoaded", makeRequest());
