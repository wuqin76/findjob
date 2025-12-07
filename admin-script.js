// 模拟数据存储（实际应用中应使用后端API）
let applications = [];
let currentApplication = null;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  loadApplications();
  setupEventListeners();
  
  // 模拟实时数据更新
  setInterval(loadApplications, 30000); // 每30秒刷新一次
});

// 设置事件监听器
function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const dateFilter = document.getElementById('dateFilter');

  searchInput.addEventListener('input', filterApplications);
  statusFilter.addEventListener('change', filterApplications);
  dateFilter.addEventListener('change', filterApplications);
}

// 从localStorage加载数据
function loadApplications() {
  // 从localStorage获取数据
  const storedData = localStorage.getItem('simpleJobApplications');
  
  if (storedData) {
    applications = JSON.parse(storedData);
  } else {
    // 生成示例数据（实际应用中删除）
    applications = generateSampleData();
  }

  updateStatistics();
  renderApplications(applications);
}

// 生成示例数据
function generateSampleData() {
  const sampleData = [];
  const names = ['Erik Andersson', 'Maria Svensson', 'Johan Karlsson', 'Anna Nilsson', 'Peter Larsson'];
  const emails = ['erik.a@example.se', 'maria.s@example.se', 'johan.k@example.se', 'anna.n@example.se', 'peter.l@example.se'];
  const methods = ['Banköverföring', 'Swish'];
  const statuses = ['completed', 'pending', 'incomplete'];

  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    sampleData.push({
      id: 1000 + i,
      name: names[Math.floor(Math.random() * names.length)],
      email: emails[Math.floor(Math.random() * emails.length)],
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      question1: Math.random() > 0.3 ? 'Ja' : 'Nej',
      question2: Math.random() > 0.4 ? 'Ja' : 'Nej',
      question3: Math.random() > 0.5 ? 'Ja' : 'Nej',
      question4: Math.random() > 0.6 ? 'Ja' : 'Nej',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: date.toISOString(),
      payout: Math.random() > 0.5 ? 5000 : 0
    });
  }

  return sampleData;
}

// 更新统计数据
function updateStatistics() {
  const total = applications.length;
  const completed = applications.filter(app => app.status === 'completed').length;
  const pending = applications.filter(app => app.status === 'pending').length;
  const totalPayout = applications.reduce((sum, app) => sum + (app.payout || 0), 0);

  document.getElementById('totalApplications').textContent = total;
  document.getElementById('completedApplications').textContent = completed;
  document.getElementById('pendingApplications').textContent = pending;
  document.getElementById('totalPayout').textContent = totalPayout.toLocaleString('sv-SE') + ' kr';
}

// 渲染应用列表
function renderApplications(data) {
  const tbody = document.getElementById('applicationsTableBody');
  const emptyState = document.getElementById('emptyState');

  if (data.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  tbody.innerHTML = data.map(app => `
    <tr>
      <td><strong>#${app.id}</strong></td>
      <td>${app.name}</td>
      <td>${app.email}</td>
      <td>${app.paymentMethod}</td>
      <td><span class="answer-${app.question1.toLowerCase()}">${app.question1}</span></td>
      <td><span class="answer-${app.question2.toLowerCase()}">${app.question2}</span></td>
      <td><span class="answer-${app.question3.toLowerCase()}">${app.question3}</span></td>
      <td><span class="answer-${app.question4.toLowerCase()}">${app.question4}</span></td>
      <td><span class="status-badge status-${app.status}">${getStatusText(app.status)}</span></td>
      <td>${formatDate(app.date)}</td>
      <td>
        <button class="action-btn view-btn" onclick="viewDetails(${app.id})">Visa</button>
        <button class="action-btn delete-btn" onclick="deleteApplication(${app.id})">Ta bort</button>
      </td>
    </tr>
  `).join('');
}

// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    'completed': 'Slutförd',
    'pending': 'Väntande',
    'incomplete': 'Ofullständig'
  };
  return statusMap[status] || status;
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('sv-SE', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 过滤应用
function filterApplications() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const dateFilter = document.getElementById('dateFilter').value;

  let filtered = applications;

  // 搜索过滤
  if (searchTerm) {
    filtered = filtered.filter(app => 
      app.name.toLowerCase().includes(searchTerm) ||
      app.email.toLowerCase().includes(searchTerm)
    );
  }

  // 状态过滤
  if (statusFilter !== 'all') {
    filtered = filtered.filter(app => app.status === statusFilter);
  }

  // 日期过滤
  if (dateFilter) {
    const filterDate = new Date(dateFilter).toDateString();
    filtered = filtered.filter(app => 
      new Date(app.date).toDateString() === filterDate
    );
  }

  renderApplications(filtered);
}

// 查看详情
function viewDetails(id) {
  currentApplication = applications.find(app => app.id === id);
  if (!currentApplication) return;

  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <div class="detail-row">
      <span class="detail-label">ID:</span>
      <span class="detail-value">#${currentApplication.id}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Namn:</span>
      <span class="detail-value">${currentApplication.name}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">E-post:</span>
      <span class="detail-value">${currentApplication.email}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Betalningsmetod:</span>
      <span class="detail-value">${currentApplication.paymentMethod}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Fråga 1 (Tjäna 5000 kr):</span>
      <span class="detail-value answer-${currentApplication.question1.toLowerCase()}">${currentApplication.question1}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Fråga 2 (Passbild & Selfie):</span>
      <span class="detail-value answer-${currentApplication.question2.toLowerCase()}">${currentApplication.question2}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Fråga 3 (Över 30 år):</span>
      <span class="detail-value answer-${currentApplication.question3.toLowerCase()}">${currentApplication.question3}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Fråga 4 (Extra inkomst):</span>
      <span class="detail-value answer-${currentApplication.question4.toLowerCase()}">${currentApplication.question4}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Status:</span>
      <span class="status-badge status-${currentApplication.status}">${getStatusText(currentApplication.status)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Datum:</span>
      <span class="detail-value">${formatDate(currentApplication.date)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Utbetalning:</span>
      <span class="detail-value">${currentApplication.payout.toLocaleString('sv-SE')} kr</span>
    </div>
  `;

  document.getElementById('detailModal').style.display = 'flex';
}

// 关闭模态框
function closeModal() {
  document.getElementById('detailModal').style.display = 'none';
  currentApplication = null;
}

// 批准应用
function approveApplication() {
  if (!currentApplication) return;

  currentApplication.status = 'completed';
  currentApplication.payout = 5000;

  // 保存到localStorage
  localStorage.setItem('simpleJobApplications', JSON.stringify(applications));

  alert(`Ansökan #${currentApplication.id} har godkänts!`);
  closeModal();
  loadApplications();
}

// 删除应用
function deleteApplication(id) {
  if (!confirm('Är du säker på att du vill ta bort denna ansökan?')) return;

  applications = applications.filter(app => app.id !== id);
  localStorage.setItem('simpleJobApplications', JSON.stringify(applications));
  
  loadApplications();
}

// 导出数据
function exportData() {
  const csv = convertToCSV(applications);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `simplejob_applications_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 转换为CSV
function convertToCSV(data) {
  const headers = ['ID', 'Namn', 'E-post', 'Betalningsmetod', 'Fråga 1', 'Fråga 2', 'Fråga 3', 'Fråga 4', 'Status', 'Datum', 'Utbetalning'];
  const rows = data.map(app => [
    app.id,
    app.name,
    app.email,
    app.paymentMethod,
    app.question1,
    app.question2,
    app.question3,
    app.question4,
    getStatusText(app.status),
    formatDate(app.date),
    app.payout + ' kr'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return '\uFEFF' + csvContent; // BOM for Excel UTF-8
}
