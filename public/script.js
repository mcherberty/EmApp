// Set current datetime to now
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('datetime').value = now.toISOString().slice(0, 16);
});

// Get location button
document.getElementById('getLocationBtn').addEventListener('click', getLocation);

// File preview
document.getElementById('picture').addEventListener('change', previewImage);

// Form submission
document.getElementById('reportForm').addEventListener('submit', submitReport);

function getLocation() {
  const locationStatus = document.getElementById('locationStatus');
  const latInput = document.getElementById('latitude');
  const lonInput = document.getElementById('longitude');

  if (!navigator.geolocation) {
    showLocationError(locationStatus, 'Geolocation is not supported by your browser.');
    return;
  }

  // Show loading state
  locationStatus.textContent = '📍 Getting your location...';
  locationStatus.classList.remove('error', 'success');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      latInput.value = latitude.toFixed(6);
      lonInput.value = longitude.toFixed(6);

      showLocationSuccess(
        locationStatus,
        `✓ Location obtained (Accuracy: ${Math.round(accuracy)}m)`
      );
    },
    (error) => {
      let errorMsg = 'Unable to get location. ';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg += 'Permission denied. Please allow location access.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg += 'Position information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMsg += 'Location request timed out.';
          break;
        default:
          errorMsg += error.message;
      }
      showLocationError(locationStatus, errorMsg);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

function showLocationSuccess(element, message) {
  element.textContent = message;
  element.classList.remove('error');
  element.classList.add('success');
}

function showLocationError(element, message) {
  element.textContent = '✗ ' + message;
  element.classList.remove('success');
  element.classList.add('error');
}

function previewImage(event) {
  const file = event.target.files[0];
  const previewContainer = document.getElementById('previewContainer');

  previewContainer.innerHTML = '';

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

async function submitReport(event) {
  event.preventDefault();

  const form = document.getElementById('reportForm');
  const formData = new FormData(form);
  const loading = document.getElementById('loading');
  const successMsg = document.getElementById('successMessage');
  const errorMsg = document.getElementById('errorMessage');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Clear previous messages
  successMsg.classList.add('hidden');
  errorMsg.classList.add('hidden');

  // Validate required fields
  if (!formData.get('eventType') || !formData.get('description') ||
      !formData.get('latitude') || !formData.get('longitude') ||
      !formData.get('datetime') || !formData.get('email')) {
    showError(errorMsg, 'Please fill in all required fields.');
    return;
  }

  // Show loading
  loading.classList.remove('hidden');
  submitBtn.disabled = true;

  try {
    const response = await fetch('/api/submit-report', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      // Success - redirect to success page with data
      loading.classList.add('hidden');
      
      console.log('Report submitted successfully');
      
      // Get form values
      const eventType = formData.get('eventType');
      const description = formData.get('description');
      const latitude = formData.get('latitude');
      const longitude = formData.get('longitude');
      const datetime = formData.get('datetime');
      const email = formData.get('email');
      
      // Store report data in session storage
      sessionStorage.setItem('reportEventType', eventType);
      sessionStorage.setItem('reportDescription', description);
      sessionStorage.setItem('reportLatitude', latitude);
      sessionStorage.setItem('reportLongitude', longitude);
      sessionStorage.setItem('reportDatetime', datetime);
      sessionStorage.setItem('reportEmail', email);
      
      // Redirect to success page
      console.log('Redirecting to success page');
      window.location.href = '/success';
    } else {
      // Error
      loading.classList.add('hidden');
      showError(errorMsg, data.error || 'Failed to submit report.');
    }
  } catch (error) {
    loading.classList.add('hidden');
    showError(errorMsg, 'Network error. Please try again.');
    console.error('Error:', error);
  } finally {
    submitBtn.disabled = false;
  }
}

function showError(element, message) {
  element.textContent = '⚠ ' + message;
  element.classList.remove('hidden');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
