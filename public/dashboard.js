let allReports = [];
let filteredReports = [];
let map = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadReports();
  
  // Event listeners
  document.getElementById('refreshBtn').addEventListener('click', loadReports);
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);
  document.getElementById('eventTypeFilter').addEventListener('change', filterReports);
  document.getElementById('searchFilter').addEventListener('keyup', filterReports);
  
  // Modal close buttons
  document.getElementById('closeMapBtn').addEventListener('click', closeMapModal);
  document.getElementById('closeImageBtn').addEventListener('click', closeImageModal);
});

async function loadReports() {
  const loadingMsg = document.getElementById('loadingMessage');
  const emptyMsg = document.getElementById('emptyMessage');
  const container = document.getElementById('reportsContainer');
  
  loadingMsg.classList.remove('hidden');
  emptyMsg.classList.add('hidden');
  container.innerHTML = '';
  
  try {
    const response = await fetch('/api/reports');
    const data = await response.json();
    
    if (data.success) {
      allReports = data.reports;
      filteredReports = allReports;
      
      updateStats();
      renderReports();
      
      if (allReports.length === 0) {
        emptyMsg.classList.remove('hidden');
      }
    } else {
      showError('Failed to load reports');
    }
  } catch (error) {
    console.error('Error loading reports:', error);
    showError('Network error: Unable to load reports');
  } finally {
    loadingMsg.classList.add('hidden');
  }
}

function updateStats() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  let todayCount = 0;
  let weekCount = 0;
  
  allReports.forEach(report => {
    const reportDate = new Date(report.submittedAt);
    const reportDateOnly = new Date(reportDate.getFullYear(), reportDate.getMonth(), reportDate.getDate());
    
    if (reportDateOnly.getTime() === today.getTime()) {
      todayCount++;
    }
    if (reportDate >= weekAgo) {
      weekCount++;
    }
  });
  
  document.getElementById('totalReports').textContent = allReports.length;
  document.getElementById('todayReports').textContent = todayCount;
  document.getElementById('thisWeekReports').textContent = weekCount;
}

function filterReports() {
  const eventType = document.getElementById('eventTypeFilter').value;
  const searchTerm = document.getElementById('searchFilter').value.toLowerCase();
  
  filteredReports = allReports.filter(report => {
    const matchesType = !eventType || report.eventType === eventType;
    const matchesSearch = !searchTerm || 
      report.description.toLowerCase().includes(searchTerm) ||
      report.reporterEmail.toLowerCase().includes(searchTerm);
    
    return matchesType && matchesSearch;
  });
  
  renderReports();
}

function renderReports() {
  const container = document.getElementById('reportsContainer');
  const emptyMsg = document.getElementById('emptyMessage');
  
  if (filteredReports.length === 0) {
    container.innerHTML = '';
    emptyMsg.classList.remove('hidden');
    return;
  }
  
  emptyMsg.classList.add('hidden');
  container.innerHTML = filteredReports.map(report => createReportCard(report)).join('');
  
  // Add event listeners to cards
  document.querySelectorAll('.report-card').forEach(card => {
    const reportId = card.dataset.reportId;
    const report = filteredReports.find(r => r.id === reportId);
    
    card.querySelector('.view-map-btn')?.addEventListener('click', () => showMapModal(report));
    card.querySelector('.view-image-btn')?.addEventListener('click', () => showImageModal(report));
  });
}

function createReportCard(report) {
  const date = new Date(report.submittedAt);
  const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  const eventLabel = getEventLabel(report.eventType);
  
  let imageBtn = '';
  if (report.picture) {
    imageBtn = `<button class="view-image-btn" title="View Image">📷 View Image</button>`;
  }
  
  return `
    <div class="report-card" data-report-id="${report.id}">
      <div class="report-header">
        <div class="event-type-badge" data-type="${report.eventType}">
          ${eventLabel}
        </div>
        <div class="report-time">${formattedDate}</div>
      </div>
      
      <div class="report-body">
        <div class="report-description">
          <h3>Description</h3>
          <p>${escapeHtml(report.description)}</p>
        </div>
        
        <div class="report-details">
          <div class="detail-item">
            <span class="detail-label">Reporter Email:</span>
            <span class="detail-value">${escapeHtml(report.reporterEmail)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Event Date & Time:</span>
            <span class="detail-value">${new Date(report.datetime).toLocaleString()}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Location (GPS):</span>
            <span class="detail-value">
              Lat: ${report.location.latitude.toFixed(6)}, 
              Lon: ${report.location.longitude.toFixed(6)}
            </span>
          </div>
        </div>
      </div>
      
      <div class="report-footer">
        <button class="view-map-btn" title="View on Map">🗺️ View on Map</button>
        ${imageBtn}
      </div>
    </div>
  `;
}

function showMapModal(report) {
  const modal = document.getElementById('mapModal');
  const mapContainer = document.getElementById('mapContainer');
  const mapInfo = document.getElementById('mapInfo');
  
  // Remove old map if exists
  if (map) {
    map.remove();
  }
  
  // Initialize map
  map = L.map(mapContainer).setView(
    [report.location.latitude, report.location.longitude],
    13
  );
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);
  
  // Add marker
  L.marker([report.location.latitude, report.location.longitude])
    .addTo(map)
    .bindPopup(`<strong>${getEventLabel(report.eventType)}</strong><br>${escapeHtml(report.description)}`);
  
  // Update info
  mapInfo.innerHTML = `
    <p><strong>Event Type:</strong> ${getEventLabel(report.eventType)}</p>
    <p><strong>Location:</strong> ${report.location.latitude.toFixed(6)}, ${report.location.longitude.toFixed(6)}</p>
    <p><strong>Reporter:</strong> ${escapeHtml(report.reporterEmail)}</p>
    <a href="https://www.google.com/maps?q=${report.location.latitude},${report.location.longitude}" target="_blank" class="external-link">
      Open in Google Maps →
    </a>
  `;
  
  modal.classList.remove('hidden');
}

function showImageModal(report) {
  const modal = document.getElementById('imageModal');
  const img = document.getElementById('modalImage');
  
  // Construct image path
  const imagePath = report.picture ? report.picture.replace(/\\/g, '/') : '';
  img.src = imagePath;
  
  modal.classList.remove('hidden');
}

function closeMapModal() {
  document.getElementById('mapModal').classList.add('hidden');
  if (map) {
    map.remove();
    map = null;
  }
}

function closeImageModal() {
  document.getElementById('imageModal').classList.add('hidden');
}

function exportToCSV() {
  if (filteredReports.length === 0) {
    alert('No reports to export');
    return;
  }
  
  const headers = ['ID', 'Event Type', 'Description', 'Reporter Email', 'Latitude', 'Longitude', 'Event Date', 'Submitted At'];
  const rows = filteredReports.map(report => [
    report.id,
    report.eventType,
    report.description.replace(/"/g, '""'),
    report.reporterEmail,
    report.location.latitude,
    report.location.longitude,
    report.datetime,
    report.submittedAt
  ]);
  
  let csv = headers.map(h => `"${h}"`).join(',') + '\n';
  csv += rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `emergency-reports-${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getEventLabel(eventType) {
  const labels = {
    'earthquake': '🌍 Earthquake',
    'flood': '🌊 Flood',
    'hurricane': '🌀 Hurricane/Cyclone',
    'tornado': '🌪️ Tornado',
    'wildfire': '🔥 Wildfire',
    'landslide': '⛰️ Landslide',
    'tsunami': '🌊 Tsunami',
    'volcanic': '🌋 Volcanic Eruption',
    'chemical': '☠️ Chemical Hazard',
    'accident': '⚠️ Major Accident',
    'other': '❓ Other'
  };
  
  return labels[eventType] || eventType;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(message) {
  console.error(message);
  const emptyMsg = document.getElementById('emptyMessage');
  emptyMsg.querySelector('p').textContent = '⚠️ ' + message;
  emptyMsg.classList.remove('hidden');
}
