// Performance Trend Chart
const ctx = document.getElementById('curveChart').getContext('2d');
const curveChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [{
      label: 'Overall Performance',
      data: [70, 75, 80, 78, 85, 88, 90, 92],
      fill: true,
      borderColor: '#2D336B',
      backgroundColor: 'rgba(45, 51, 107, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#FFF2F2',
      pointBorderColor: '#2D336B',
      pointRadius: 6,
      borderWidth: 3,
    },
    {
      label: 'Department Average',
      data: [65, 70, 72, 75, 78, 80, 82, 85],
      fill: false,
      borderColor: '#7886C7',
      backgroundColor: 'rgba(120, 134, 199, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#FFF2F2',
      pointBorderColor: '#7886C7',
      pointRadius: 5,
      borderWidth: 2,
      borderDash: [5, 5],
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: { 
          color: '#2D336B',
          font: { size: 14 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 242, 242, 0.9)',
        titleColor: '#2D336B',
        bodyColor: '#2D336B',
        borderColor: '#7886C7',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: { 
          color: '#2D336B',
          font: { size: 12 }
        },
        grid: { 
          color: 'rgba(45, 51, 107, 0.1)'
        }
      },
      y: {
        min: 50,
        max: 100,
        ticks: { 
          color: '#2D336B',
          font: { size: 12 }
        },
        grid: { 
          color: 'rgba(45, 51, 107, 0.1)'
        }
      }
    }
  }
});

// Skill Distribution Chart
const skillCtx = document.getElementById('skillChart').getContext('2d');
const skillChart = new Chart(skillCtx, {
  type: 'doughnut',
  data: {
    labels: ['Machine Operation', 'Quality Control', 'Maintenance', 'Safety', 'Teamwork'],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        '#2D336B',
        '#7886C7',
        '#A9B5DF',
        '#FFF2F2',
        '#D1D9F0'
      ],
      borderColor: '#FFF2F2',
      borderWidth: 3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#2D336B',
          padding: 20,
          font: { size: 12 }
        }
      }
    },
    cutout: '60%'
  }
});

// Department Comparison Chart
const deptCtx = document.getElementById('departmentChart').getContext('2d');
const departmentChart = new Chart(deptCtx, {
  type: 'bar',
  data: {
    labels: ['Production', 'Quality', 'Maintenance', 'Safety', 'Logistics'],
    datasets: [{
      label: 'Performance Score',
      data: [87, 92, 79, 96, 83],
      backgroundColor: [
        '#2D336B',
        '#7886C7',
        '#A9B5DF',
        '#FFF2F2',
        '#D1D9F0'
      ],
      borderColor: '#FFF2F2',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { 
          color: '#2D336B',
          font: { size: 12 }
        },
        grid: { 
          display: false
        }
      },
      y: {
        min: 50,
        max: 100,
        ticks: { 
          color: '#2D336B',
          font: { size: 12 }
        },
        grid: { 
          color: 'rgba(45, 51, 107, 0.1)'
        }
      }
    }
  }
});

// Heatmap data and generation
const performanceData = [
  [80, 85, 70, 90, 95, 92],
  [65, 70, 75, 80, 85, 88],
  [90, 85, 88, 92, 91, 94],
  [100, 95, 98, 97, 99, 100]
];

const skills = ['Machine Operation', 'Quality Control', 'Maintenance', 'Safety'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const heatmap = document.getElementById('heatmap');

// Create header row
heatmap.innerHTML = '<div class="heatmap-header"></div>';
months.forEach(m => {
  const headerCell = document.createElement('div');
  headerCell.className = 'heatmap-header';
  headerCell.textContent = m;
  headerCell.style.backgroundColor = '#2D336B';
  heatmap.appendChild(headerCell);
});

// Create data rows
performanceData.forEach((row, i) => {
  const skillCell = document.createElement('div');
  skillCell.className = 'heatmap-header';
  skillCell.textContent = skills[i];
  skillCell.style.backgroundColor = '#2D336B';
  heatmap.appendChild(skillCell);
  
  row.forEach(value => {
    const cell = document.createElement('div');
    
    // Create gradient based on performance value
    if (value >= 90) {
      cell.style.backgroundColor = '#2D336B';
    } else if (value >= 80) {
      cell.style.backgroundColor = '#7886C7';
    } else if (value >= 70) {
      cell.style.backgroundColor = '#A9B5DF';
    } else {
      cell.style.backgroundColor = '#D1D9F0';
    }
    
    cell.innerHTML = `<span class="heatmap-value">${value}</span>`;
    heatmap.appendChild(cell);
  });
});

// Add interactivity to filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    this.classList.add('active');
    
    // In a real application, this would filter the data
    // For this demo, we'll just show a message
    console.log(`Filtering by: ${this.textContent}`);
  });
});