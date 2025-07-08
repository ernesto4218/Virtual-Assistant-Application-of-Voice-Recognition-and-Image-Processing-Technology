const STATUS = document.getElementById('status');
const VIDEO = document.getElementById('webcam');
const ENABLE_CAM_BUTTON = document.getElementById('enableCam');
const SAVE_MODEL_BTN = document.getElementById('saveData');
const RESET_BUTTON = document.getElementById('reset');
const TRAIN_BUTTON = document.getElementById('train');
const CAPTURE_BTN = document.getElementById('capture');

ENABLE_CAM_BUTTON.addEventListener('click', enableCam);
async function enableCam() {
  if (hasGetUserMedia()) {
    // getUsermedia parameters.
    const constraints = {
      video: true,
      width: 640, 
      height: 480 
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      VIDEO.srcObject = stream;
      VIDEO.addEventListener('loadeddata', function() {
        videoPlaying = true;
        ENABLE_CAM_BUTTON.classList.add('removed');
        return true;
      });
    });
  } else {
    return false;
    console.warn('getUserMedia() is not supported by your browser');
  }
}

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

CAPTURE_BTN.addEventListener('click', gatherDataForClass);

function gatherDataForClass(event) {
    const button = event.currentTarget;

    // Reset count
    let captureCount = 0;
    const maxCaptures = 3;
    const captureIntervalMs = 200; // delay between frames

    const canvasContainer = document.getElementById('canvas_container');

    function captureFrame() {
        if (captureCount >= maxCaptures || !videoPlaying) {
            return; // Stop capturing
        }

        captureCount++;

        // Add canvas snapshot
        if (canvasContainer && videoPlaying) {
            const canvas = document.createElement('canvas');
            canvas.width = VIDEO.videoWidth;
            canvas.height = VIDEO.videoHeight;
    
            canvas.style.width = '50px';
            canvas.style.height = '50px';


            canvas.style.border = '1px solid #ccc';
            canvas.style.marginRight = '8px';
            canvasContainer.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            ctx.drawImage(VIDEO, 0, 0, canvas.width, canvas.height);
        }

        // Schedule next capture
        if (captureCount < maxCaptures) {
            setTimeout(captureFrame, captureIntervalMs);
        }
    }

    // Start capture immediately on click
    captureFrame();
}
