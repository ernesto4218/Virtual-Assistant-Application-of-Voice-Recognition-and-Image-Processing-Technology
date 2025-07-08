const STATUS = document.getElementById('status');
const VIDEO = document.getElementById('webcam');
const ENABLE_CAM_BUTTON = document.getElementById('enableCam');
const SAVE_MODEL_BTN = document.getElementById('saveData');
// const LOAD_MODEL_BUTTON = document.getElementById('load');
const RESET_BUTTON = document.getElementById('reset');
const TRAIN_BUTTON = document.getElementById('train');
const CAPTURE_BTN = document.getElementById('capture');
const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT = 224;
const STOP_DATA_GATHER = -1;
let CLASS_NAMES = [];

let model;
let mobilenet = undefined;
let gatherDataState = STOP_DATA_GATHER;
let videoPlaying = false;
let trainingDataInputs = [];
let trainingDataOutputs = [];
let examplesCount = [];
let predict = true;
let classify_product = {};


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

TRAIN_BUTTON.addEventListener('click', enableCam);
SAVE_MODEL_BTN.addEventListener('click', saveModel);
CAPTURE_BTN.addEventListener('click', gatherDataForClass);

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

async function loadModel() {
  model = await tf.loadLayersModel('/models/my_model2.json');
  console.log("Model loaded!");
}

async function loadClassNames() {
  const response = await fetch('/models/class_names2.json');
  CLASS_NAMES = await response.json();
  console.log("Class names loaded!", CLASS_NAMES);

if (!CLASS_NAMES.includes(classify_product.name)) {
    CLASS_NAMES.push(classify_product.name);
}
}

function logProgress(epoch, logs) {
  console.log('Data for epoch ' + epoch, logs);
}

async function trainAndPredict() {
  predict = false;
  tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);
  let outputsAsTensor = tf.tensor1d(trainingDataOutputs, 'int32');
  let oneHotOutputs = tf.oneHot(outputsAsTensor, CLASS_NAMES.length);
  let inputsAsTensor = tf.stack(trainingDataInputs);
  
  let results = await model.fit(inputsAsTensor, oneHotOutputs, {shuffle: true, batchSize: 5, epochs: 10, 
      callbacks: {onEpochEnd: logProgress} });
  
  outputsAsTensor.dispose();
  oneHotOutputs.dispose();
  inputsAsTensor.dispose();

  predict = true;
  predictLoop();
}


function predictLoop() {
  if (predict) {
    tf.tidy(function() {
      let videoFrameAsTensor = tf.browser.fromPixels(VIDEO).div(255);
      let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor,[MOBILE_NET_INPUT_HEIGHT, 
          MOBILE_NET_INPUT_WIDTH], true);

      let imageFeatures = mobilenet.predict(resizedTensorFrame.expandDims());
      let prediction = model.predict(imageFeatures).squeeze();
      let highestIndex = prediction.argMax().arraySync();
      let predictionArray = prediction.arraySync();

      STATUS.innerText = 'Prediction: ' + CLASS_NAMES[highestIndex] + ' with ' + Math.floor(predictionArray[highestIndex] * 100) + '% confidence';
    });

    window.requestAnimationFrame(predictLoop);
  }
}

async function loadMobileNetFeatureModel() {
    console.log(classify_product);
    const URL = 
        'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
    
    mobilenet = await tf.loadGraphModel(URL, {fromTFHub: true});
    STATUS.innerText = 'MobileNet v3 loaded successfully!';
    await loadModel();
    await loadClassNames();
    await enableCam();

    // Warm up the model by passing zeros through it once.
    tf.tidy(function () {
        let answer = mobilenet.predict(tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]));
        console.log(answer.shape);
    });

    const interval = setInterval(() => {
        if (videoPlaying){
            predict = true;
            predictLoop();
            clearInterval(interval); 


            model = tf.sequential();
            model.add(tf.layers.dense({inputShape: [1024], units: 128, activation: 'relu'}));
            model.add(tf.layers.dense({units: CLASS_NAMES.length, activation: 'softmax'}));
            model.summary();

            // Compile the model with the defined optimizer and specify a loss function to use.
            model.compile({
            // Adam changes the learning rate over time which is useful.
            optimizer: 'adam',
            // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
            // Else categoricalCrossentropy is used if more than 2 classes.
            loss: (CLASS_NAMES.length === 2) ? 'binaryCrossentropy': 'categoricalCrossentropy', 
            // As this is a classification problem you can record accuracy in the logs too!
            metrics: ['accuracy']  
            }); 

            CAPTURE_BTN.setAttribute('data-1hot', classify_product.id);

        }
    }, 1000);
}


function gatherDataForClass(event) {
    const button = event.currentTarget;
    const classNumber = parseInt(button.getAttribute('data-1hot'));

    // Reset count
    let captureCount = 0;
    const maxCaptures = 3;
    const captureIntervalMs = 200; // delay between frames

    const canvasContainer = document.getElementById('canvas_container');

    function captureFrame() {
        if (captureCount >= maxCaptures || !videoPlaying) {
        return; // Stop capturing
        }

        // Capture features
        let imageFeatures = tf.tidy(() => {
            let videoFrameAsTensor = tf.browser.fromPixels(VIDEO);
            let resizedTensorFrame = tf.image.resizeBilinear(
                videoFrameAsTensor,
                [MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH],
                true
            );
            let normalizedTensorFrame = resizedTensorFrame.div(255);
            return mobilenet.predict(normalizedTensorFrame.expandDims()).squeeze();
        });

        trainingDataInputs.push(imageFeatures);
        trainingDataOutputs.push(classNumber);

        examplesCount[classNumber]++;
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

async function saveModel(){
    await model.save('downloads://my_model');
    saveClassNamesToFile();   
}

function saveClassNamesToFile() {
  const blob = new Blob([JSON.stringify(CLASS_NAMES)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'class_names.json';
  a.click();
}


// Call the function immediately to start loading.
// loadMobileNetFeatureModel();

async function activateModel(){
  await loadModel();
  await loadClassNames();
  predict = true;
  predictLoop();
}