// --- BAGIAN 1: DEKLARASI VARIABEL & ELEMEN DOM ---
// Komentar: Di sini kita mengambil semua elemen HTML yang akan kita manipulasi
// dan menyimpannya dalam variabel agar mudah diakses.

// Mengambil elemen input tempat pengguna mengetik angka.
const numberInput = document.getElementById("numberInput");
// Mengambil elemen paragraf untuk menampilkan hasil akhir.
const resultDisplay = document.getElementById("result");
// Mengambil elemen paragraf untuk menampilkan pesan kesalahan.
const errorMessage = document.getElementById("errorMessage");
// Mengambil tombol panah atas untuk navigasi opsi.
const prevBtn = document.getElementById("prevBtn");
// Mengambil tombol panah bawah untuk navigasi opsi.
const nextBtn = document.getElementById("nextBtn");
// Mengambil elemen span untuk menampilkan teks opsi yang dipilih.
const roundToDisplay = document.getElementById("roundToDisplay");

// --- BAGIAN 2: DATA DAN STATE APLIKASI ---
// Komentar: Di sini kita mendefinisikan data utama yang digunakan oleh aplikasi,
// seperti daftar opsi pembulatan dan state (status) saat ini.

// Objek yang berisi semua pilihan pembulatan.
// 'key' (kunci) adalah teks yang ditampilkan (misal: 'Ribu').
// 'value' (nilai) adalah angka yang digunakan untuk perhitungan (misal: 1000).
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
// Mengubah kunci dari objek di atas menjadi sebuah array.
// Ini memudahkan kita untuk bernavigasi menggunakan indeks (angka urutan).
const optionKeys = Object.keys(roundingOptions);
// Variabel untuk menyimpan indeks (posisi) opsi yang sedang dipilih.
// Kita mulai dari 'Satuan' sebagai pilihan default.
let currentOptionIndex = optionKeys.indexOf("Satuan");

// --- BAGIAN 3: FUNGSI-FUNGSI UTAMA ---
// Komentar: Di sini adalah kumpulan fungsi yang menjadi "otak" dari aplikasi.

/**
 * Fungsi untuk menyesuaikan ukuran font pada elemen hasil.
 * Tujuannya agar angka yang sangat panjang tidak terpotong.
 */
function adjustResultFontSize() {
  const container = resultDisplay.parentElement; // Ambil elemen pembungkus
  const maxFontSize = 60; // Ukuran font maksimal dalam pixel (sesuai dengan class 'text-6xl')
  const minFontSize = 18; // Ukuran font minimal
  let currentFontSize = maxFontSize;

  // Reset ukuran font ke ukuran maksimal terlebih dahulu
  resultDisplay.style.fontSize = `${currentFontSize}px`;

  // Loop untuk mengecilkan font jika teks lebih lebar dari kontainernya
  // scrollWidth adalah lebar asli teks, clientWidth adalah lebar kontainer yang terlihat
  while (
    resultDisplay.scrollWidth > container.clientWidth &&
    currentFontSize > minFontSize
  ) {
    currentFontSize--; // Kurangi ukuran font 1px
    resultDisplay.style.fontSize = `${currentFontSize}px`;
  }
}

/**
 * Fungsi utama yang mengkoordinasikan pembaruan tampilan dan kalkulasi.
 * Dipanggil setiap kali ada perubahan input atau pilihan.
 */
function updateAndCalculate() {
  // Langkah 1: Perbarui teks opsi yang sedang dipilih di UI.
  roundToDisplay.textContent = optionKeys[currentOptionIndex];

  // Langkah 2: Ambil angka dari input.
  const number = parseFloat(numberInput.value);

  // Langkah 3: Jika input berisi angka yang valid, jalankan pembulatan.
  if (!isNaN(number)) {
    performRounding(number);
  } else {
    // Jika input kosong atau tidak valid, reset tampilan hasil.
    resultDisplay.textContent = "-";
    errorMessage.textContent = "";
    // Reset juga ukuran font ke default
    resultDisplay.style.fontSize = "";
  }
}

/**
 * Fungsi yang melakukan logika inti pembulatan angka.
 * @param {number} number - Angka yang akan dibulatkan.
 */
function performRounding(number) {
  // Ambil kunci dan nilai dari opsi yang sedang dipilih.
  const roundToKey = optionKeys[currentOptionIndex];
  const roundToValue = roundingOptions[roundToKey];

  // Kosongkan pesan error sebelumnya.
  errorMessage.textContent = "";

  let roundedNumber;
  // Logika pembulatan:
  if (roundToValue >= 1) {
    // Jika membulatkan ke bilangan bulat (Puluhan, Ratusan, dll.).
    // Rumus: Math.round(angka / pembulatan) * pembulatan
    roundedNumber = Math.round(number / roundToValue) * roundToValue;
  } else {
    // Jika membulatkan ke tempat desimal.
    // Hitung jumlah angka di belakang koma.
    const decimalPlaces = Math.round(-Math.log10(roundToValue));
    // Gunakan toFixed() untuk membulatkan ke jumlah desimal yang tepat.
    roundedNumber = parseFloat(number.toFixed(decimalPlaces));
  }

  // Tampilkan hasil dengan format lokal Indonesia (pemisah ribuan pakai titik).
  resultDisplay.textContent = roundedNumber.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20, // Izinkan banyak angka desimal
  });

  // Panggil fungsi untuk menyesuaikan ukuran font setelah hasil ditampilkan.
  adjustResultFontSize();
}

// --- BAGIAN 4: EVENT LISTENERS (PENDENGAR AKSI) ---
// Komentar: Bagian ini "menghidupkan" aplikasi dengan menunggu aksi dari pengguna.

// Aksi yang dijalankan pertama kali saat seluruh halaman HTML selesai dimuat.
document.addEventListener("DOMContentLoaded", updateAndCalculate);

// Aksi saat tombol panah atas (sebelumnya) diklik.
prevBtn.addEventListener("click", () => {
  currentOptionIndex--; // Kurangi indeks
  // Jika sudah di awal (indeks < 0), putar ke akhir array.
  if (currentOptionIndex < 0) {
    currentOptionIndex = optionKeys.length - 1;
  }
  updateAndCalculate(); // Perbarui tampilan dan hitung ulang.
});

// Aksi saat tombol panah bawah (berikutnya) diklik.
nextBtn.addEventListener("click", () => {
  currentOptionIndex++; // Tambah indeks
  // Jika sudah di akhir, putar kembali ke awal array (indeks 0).
  if (currentOptionIndex >= optionKeys.length) {
    currentOptionIndex = 0;
  }
  updateAndCalculate(); // Perbarui tampilan dan hitung ulang.
});

// Aksi yang berjalan setiap kali pengguna mengetik di kolom input.
numberInput.addEventListener("input", () => {
  const value = numberInput.value;
  // Cek jika input tidak valid (bukan angka, bukan kosong, bukan cuma tanda minus).
  if (isNaN(parseFloat(value)) && value !== "" && value !== "-") {
    errorMessage.textContent = "Input tidak valid.";
    resultDisplay.textContent = "-";
    resultDisplay.style.fontSize = ""; // Reset font
  } else if (value === "") {
    // Jika input dikosongkan, reset tampilan.
    resultDisplay.textContent = "-";
    errorMessage.textContent = "";
    resultDisplay.style.fontSize = ""; // Reset font
  } else {
    // Jika input valid, langsung hitung.
    updateAndCalculate();
  }
});
