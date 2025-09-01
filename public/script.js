let currentUser = null;

function showLogin() {
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('dashboard').style.display = 'none';
}

function showRegister() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('registerSection').style.display = 'block';
  document.getElementById('symptomSection').style.display = 'none';
  document.getElementById('bookingSection').style.display = 'none';
  document.getElementById('premiumSection').style.display = 'none';
  document.getElementById('registerSection').classList.add('animate__fadeIn');
}

function showMain() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('symptomSection').style.display = 'block';
  document.getElementById('bookingSection').style.display = 'block';
  document.getElementById('premiumSection').style.display = currentUser.is_premium ? 'none' : 'block';
  document.getElementById('symptomSection').classList.add('animate__fadeIn');
  document.getElementById('bookingSection').classList.add('animate__fadeIn');
  document.getElementById('premiumSection').classList.add('animate__fadeIn');
  updateIntaSendButton();
  loadDailyTips();
}

function updateIntaSendButton() {
  if (currentUser) {
    const button = document.querySelector('.intaSendPayButton');
    button.setAttribute('data-email', currentUser.email);
    button.setAttribute('data-first_name', currentUser.name.split(' ')[0]);
    button.setAttribute('data-last_name', currentUser.name.split(' ').slice(1).join(' ') || 'Premium');
  }
}

function loadDailyTips() {
  const tips = [
    "Stay hydrated to boost your immune system.",
    "Get 7-8 hours of sleep for better health.",
    "Eat fruits and vegetables daily for vitamins."
  ];
  document.getElementById('dailyTips').innerText = tips[Math.floor(Math.random() * tips.length)];
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    location: document.getElementById('location').value
  };
  try {
    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    Toastify({
      text: result.message,
      duration: 3000,
      style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
    }).showToast();
    if (res.ok) showLogin();
  } catch (err) {
    Toastify({
      text: 'Error registering: ' + err.message,
      duration: 3000,
      style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
    }).showToast();
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value
  };
  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      currentUser = result;
      document.getElementById('userName').innerText = currentUser.name;
      Toastify({
        text: 'Logged in as ' + result.name,
        duration: 3000,
        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
      }).showToast();
      showMain();
    } else {
      Toastify({
        text: result.message,
        duration: 3000,
        style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
      }).showToast();
    }
  } catch (err) {
    Toastify({
      text: 'Error logging in: ' + err.message,
      duration: 3000,
      style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
    }).showToast();
  }
});

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) {
    Toastify({
      text: 'Please log in first',
      duration: 3000,
      style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
    }).showToast();
    showLogin();
    return;
  }
  const data = {
    user_id: currentUser.id,
    doctor_name: document.getElementById('doctor').value,
    date: document.getElementById('date').value
  };
  try {
    const res = await fetch('http://localhost:3000/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    Toastify({
      text: result.message,
      duration: 3000,
      style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
    }).showToast();
    if (res.ok) {
      window.open(`https://meet.jit.si/afrihealth-booking-${result.booking_id}`, '_blank');
    }
  } catch (err) {
    Toastify({
      text: 'Error booking: ' + err.message,
      duration: 3000,
      style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
    }).showToast();
  }
});

document.getElementById('symptomForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) {
    Toastify({
      text: 'Please log in first',
      duration: 3000,
      style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
    }).showToast();
    showLogin();
    return;
  }
  const symptoms = document.getElementById('symptoms').value;
  try {
    const res = await fetch('http://localhost:3000/ai-tip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms })
    });
    const result = await res.json();
    if (res.ok) {
      document.getElementById('aiTip').innerText = result.tip;
      Toastify({
        text: 'AI tip loaded successfully',
        duration: 3000,
        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
      }).showToast();
    } else {
      Toastify({
        text: result.message,
        duration: 3000,
        style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
      }).showToast();
    }
  } catch (err) {
    Toastify({
      text: 'Error getting AI tip: ' + err.message,
      duration: 3000,
      style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
    }).showToast();
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  document.getElementById('userName').innerText = '';
  showLogin();
  Toastify({
    text: 'Logged out successfully',
    duration: 3000,
    style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
  }).showToast();
});

// IntaSend Payment Integration
new window.IntaSend({
  publicAPIKey: "ISPubKey_test_63e46980-ea88-4fd9-b7c5-5bec77ad84de", // Replace with your IntaSend sandbox key
  live: false
})
.on("COMPLETE", async (results) => {
  try {
    const res = await fetch('http://localhost:3000/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: currentUser.id })
    });
    const result = await res.json();
    if (res.ok) {
      currentUser.is_premium = 1;
      showMain();
      Toastify({
        text: 'Premium upgrade successful!',
        duration: 3000,
        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
      }).showToast();
    } else {
      Toastify({
        text: result.message,
        duration: 3000,
        style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
      }).showToast();
    }
  } catch (err) {
    Toastify({
      text: 'Error upgrading to premium: ' + err.message,
      duration: 3000,
      style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
    }).showToast();
  }
})
.on("FAILED", (results) => {
  Toastify({
    text: "Payment failed, please try again.",
    duration: 3000,
    style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
  }).showToast();
})
.on("IN-PROGRESS", (results) => {
  Toastify({
    text: "Payment in progress...",
    duration: 3000,
    style: { background: "linear-gradient(to right, #ffc371, #ff5f6d)" }
  }).showToast();
});