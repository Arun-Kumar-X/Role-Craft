// Worker Performance JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePerformance();
    setupEventListeners();
    loadPerformanceData();
    initializeCharts();
});

let performanceData = {};
let currentMetric = 'overall';

function initializePerformance() {
    console.log('Worker Performance initialized');
}

function setupEventListeners() {
    // Time range filter
    const timeRange = document.getElementById('timeRange');
    timeRange.addEventListener('change', function() {
        loadPerformanceData(this.value);
    });

    // Export report
    const exportBtn = document.getElementById('exportReport');
    exportBtn.addEventListener('click', exportPerformanceReport);

    // View options
    const viewOptions = document.querySelectorAll('.view-option');
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            viewOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentMetric = this.dataset.metric;
            updateRankings();
        });
    });

    // Worker modal
    const closeModal = document.getElementById('closeWorkerModal');
    const workerModal = document.getElementById('workerModal');
    
    closeModal.addEventListener('click', () => workerModal.classList.remove('active'));
    workerModal.addEventListener('click', (e) => {
        if (e.target === workerModal) {
            workerModal.classList.remove('active');
        }
    });
}

function loadPerformanceData(timeRange = '30') {
    // Simulate API call
    const sampleData = {
        workers: [
            {
                id: 1,
                name: "John Doe",
                role: "Senior Developer",
                initials: "JD",
                overallScore: 95,
                efficiency: 92,
                quality: 96,
                productivity: 97,
                tasksCompleted: 24,
                avgCompletionTime: "12.3h",
                onTimeRate: 98,
                satisfaction: 4.8,
                skills: {
                    "JavaScript": 95,
                    "React": 92,
                    "Node.js": 88,
                    "Database": 85,
                    "Testing": 90
                }
            },
            {
                id: 2,
                name: "Sarah Wilson",
                role: "UI/UX Designer",
                initials: "SW",
                overallScore: 88,
                efficiency: 85,
                quality: 92,
                productivity: 87,
                tasksCompleted: 18,
                avgCompletionTime: "14.2h",
                onTimeRate: 94,
                satisfaction: 4.6,
                skills: {
                    "Figma": 95,
                    "Adobe XD": 90,
                    "Prototyping": 88,
                    "User Research": 85,
                    "Design System": 92
                }
            },
            {
                id: 3,
                name: "Mike Johnson",
                role: "QA Engineer",
                initials: "MJ",
                overallScore: 82,
                efficiency: 85,
                quality: 95,
                productivity: 78,
                tasksCompleted: 32,
                avgCompletionTime: "8.7h",
                onTimeRate: 96,
                satisfaction: 4.4,
                skills: {
                    "Manual Testing": 90,
                    "Automation": 85,
                    "Performance": 80,
                    "Security": 75,
                    "Documentation": 88
                }
            },
            {
                id: 4,
                name: "Emma Davis",
                role: "DevOps Engineer",
                initials: "ED",
                overallScore: 90,
                efficiency: 92,
                quality: 88,
                productivity: 91,
                tasksCompleted: 20,
                avgCompletionTime: "16.5h",
                onTimeRate: 92,
                satisfaction: 4.7,
                skills: {
                    "AWS": 92,
                    "Docker": 90,
                    "Kubernetes": 85,
                    "CI/CD": 88,
                    "Monitoring": 86
                }
            },
            {
                id: 5,
                name: "David Brown",
                role: "Technical Writer",
                initials: "DB",
                overallScore: 78,
                efficiency: 80,
                quality: 85,
                productivity: 75,
                tasksCompleted: 15,
                avgCompletionTime: "20.3h",
                onTimeRate: 88,
                satisfaction: 4.2,
                skills: {
                    "Technical Writing": 90,
                    "Documentation": 88,
                    "API Docs": 85,
                    "Tutorials": 82,
                    "Editing": 87
                }
            }
        ],
        insights: [
            {
                title: "High Performer Recognition",
                description: "John Doe shows exceptional performance across all metrics with 95% overall score.",
                type: "positive"
            },
            {
                title: "Quality Focus",
                description: "Mike Johnson maintains 95% quality score, highest in the team.",
                type: "positive"
            },
            {
                title: "Efficiency Improvement",
                description: "Team average completion time decreased by 0.8h this period.",
                type: "positive"
            }
        ],
        improvements: [
            {
                title: "Skill Development",
                description: "Consider cross-training for David Brown in API documentation.",
                priority: "medium"
            },
            {
                title: "Process Optimization",
                description: "Review task allocation for better workload distribution.",
                priority: "high"
            },
            {
                title: "Quality Standards",
                description: "Implement peer review for critical tasks to maintain quality.",
                priority: "medium"
            }
        ]
    };

    performanceData = sampleData;
    updateRankings();
    updateInsights();
    updateImprovements();
}

function updateRankings() {
    const rankingsList = document.getElementById('rankingsList');
    if (!rankingsList || !performanceData.workers) return;

    // Sort workers by current metric
    const sortedWorkers = [...performanceData.workers].sort((a, b) => {
        return b[currentMetric + 'Score'] - a[currentMetric + 'Score'];
    });

    rankingsList.innerHTML = '';

    sortedWorkers.forEach((worker, index) => {
        const rankItem = createRankItem(worker, index + 1);
        rankingsList.appendChild(rankItem);
    });
}

function createRankItem(worker, position) {
    const item = document.createElement('div');
    item.className = 'worker-rank-item';
    item.setAttribute('data-worker-id', worker.id);

    const score = worker[currentMetric + 'Score'] || worker.overallScore;
    const badgeClass = getBadgeClass(score);

    item.innerHTML = `
        <div class="rank-position ${position <= 3 ? 'top-3' : ''}">
            ${position}
        </div>
        <div class="worker-avatar">${worker.initials}</div>
        <div class="worker-info">
            <div class="worker-name">${worker.name}</div>
            <div class="worker-role">${worker.role}</div>
        </div>
        <div class="performance-stats">
            <div class="performance-stat">
                <span class="stat-value">${score}%</span>
                <span class="stat-label">Score</span>
            </div>
            <div class="performance-stat">
                <span class="stat-value">${worker.tasksCompleted}</span>
                <span class="stat-label">Tasks</span>
            </div>
            <div class="performance-stat">
                <span class="stat-value">${worker.onTimeRate}%</span>
                <span class="stat-label">On Time</span>
            </div>
        </div>
        <div class="performance-badge ${badgeClass}">
            ${getPerformanceLabel(score)}
        </div>
    `;

    item.addEventListener('click', () => openWorkerModal(worker));
    return item;
}

function getBadgeClass(score) {
    if (score >= 90) return 'badge-excellent';
    if (score >= 80) return 'badge-good';
    if (score >= 70) return 'badge-average';
    return 'badge-poor';
}

function getPerformanceLabel(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    return 'Needs Improvement';
}

function updateInsights() {
    const insightsList = document.getElementById('insightsList');
    if (!insightsList || !performanceData.insights) return;

    insightsList.innerHTML = performanceData.insights.map(insight => `
        <div class="insight-item">
            <i class="fas fa-lightbulb"></i>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            </div>
        </div>
    `).join('');
}

function updateImprovements() {
    const improvementList = document.getElementById('improvementList');
    if (!improvementList || !performanceData.improvements) return;

    improvementList.innerHTML = performanceData.improvements.map(improvement => `
        <div class="improvement-item">
            <i class="fas fa-chart-line"></i>
            <div class="improvement-content">
                <h4>${improvement.title}</h4>
                <p>${improvement.description}</p>
            </div>
        </div>
    `).join('');
}

function openWorkerModal(worker) {
    const modal = document.getElementById('workerModal');
    const modalBody = document.getElementById('workerModalBody');

    modalBody.innerHTML = `
        <div class="worker-detail-header">
            <div class="worker-main-info">
                <div class="worker-avatar large">${worker.initials}</div>
                <div class="worker-details">
                    <h2>${worker.name}</h2>
                    <p class="worker-role">${worker.role}</p>
                    <div class="worker-stats">
                        <div class="stat">
                            <span class="value">${worker.tasksCompleted}</span>
                            <span class="label">Tasks Completed</span>
                        </div>
                        <div class="stat">
                            <span class="value">${worker.avgCompletionTime}</span>
                            <span class="label">Avg. Duration</span>
                        </div>
                        <div class="stat">
                            <span class="value">${worker.onTimeRate}%</span>
                            <span class="label">On Time Rate</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="overall-score">
                <div class="score-circle">
                    <span class="score-value">${worker.overallScore}%</span>
                    <span class="score-label">Overall</span>
                </div>
            </div>
        </div>

        <div class="performance-metrics">
            <h3>Performance Metrics</h3>
            <div class="metrics-grid">
                <div class="metric">
                    <span class="metric-label">Efficiency</span>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${worker.efficiency}%"></div>
                    </div>
                    <span class="metric-value">${worker.efficiency}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Quality</span>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${worker.quality}%"></div>
                    </div>
                    <span class="metric-value">${worker.quality}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Productivity</span>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${worker.productivity}%"></div>
                    </div>
                    <span class="metric-value">${worker.productivity}%</span>
                </div>
            </div>
        </div>

        <div class="skills-section">
            <h3>Skill Matrix</h3>
            <div class="skills-grid">
                ${Object.entries(worker.skills).map(([skill, level]) => `
                    <div class="skill-item">
                        <span class="skill-name">${skill}</span>
                        <div class="skill-bar">
                            <div class="skill-fill" style="width: ${level}%"></div>
                        </div>
                        <span class="skill-level">${level}%</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="action-buttons">
            <button class="btn btn-primary" onclick="generateDevelopmentPlan(${worker.id})">
                <i class="fas fa-file-alt"></i> Development Plan
            </button>
            <button class="btn btn-secondary" onclick="scheduleReview(${worker.id})">
                <i class="fas fa-calendar"></i> Schedule Review
            </button>
        </div>
    `;

    modal.classList.add('active');
}

function initializeCharts() {
    // Performance Trend Chart
    const trendCtx = document.getElementById('performanceTrendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'Completion Rate',
                    data: [85, 88, 90, 87, 92, 94, 96],
                    borderColor: '#7886C7',
                    backgroundColor: 'rgba(120, 134, 199, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Quality Score',
                    data: [82, 85, 88, 86, 89, 91, 94],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 75,
                    max: 100,
                    grid: {
                        color: 'rgba(45, 51, 107, 0.1)'
                    },
                    ticks: {
                        color: '#7886C7'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(45, 51, 107, 0.1)'
                    },
                    ticks: {
                        color: '#7886C7'
                    }
                }
            }
        }
    });

    // Task Distribution Chart
    const distributionCtx = document.getElementById('taskDistributionChart').getContext('2d');
    new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
            datasets: [{
                data: [65, 20, 10, 5],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800',
                    '#f44336'
                ],
                borderWidth: 2,
                borderColor: '#FFF2F2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#2D336B',
                        padding: 20
                    }
                }
            },
            cutout: '70%'
        }
    });

    // Skill Matrix Chart
    const skillCtx = document.getElementById('skillMatrixChart').getContext('2d');
    new Chart(skillCtx, {
        type: 'radar',
        data: {
            labels: ['Technical', 'Communication', 'Problem Solving', 'Leadership', 'Creativity', 'Efficiency'],
            datasets: [{
                label: 'Team Average',
                data: [85, 78, 82, 75, 80, 88],
                backgroundColor: 'rgba(120, 134, 199, 0.2)',
                borderColor: '#7886C7',
                borderWidth: 2,
                pointBackgroundColor: '#7886C7'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(45, 51, 107, 0.1)'
                    },
                    grid: {
                        color: 'rgba(45, 51, 107, 0.1)'
                    },
                    pointLabels: {
                        color: '#2D336B',
                        font: {
                            size: 11
                        }
                    },
                    ticks: {
                        color: '#7886C7',
                        backdropColor: 'transparent'
                    },
                    suggestedMin: 50,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function exportPerformanceReport() {
    showNotification('Exporting performance report...', 'info');
    // In real implementation, generate and download PDF/Excel report
    setTimeout(() => {
        showNotification('Performance report exported successfully!', 'success');
    }, 1500);
}

function generateDevelopmentPlan(workerId) {
    const worker = performanceData.workers.find(w => w.id === workerId);
    if (worker) {
        showNotification(`Generating development plan for ${worker.name}...`, 'info');
        // In real implementation, open development plan generator
    }
}

function scheduleReview(workerId) {
    const worker = performanceData.workers.find(w => w.id === workerId);
    if (worker) {
        showNotification(`Scheduling performance review for ${worker.name}...`, 'info');
        // In real implementation, open calendar/scheduling interface
    }
}

function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Add CSS for modal content
const style = document.createElement('style');
style.textContent = `
    .worker-detail-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 30px;
        padding-bottom: 25px;
        border-bottom: 1px solid var(--border);
    }
    
    .worker-main-info {
        display: flex;
        align-items: flex-start;
        gap: 20px;
    }
    
    .worker-avatar.large {
        width: 80px;
        height: 80px;
        font-size: 24px;
    }
    
    .worker-details h2 {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 5px;
    }
    
    .worker-stats {
        display: flex;
        gap: 20px;
        margin-top: 15px;
    }
    
    .worker-stats .stat {
        text-align: center;
    }
    
    .worker-stats .value {
        display: block;
        font-size: 18px;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 2px;
    }
    
    .worker-stats .label {
        font-size: 12px;
        color: var(--text-light);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .overall-score {
        text-align: center;
    }
    
    .score-circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: conic-gradient(var(--secondary) 0% 95%, var(--border) 95% 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        position: relative;
    }
    
    .score-circle::before {
        content: '';
        position: absolute;
        width: 80px;
        height: 80px;
        background: white;
        border-radius: 50%;
    }
    
    .score-value {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary);
        position: relative;
        z-index: 1;
    }
    
    .score-label {
        font-size: 12px;
        color: var(--text-light);
        position: relative;
        z-index: 1;
    }
    
    .performance-metrics {
        margin-bottom: 30px;
    }
    
    .performance-metrics h3 {
        color: var(--primary);
        margin-bottom: 20px;
        font-size: 18px;
    }
    
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
    }
    
    .metric {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .metric-label {
        font-weight: 600;
        color: var(--primary);
        font-size: 14px;
    }
    
    .metric-bar {
        height: 8px;
        background: var(--border);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .metric-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--secondary), var(--primary));
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    
    .metric-value {
        font-weight: 600;
        color: var(--primary);
        font-size: 14px;
        text-align: right;
    }
    
    .skills-section {
        margin-bottom: 30px;
    }
    
    .skills-section h3 {
        color: var(--primary);
        margin-bottom: 20px;
        font-size: 18px;
    }
    
    .skills-grid {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .skill-item {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .skill-name {
        font-weight: 600;
        color: var(--primary);
        min-width: 120px;
        font-size: 14px;
    }
    
    .skill-bar {
        flex: 1;
        height: 6px;
        background: var(--border);
        border-radius: 3px;
        overflow: hidden;
    }
    
    .skill-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--secondary), var(--primary));
        border-radius: 3px;
        transition: width 0.3s ease;
    }
    
    .skill-level {
        font-weight: 600;
        color: var(--primary);
        min-width: 40px;
        text-align: right;
        font-size: 14px;
    }
    
    .action-buttons {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
        padding-top: 25px;
        border-top: 1px solid var(--border);
    }
`;
document.head.appendChild(style);