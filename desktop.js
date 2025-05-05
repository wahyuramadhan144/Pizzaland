const video = document.getElementById('camera');
const snapButton = document.getElementById('snap');
const previewContainer = document.getElementById('previewContainer');
const downloadButton = document.getElementById('downloadButton');
const frameContainer = document.getElementById('bingkaiFrame');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
context.drawImage(video, 0, 0, canvas.width, canvas.height);
const image = canvas.toDataURL('image/jpeg', 1.0);

const photoList = [];

const constraints = {
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  }
};

navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    const video = document.querySelector('video');
    video.srcObject = stream;
  })
  .catch(err => console.error("Error accessing media devices.", err));

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (error) {
    console.error('Tidak dapat mengakses kamera:', error);
    alert('Tidak dapat mengakses kamera. Mohon periksa izin di perangkat Anda.');
  }
}

function capturePhoto() {
  const canvas = document.createElement('canvas');
  
  const cropWidth = 330;
  const cropHeight = 300;

  const videoAspectRatio = video.videoWidth / video.videoHeight;
  const targetAspectRatio = cropWidth / cropHeight;

  let sx, sy, sw, sh;

  if (videoAspectRatio > targetAspectRatio) {
    sh = video.videoHeight;
    sw = sh * targetAspectRatio;
    sx = (video.videoWidth - sw) / 2;
    sy = 0;
  } else {
    sw = video.videoWidth;
    sh = sw / targetAspectRatio;
    sx = 0;
    sy = (video.videoHeight - sh) / 2;
  }

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  const context = canvas.getContext('2d');
  context.drawImage(video, sx, sy, sw, sh, 0, 0, cropWidth, cropHeight);

  photoList.push(canvas);

  if (photoList.length === 2) {
    combinePhotos();
  } else {
    alert('Foto berhasil diambil! Silakan ambil foto berikutnya.');
  }
}

let finalCanvas;

function combinePhotos() {
  finalCanvas = document.createElement('canvas');
  finalCanvas.width = 450;
  finalCanvas.height = 633;
  const ctx = finalCanvas.getContext('2d');

  ctx.drawImage(photoList[0], 60, 10, 330, 300);
  ctx.drawImage(photoList[1], 60, 310, 330, 300);

  const frameImage = new Image();
  frameImage.src = "assets/Frame5.png";
  frameImage.onload = () => {
    ctx.drawImage(frameImage, 0, 0, finalCanvas.width, finalCanvas.height);

    openPreviewPage();
  };
}

function openPreviewPage() {
  const imageData = finalCanvas.toDataURL('image/png');

  const newWindow = window.open();
  newWindow.document.write(`
    <html>
      <head>
        <title>Preview Foto</title>
        <link rel="stylesheet" href="kedua.css">
      </head>
      <body style="display: flex; align-items: center; justify-content: center; flex-direction: column; font-family: Arial, sans-serif;">
        <img src="${imageData}" alt="Hasil Foto" style="max-width: 25%; height: auto; margin-bottom: 10px; margin-left: 80px;"/>
        <div class="button-container">
    <div class="button-container">
    <a href="${imageData}" download="hasil-polaroid.png">
        <button class="download-button"><img src="assets/frame 8.png" alt="Download"></button>
    </a>
    <button onclick="window.close()" class="close-button"><img src="assets/Close.png" alt="Close" width="50" height="50"></button>
    </div>
        <script>
        // Menambahkan gambar latar pada elemen body
        document.body.style.backgroundImage = "url('assets/Desktop 1.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
    </script>

      </body>
    </html>
  `);
  newWindow.document.close();
}


function downloadPhoto() {
  const downloadLink = document.createElement('a');
  downloadLink.href = finalCanvas.toDataURL('image/png');
  downloadLink.download = 'Sweet Happiness Pizzaland.png';
  downloadLink.click();
}

function startCountdownAndCapture() {
  let counter = 3;
  const countdownElement = document.getElementById('countdown');
  countdownElement.style.display = 'block';
  countdownElement.textContent = counter;

  const interval = setInterval(() => {
    counter--;
    if (counter === 0) {
      clearInterval(interval);
      countdownElement.style.display = 'none';
      capturePhoto();
    } else {
      countdownElement.textContent = counter;
    }
  }, 1000);
}

window.addEventListener('load', startCamera);
snapButton.addEventListener('click', startCountdownAndCapture);
downloadButton.addEventListener('click', downloadPhoto);