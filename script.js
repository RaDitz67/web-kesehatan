function hitungBMI() {
  const berat = parseFloat(document.getElementById("berat")?.value);
  const tinggiCm = parseFloat(document.getElementById("tinggi")?.value);
  const hasil = document.getElementById("hasilBMI");

  if (!hasil) return;

  if (!berat || !tinggiCm) {
    hasil.innerText = "Masukkan berat dan tinggi badan terlebih dahulu.";
    return;
  }

  const tinggiM = tinggiCm / 100;
  const bmi = berat / (tinggiM * tinggiM);

  let kategori = "";

  if (bmi < 18.5) {
    kategori = "Berat badan kurang";
  } else if (bmi < 25) {
    kategori = "Berat badan normal";
  } else if (bmi < 30) {
    kategori = "Berat badan berlebih";
  } else {
    kategori = "Obesitas";
  }

  hasil.innerText = `BMI kamu ${bmi.toFixed(1)} - ${kategori}.`;
}

function hitungAir() {
  const berat = parseFloat(document.getElementById("beratAir")?.value);
  const hasil = document.getElementById("hasilAir");

  if (!hasil) return;

  if (!berat) {
    hasil.innerText = "Masukkan berat badan terlebih dahulu.";
    return;
  }

  const kebutuhanLiter = (berat * 30) / 1000;
  hasil.innerText = `Perkiraan kebutuhan air kamu sekitar ${kebutuhanLiter.toFixed(1)} liter per hari.`;
}

function cekTidur() {
  const tidur = document.getElementById("jamTidur")?.value;
  const hasil = document.getElementById("hasilTidur");

  if (!hasil) return;

  if (!tidur) {
    hasil.innerText = "Pilih durasi tidur terlebih dahulu.";
    return;
  }

  if (tidur === "kurang") {
    hasil.innerText = "Tidur kamu masih kurang. Usahakan tidur 7-8 jam per malam.";
  } else if (tidur === "cukup") {
    hasil.innerText = "Durasi tidur kamu sudah ideal. Pertahankan kebiasaan ini.";
  } else {
    hasil.innerText = "Tidur terlalu lama bisa membuat tubuh lemas. Jaga pola tidur tetap seimbang.";
  }
}

async function kirimChat() {
  const input = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");

  if (!input || !chatMessages) return;

  const pesan = input.value.trim();

  if (pesan === "") return;

  const userBubble = document.createElement("div");
  userBubble.className = "user-message";
  userBubble.innerText = pesan;
  chatMessages.appendChild(userBubble);

  input.value = "";

  const loadingBubble = document.createElement("div");
  loadingBubble.className = "bot-message";
  loadingBubble.innerText = "SehatBot sedang menjawab...";
  chatMessages.appendChild(loadingBubble);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch("http://localhost:5678/webhook/sehatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: pesan,
        user: "user-website-001"
      })
    });

    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    const data = await response.json();

    loadingBubble.innerText =
      data.answer ||
      data.response ||
      data.text ||
      "Maaf, bot belum memberikan jawaban.";
  } catch (error) {
    loadingBubble.innerText =
      "Maaf, terjadi error saat menghubungkan ke AI. Pastikan n8n sedang Listening dan URL webhook benar.";

    console.error("Chat AI Error:", error);
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.addEventListener("keydown", function (event) {
  const input = document.getElementById("userInput");

  if (event.key === "Enter" && input && document.activeElement === input) {
    kirimChat();
  }
});