let allReports = [];
let filteredReports = [];
let map = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard initializing...');
  
  // Check if elements exist
  const loadingMsg = document.getElementById('loadingMessage');
  const emptyMsg = document.getElementById('emptyMessage');
  const container = document.getElementById('reportsContainer');
  const refreshBtn = document.getElementById('refreshBtn');
  const exportBtn = document.getElementById('exportBtn');
  const typeFilter = document.getElementById('eventTypeFilter');
  const searchFilter = document.getElementById('searchFilter');
  const closeMapBtn = document.getElementById('closeMapBtn');
  const closeImageBtn = document.getElementById('closeImageBtn');
  const mapModal = document.getElementById('mapModal');
  const imageModal = document.getElementById('imageModal');
  
  console.log('Elements found:', {
    loadingMsg: !!loadingMsg,
    emptyMsg: !!emptyMsg,
    container: !!container,
    refreshBtn: !!refreshBtn,
    exportBtn: !!exportBtn,
    typeFilter: !!typeFilter,
    searchFilter: !!searchFilter,
    closeMapBtn: !!closeMapBtn,
    closeImageBtn: !!closeImageBtn
  });
  
  loadReports();
  
  // Event listeners
  if (refreshBtn) refreshBtn.addEventListener('click', loadReports);
  if (exportBtn) exportBtn.addEventListener('click', exportToCSV);
  if (typeFilter) typeFilter.addEventListener('change', filterReports);
  if (searchFilter) searchFilter.addEventListener('keyup', filterReports);
  if (closeMapBtn) closeMapBtn.addEventListener('click', closeMapModal);
  if (closeImageBtn) closeImageBtn.addEventListener('click', closeImageModal);
  
  // Close modal when clicking outside
  if (mapModal) {
    mapModal.addEventListener('click', (e) => {
      if (e.target === mapModal) {
        closeMapModal();
      }
    });
  }
  
  if (imageModal) {
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        closeImageModal();
      }
    });
  }
});

async function loadReports() {
  const loadingMsg = document.getElementById('loadingMessage');
  const emptyMsg = document.getElementById('emptyMessage');
  const container = document.getElementById('reportsContainer');
  
  console.log('Loading reports...');
  
  if (loadingMsg) loadingMsg.classList.remove('hidden');
  if (emptyMsg) emptyMsg.classList.add('hidden');
  if (container) container.innerHTML = '';
  
  try {
    const response = await fetch('/api/reports');
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response data:', data);
    
    if (data.success) {
      allReports = data.reports;
      filteredReports = allReports;
      
      console.log('Reports loaded:', allReports.length);
      
      updateStats();
      renderReports();
      
      if (allReports.length === 0) {
        if (emptyMsg) {
          emptyMsg.classList.remove('hidden');
        }
      }
    } else {
      showError('Failed to load reports - No success response from API');
    }
  } catch (error) {
    console.error('Error loading reports:', error);
    showError('Network error: ' + error.message);
  } finally {
    if (loadingMsg) loadingMsg.classList.add('hidden');
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
  const modal = document.getElementById('mapModal');
  if (modal) {
    modal.classList.add('hidden');
  }
  if (map) {
    map.remove();
    map = null;
  }
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.classList.add('hidden');
  }
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
  console.error('Dashboard Error:', message);
  const container = document.getElementById('reportsContainer');
  if (container) {
    container.innerHTML = `<div class="error-message" style="background: #ffcdd2; color: #c62828; padding: 20px; border-radius: 8px; border-left: 4px solid #c62828;">
      <p><strong>Error:</strong> ${escapeHtml(message)}</p>
    </div>`;
  }
}
