// --- Elemen DOM ---
const numberInput = document.getElementById("numberInput");
const resultDisplay = document.getElementById("result");
const errorMessage = document.getElementById("errorMessage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const roundToDisplay = document.getElementById("roundToDisplay");

// --- Data Opsi Pembulatan ---
const roundingOptions = {
  Triliun: 1e12,
  "Ratusan Miliar": 1e11,
  "Puluhan Miliar": 1e10,
  Miliar: 1e9,
  "Ratusan Juta": 1e8,
  "Puluhan Juta": 1e7,
  Juta: 1e6,
  "Ratusan Ribu": 1e5,
  "Puluhan Ribu": 1e4,
  Ribu: 1e3,
  Ratusan: 100,
  Puluhan: 10,
  Satuan: 1,
  "Persepuluhan (1 desimal)": 0.1,
  "Perseratusan (2 desimal)": 0.01,
  "Perseribuan (3 desimal)": 0.001,
  "Persepuluhribuan (4 desimal)": 0.0001,
  "Perseratusribuan (5 desimal)": 0.00001,
  "Persejutaan (6 desimal)": 0.000001,
  "Persepuluhjutaan (7 desimal)": 1e-7,
  "Perseratusjutaan (8 desimal)": 1e-8,
  "Persemiliaran (9 desimal)": 1e-9,
  "Persepuluhmiliaran (10 desimal)": 1e-10,
  "Perseratusmiliaran (11 desimal)": 1e-11,
  "Persetriliunan (12 desimal)": 1e-12,
};
// Mengubah kunci objek menjadi array untuk navigasi
const optionKeys = Object.keys(roundingOptions);
let currentOptionIndex = optionKeys.indexOf("Satuan"); // Mulai dari 'Satuan'

// --- Fungsi untuk Memperbarui Tampilan & Melakukan Kalkulasi ---
function updateAndCalculate() {
  // 1. Update tampilan opsi yang dipilih
  roundToDisplay.textContent = optionKeys[currentOptionIndex];

  // 2. Lakukan kalkulasi jika ada angka di input
  const number = parseFloat(numberInput.value);
  if (!isNaN(number)) {
    performRounding(number);
  } else {
    // Jika input kosong atau tidak valid, reset hasil
    resultDisplay.textContent = "-";
    errorMessage.textContent = "";
  }
}

// --- Fungsi Kalkulasi Utama ---
function performRounding(number) {
  const roundToKey = optionKeys[currentOptionIndex];
  const roundToValue = roundingOptions[roundToKey];

  errorMessage.textContent = ""; // Hapus pesan error lama

  let roundedNumber;
  if (roundToValue >= 1) {
    roundedNumber = Math.round(number / roundToValue) * roundToValue;
  } else {
    const decimalPlaces = -Math.log10(roundToValue);
    // Menggunakan toFixed() lalu parseFloat untuk menghindari error presisi JavaScript
    roundedNumber = parseFloat(number.toFixed(decimalPlaces));
  }

  // Tampilkan hasil dengan format lokal
  resultDisplay.textContent = roundedNumber.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 12,
  });
}

// --- Event Listeners ---
// Saat halaman dimuat, inisialisasi tampilan
document.addEventListener("DOMContentLoaded", updateAndCalculate);

// Tombol navigasi untuk opsi pembulatan
prevBtn.addEventListener("click", () => {
  currentOptionIndex--;
  if (currentOptionIndex < 0) {
    currentOptionIndex = optionKeys.length - 1; // Kembali ke akhir jika sudah di awal
  }
  updateAndCalculate();
});

nextBtn.addEventListener("click", () => {
  currentOptionIndex++;
  if (currentOptionIndex >= optionKeys.length) {
    currentOptionIndex = 0; // Kembali ke awal jika sudah di akhir
  }
  updateAndCalculate();
});

// Kalkulasi otomatis saat pengguna mengetik
numberInput.addEventListener("input", () => {
  const number = parseFloat(numberInput.value);
  if (isNaN(number) && numberInput.value !== "" && numberInput.value !== "-") {
    errorMessage.textContent = "Input tidak valid.";
    resultDisplay.textContent = "-";
  } else if (numberInput.value === "") {
    resultDisplay.textContent = "-";
    errorMessage.textContent = "";
  } else {
    updateAndCalculate();
  }
});
