/**
 * @file charts.js
 * @description Google Charts data visualization.
 *              Shows real 2024 Lok Sabha election data.
 *              Fails silently if Google Charts not loaded.
 * @author VoteGuide India
 * @version 1.0.0
 */

/**
 * @description Loads Google Charts and triggers drawing
 * @returns {void}
 */
/**
 * @description Loads Google Charts and triggers drawing.
 *              Polls until the async loader is ready.
 * @returns {void}
 */
function initGoogleCharts() {
  if (typeof google === 'undefined') {
    /* Charts loader not ready yet — retry in 300ms */
    setTimeout(initGoogleCharts, 300);
    return;
  }
  if (typeof google.charts === 'undefined') {
    setTimeout(initGoogleCharts, 300);
    return;
  }
  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(drawAllCharts);
}

/**
 * @description Renders all chart instances
 * @returns {void}
 */
function drawAllCharts() {
  drawSeatDistributionChart();
  drawVoterTurnoutChart();
}

/**
 * @description Donut chart — 2024 Lok Sabha seat distribution
 * @returns {void}
 */
function drawSeatDistributionChart() {
  const container = document.getElementById('chart-seats');
  if (!container || typeof google === 'undefined') return;
  const data = google.visualization.arrayToDataTable([
    ['Alliance', 'Seats Won'],
    ['NDA (BJP + allies)', 293],
    ['INDIA Alliance', 234],
    ['Others / Independents', 16]
  ]);
  const options = {
    title: '2024 Lok Sabha Results — 543 Total Seats',
    titleTextStyle: {
      fontName: 'Poppins', fontSize: 14, color: '#1A1A2E',
      bold: true
    },
    pieHole: 0.4,
    colors: ['#FF9933', '#138808', '#000080'],
    backgroundColor: 'transparent',
    legend: {
      position: 'bottom',
      textStyle: { fontName: 'Inter', fontSize: 12 }
    },
    chartArea: { width: '90%', height: '72%' }
  };
  const chart = new google.visualization.PieChart(container);
  chart.draw(data, options);
}

/**
 * @description Column chart — phase-wise voter turnout 2024
 * @returns {void}
 */
function drawVoterTurnoutChart() {
  const container = document.getElementById('chart-turnout');
  if (!container || typeof google === 'undefined') return;
  const data = google.visualization.arrayToDataTable([
    ['Phase', 'Voter Turnout %'],
    ['Phase 1\nApr 19', 66.14],
    ['Phase 2\nApr 26', 66.71],
    ['Phase 3\nMay 7',  65.68],
    ['Phase 4\nMay 13', 69.16],
    ['Phase 5\nMay 20', 62.20],
    ['Phase 6\nMay 25', 63.36],
    ['Phase 7\nJun 1',  62.00]
  ]);
  const options = {
    title: '2024 General Election — Voter Turnout by Phase',
    titleTextStyle: {
      fontName: 'Poppins', fontSize: 14, color: '#1A1A2E',
      bold: true
    },
    colors: ['#FF9933'],
    backgroundColor: 'transparent',
    legend: { position: 'none' },
    hAxis: {
      title: 'Election Phase',
      titleTextStyle: { fontName: 'Inter', color: '#6B7280' },
      textStyle: { fontName: 'Inter', fontSize: 11 }
    },
    vAxis: {
      title: 'Turnout %',
      minValue: 55, maxValue: 75,
      titleTextStyle: { fontName: 'Inter', color: '#6B7280' },
      textStyle: { fontName: 'Inter', fontSize: 11 }
    },
    chartArea: { width: '78%', height: '68%' },
    bar: { groupWidth: '60%' }
  };
  const chart = new google.visualization.ColumnChart(container);
  chart.draw(data, options);
}
