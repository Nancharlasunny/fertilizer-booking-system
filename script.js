let generatedOTP = null;
let currentBooking = null;

const shops = {
  "Village A": [{ name: "AgroMart", location: "Market Road, Village A", certified: true }],
  "Town B": [{ name: "FarmCare", location: "Main Bazaar, Town B", certified: true }],
  "City C": [{ name: "KrishiPoint", location: "Highway 1, City C", certified: false }]
};

function sendOTP() {
  const aadhaar = document.getElementById("aadhaar").value.trim();
  const message = document.getElementById("login-message");
  if (!/^\d{12}$/.test(aadhaar)) { message.textContent = "Please enter a valid 12-digit Aadhaar number."; message.className = "error"; return; }
  generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
  document.getElementById("otp-section").classList.remove("hidden");
  alert("Demo OTP: " + generatedOTP);
  message.textContent = "OTP generated successfully."; message.className = "success";
}

function loginFarmer() {
  const aadhaar = document.getElementById("aadhaar").value.trim();
  const otp = document.getElementById("otp").value.trim();
  const passbook = document.getElementById("passbook").value.trim();
  const landSize = document.getElementById("landSize").value;
  const message = document.getElementById("login-message");
  if (!/^\d{12}$/.test(aadhaar)) { message.textContent = "Enter valid 12-digit Aadhaar."; message.className = "error"; return; }
  if (!generatedOTP) { message.textContent = "Please click Send OTP first."; message.className = "error"; return; }
  if (otp!== generatedOTP) { message.textContent = "Invalid OTP."; message.className = "error"; return; }
  if (passbook === "" || landSize === "" || Number(landSize) <= 0) { message.textContent = "Please enter passbook number and land size."; message.className = "error"; return; }
  message.textContent = "Login successful!"; message.className = "success";
  document.getElementById("booking-section").classList.remove("hidden");
  document.getElementById("booking-section").scrollIntoView({ behavior: "smooth" });
}

function showShops() {
  const location = document.getElementById("location").value;
  const shopContainer = document.getElementById("shop-container");
  const shopSelect = document.getElementById("shop");
  shopSelect.innerHTML = '<option value="">-- Select Shop --</option>';
  if (location === "") { shopContainer.classList.add("hidden"); return; }
  shops[location].forEach(function(shop) {
    const option = document.createElement("option");
    option.value = shop.name;
    option.textContent = shop.name + " - " + (shop.certified? "Govt. Certified" : "Not Certified");
    shopSelect.appendChild(option);
  });
  shopContainer.classList.remove("hidden");
}

function bookFertilizer() {
  const location = document.getElementById("location").value;
  const shop = document.getElementById("shop").value;
  const fertilizer = document.getElementById("fertilizer");
  const fertilizerName = fertilizer.value;
  const price = Number(fertilizer.options[fertilizer.selectedIndex].dataset.price);
  const bags = Number(document.getElementById("bags").value);
  const date = document.getElementById("date").value;
  const payment = document.getElementById("payment").value;
  const message = document.getElementById("message");
  if (location === "" || shop === "" || bags < 1 || date === "") { message.textContent = "Please complete all booking details."; message.className = "error"; return; }
  const total = price * bags;
  const bookingID = "FB" + Date.now().toString().slice(-8);
  currentBooking = { bookingID, location, shop, fertilizer: fertilizerName, price, bags, date, payment, total };
  document.getElementById("receipt").innerHTML = `<h3>Booking Confirmed</h3><p class="booking-id">Booking ID: ${bookingID}</p><p><strong>Location:</strong> ${location}</p><p><strong>Shop:</strong> ${shop}</p><p><strong>Fertilizer:</strong> ${fertilizerName}</p><p><strong>Bags:</strong> ${bags}</p><p><strong>Price:</strong> ₹${price}</p><p><strong>Total:</strong> ₹${total}</p><p><strong>Date:</strong> ${date}</p><p><strong>Payment:</strong> ${payment}</p>`;
  document.getElementById("receipt").classList.remove("hidden");
  document.getElementById("download-receipt").classList.remove("hidden");
  message.textContent = "Fertilizer booked successfully!"; message.className = "success";
}

function downloadReceipt() {
  if (!currentBooking) return;
  const b = currentBooking;
  const receiptText = `FERTILIZER BOOKING RECEIPT\n==========================\nBooking ID: ${b.bookingID}\nLocation: ${b.location}\nShop: ${b.shop}\nFertilizer: ${b.fertilizer}\nBags: ${b.bags}\nPrice: ₹${b.price}\nTotal: ₹${b.total}\nDate: ${b.date}\nPayment: ${b.payment}\n==========================\nThank you!`;
  const blob = new Blob([receiptText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = b.bookingID + "_receipt.txt"; link.click();
  URL.revokeObjectURL(url);
}

document.getElementById("date").min = new Date().toISOString().split("T")[0];