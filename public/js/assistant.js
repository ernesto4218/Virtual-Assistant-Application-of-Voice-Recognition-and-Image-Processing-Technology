const el = document.getElementById('config-data');
const allconfig = JSON.parse(el.dataset.allconfig || '{}');

const listening_indicator = document.getElementById('listening_indicator');
const Interim = document.getElementById('Interim');
const blob = document.getElementById("blob");
const confirmSound = new Audio('sounds/confirm.mp3');
const infoSound = new Audio('sounds/info.mp3');
const cameracontainer = document.getElementById('cameracontainer');
const productInfoContainer = document.getElementById('productInfoContainer');
let audioReady = false;
let cameramode = false;
let isRecognizing = false;
let user_question;

const greetings = ['hello', 'hey', 'hi'];
const assistantGreetings = [
  "Hi there! I'm your friendly virtual assistant, and I'm really glad you're here. What can I help you with today?",
  "Hello! It's great to see you. I'm your virtual assistant, ready to support you with anything you need—just let me know!",
  "Hey! I'm your assistant, always here and happy to help. What can I do for you today?",
  "Hi! I'm your virtual assistant, and I'm here to make things easier for you. How can I assist you right now?",
  "Hello there! I'm excited to help you today. If you have any questions or need anything at all, just ask!",
  "Good day! I'm your assistant, and it's my job to make sure you get the help you need. How can I be of service?",
  "Hey there! I'm your helpful assistant, always ready to lend a hand. What can I help you with today?",
  "Hi! I'm right here if you need guidance, answers, or just a little support. How can I assist you?",
  "Hello! I'm your friendly assistant and I'm here to walk with you through whatever you need. What can I do for you today?",
  "Hi friend! I'm your virtual helper, here to make things smoother and easier. Let me know what you need!",
  "Hey! Thanks for stopping by. I'm your assistant, and I'm here to help in any way I can. How can I assist?",
  "Hello again! I'm right here, ready to help with anything you might need. How can I be helpful today?",
  "Hi there! It's always a pleasure to help. Just let me know what you're looking for, and I’ll take care of the rest!",
  "Hi! Your assistant is ready and waiting. What do you need help with today?",
  "Hello! I'm here to guide you, assist you, and answer your questions—just say the word!"
];

function playInteract(){
    infoSound.currentTime = 0;
    infoSound.play();
}

document.body.onclick = function (){
    playInteract();
    resumeRecognition();
}

// Setup Speech Recognition
let recognition;
let isPaused = false;

if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    let lastInterimUpdate = Date.now();
    let silenceTimeout;
    let isWaitingForResponse = false;

    recognition.onresult = async function (event) {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcriptSegment = event.results[i][0].transcript.trim().toLowerCase();

            if (event.results[i].isFinal) {
                console.log("Final:", transcriptSegment);
                user_question = transcriptSegment;
                Interim.textContent = transcriptSegment;
                stopPulsing();

                if (greetings.some(greet => new RegExp(`\\b${greet}\\b`, 'i').test(transcriptSegment))) {
                    const randomGreeting = assistantGreetings[Math.floor(Math.random() * assistantGreetings.length)];
                    confirmSound.play();
                    speakWithVoice(randomGreeting, "Google UK English Female");
                    typeCaption(randomGreeting);    
                    pauseRecognition();    
                } else if (transcriptSegment && !isWaitingForResponse) {
                    isWaitingForResponse = true;
                    pauseRecognition();
                    confirmSound.play();

                    const start = Date.now();

                    // try {
                    //   const response = await fetch('/api/getconfig', {
                    //     method: 'POST',
                    //     headers: {
                    //       'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify({}) // if your endpoint doesn't need any payload, you can send an empty object
                    //   });

                    //   if (!response.ok) {
                    //     throw new Error(`HTTP error! status: ${response.status}`);
                    //   }

                    //   const data = await response.json();
                    //   console.log('Config fetched:', data);

                    //   const GEMINI_API_KEY = "AIzaSyDv7QyjafeOqA9wlSX1GtRkh9rkBEQyVTM";
                    //   const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

                    //   const payload = {
                    //     systemInstruction: {
                    //       role: "system",
                    //       parts: [{
                    //         text: `${data.instructions}. Use only items available with categories and prices in Philippine pesos ₱00: ${data.productsString}. Topics you are not allowed to talk about: ${data.restrictions}.`
                    //       }]
                    //     },
                    //     contents: [
                    //       {
                    //         role: "user",
                    //         parts: [{ text: `The customer question: ${transcriptSegment}` }]
                    //       }
                    //     ],
                    //     // optional: generation config
                    //     generationConfig: {
                    //       maxOutputTokens: 200,
                    //       temperature: 0.2
                    //     }
                    //   };

                    //   try {
                    //     const r = await fetch(GEMINI_URL, {
                    //       method: "POST",
                    //       headers: {
                    //         "Content-Type": "application/json",
                    //         "x-goog-api-key": GEMINI_API_KEY
                    //       },
                    //       body: JSON.stringify(payload)
                    //     });

                    //     if (!r.ok) {
                    //       const errBody = await r.text();
                    //       outEl.textContent = `HTTP ${r.status} — ${r.statusText}\n\n${errBody}`;
                    //       return;
                    //     }

                    //     const data = await r.json();
                    //     const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? JSON.stringify(data, null, 2);

                    //     console.log(data);
                    //     console.log(text);

                    //     console.log("Response in", Date.now() - start, "ms:", data);
                    //     speakWithVoice(text, "Google UK English Female");
                    //     typeCaption(text);     
                    //     isWaitingForResponse = false;

                    //     try {
                    //       const response = await fetch('/api/record_question', {
                    //         method: 'POST',
                    //         headers: {
                    //           'Content-Type': 'application/json'
                    //         },
                    //         body: JSON.stringify({response: text, question: transcriptSegment})
                    //       });

                    //       if (!response.ok) {
                    //         throw new Error(`HTTP error! status: ${response.status}`);
                    //       }

                    //       const data = await response.json();
                    //       console.log('Config fetched:', data);
                    //     } catch (error) {
                    //       console.error('Error fetching config:', error);
                    //     }
                        
                    //   } catch (err) {
                    //     console.log(err);
                    //     console.log(err.message);
                    //     // outEl.textContent = "Network or CORS error:\n\n" + err.message;
                    //   }                      
                    // } catch (error) {
                    //   console.error('Error fetching config:', error);
                    // }
                    
                    
                    fetch('/api/ask', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ question: transcriptSegment })
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log("Response in", Date.now() - start, "ms:", data);
                        speakWithVoice(data.message, "Google UK English Female");
                        typeCaption(data.message);     
                        isWaitingForResponse = false;
                    })
                    .catch(err => {
                        console.error('Error:', err);
                        isWaitingForResponse = false;
                    });
                }
            } else {
                interimTranscript += transcriptSegment + ' ';
            }
        }

        if (interimTranscript) {
            Interim.textContent = interimTranscript.trim();
            lastInterimUpdate = Date.now();

            clearTimeout(silenceTimeout);
            silenceTimeout = setTimeout(() => {
                console.log("Detected silence. Forcing final result...");
                recognition.stop(); // Force finalize
            }, 1500); // 1.5s of silence = auto-final
        }
    };


    recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);

    if (event.error === "no-speech" || event.error === "network" || event.error === "aborted") {
        resumeRecognition(); // Only resume for specific recoverable errors
    }
    };

    recognition.onend = () => {
      isRecognizing = false;
      console.log("Speech recognition ended");
      if (!isPaused) {
        setTimeout(() => {
          try {
            resumeRecognition();
            console.log("Restarting recognition...");
          } catch (err) {
            console.error("Error restarting recognition:", err);
          }
        }, 1000);
      }
    };

    recognition.onstart = () => {
      isRecognizing = true;
      console.log("Speech recognition started");
    };

    recognition.start();
  showElement(listening_indicator);

} else {
  hideElement(listening_indicator);
  alert("Sorry, your device doesn't support Speech Recognition.");
}

// Pause function
function pauseRecognition() {
  if (recognition) {
    isPaused = true;
    recognition.stop(); // Triggers onend, but won't restart
    hideElement(listening_indicator);
    hideproduct();
    console.log("Recognition paused");
  }
}

// Resume function
function resumeRecognition() {
  if (!cameramode && !isRecognizing) {
    
    cameracontainer.classList.remove('flex');
    cameracontainer.classList.add('hidden');
    
    productInfoContainer.classList.remove('flex');
    productInfoContainer.classList.add('hidden');
    
    stopPulsing();
    infoSound.play();

    speechSynthesis.cancel();
    isPaused = false;
    try {
      recognition.start();
      showElement(listening_indicator);
      console.log("Recognition resumed");
      handDetectedOnce = false;
    } catch (e) {
      console.warn("Could not start recognition:", e);
    }
  } else {
    console.log(cameramode);
    console.log(isRecognizing);
    console.warn("Could not start recognition:");
  }
}

function typeCaption(text, speed = 50) {
    // Remove all [text] patterns from input
    text = text.replace(/\[.*?\]/g, '');

    const caption = document.getElementById('caption');
    caption.innerHTML = '';
    caption.style.opacity = 0.2;
    caption.style.transition = 'opacity 0.5s ease-in-out';

    Interim.textContent = '';
    let index = 0;

    const interval = setInterval(() => {
        const char = text.charAt(index) === ' ' ? '&nbsp;' : text.charAt(index);
        caption.innerHTML += char;

        if (index === 0) {
            caption.style.opacity = 1;
        }

        index++;
        if (index >= text.length) {
            clearInterval(interval);
        }
    }, speed);
}


// voice
function loadVoices() {
  return new Promise(resolve => {
    let voices = speechSynthesis.getVoices();
    if (voices.length) {
        console.log(voices);
      resolve(voices);
    } else {
      speechSynthesis.onvoiceschanged = () => {
        resolve(speechSynthesis.getVoices());
      };
    }
  });
}

async function speakWithVoice(text, voiceName) {
  await loadVoices();
  return new Promise((resolve) => {
    startPulsing();

    let voices = speechSynthesis.getVoices();
    let voice = voices.find(v => v.name === voiceName);
    if (!voice) {
      console.warn('Voice not found:', voiceName);
      voice = voices[0];
    }
    let msg = new SpeechSynthesisUtterance(text);
    msg.voice = voice;
    msg.onend = () => {
      console.log('Speech has ended.');
      
      if (text.includes('[open camera]')){
        startCamera();
      } else {
        resumeRecognition();
      }

      stopPulsing();
      resolve();
      
    };

    speechSynthesis.speak(msg);
  });
}


// blob control
let pulsingInterval = null;

function startPulsing() {
    blob.classList.remove("animate-float");
    if (pulsingInterval) return;

    pulsingInterval = setInterval(() => {
        const scale = 1 + Math.random() * 0.1 + 0.1; // 1.1 to 1.2
        blob.style.transition = "transform 0.3s ease";
        blob.style.transform = `scale(${scale})`;
        createPulseRing();
        // createPulseRing();
        // console.log('ring');
        setTimeout(() => {
            blob.style.transition = "transform 0.3s ease";
            blob.style.transform = "scale(1)";
        }, 250);
    }, 500);
}

function stopPulsing() {
    clearInterval(pulsingInterval);
    pulsingInterval = null;
    blob.style.transition = "transform 0.5s ease";
    blob.style.transform = "scale(1)";
    blob.classList.remove("animate-float");
    setTimeout(() => {
        blob.classList.add("animate-float");
    }, 500);
}

function createPulseRing() {
    const ring = document.createElement('div');
    ring.className = 'pulse-ring';
    Object.assign(ring.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: 'black',
        opacity: '0.1',
        transform: 'scale(1)',
        pointerEvents: 'none',
        transition: 'transform 1s ease-out, opacity 2s ease-out',
        zIndex: 1
    });

    blob.appendChild(ring);

    // Start animation on next frame
    requestAnimationFrame(() => {
        ring.style.transform = 'scale(1.8)';
        ring.style.opacity = '0';
    });

    // Remove the ring after animation
    setTimeout(() => {
        ring.remove();
    }, 2000);
}

// Utility functions
function showElement(el) {
  el.classList.remove('hidden');
  el.classList.add('flex');
}

function hideElement(el) {
  el.classList.add('hidden');
}


// camera

async function startCamera() {
  if (!cameramode){
    pauseRecognition();
    cameracontainer.classList.remove('hidden');
    cameracontainer.classList.add('flex');
    cameramode = true;
    handDetectedEnabled = true;

    try {
        const video = document.getElementById('cameraFeed');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;

        setTimeout(async () => {
          await speakWithVoice('Please place the object in view of the camera and ensure it’s clearly visible. I’ll capture the image shortly to assist you better.', "Google UK English Female");
          startCountdownAndCapture();
        }, 2000);
    } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Unable to access the camera. Please check permissions.");
        handDetectedEnabled = false;

    }
  }
 
}

function startCountdownAndCapture() {
    const countdownContainer = document.getElementById('captureTimercontainer');
    const timerText = document.getElementById('timerText');
    handDetectedEnabled = true;

    let countdown = 3;
    countdownContainer.classList.remove('hidden');
    countdownContainer.classList.add('flex');

    timerText.textContent = countdown;

    const interval = setInterval(() => {
        countdown--;
        timerText.textContent = countdown;
        infoSound.play();

        if (countdown === 0) {
            confirmSound.play();
            clearInterval(interval);
            countdownContainer.classList.add('hidden');
            countdownContainer.classList.remove('flex');
            captureCamera(); // Capture image after countdown
        }
    }, 1000);
}

async function captureCamera() {
  handDetectedEnabled = true;

  const active_model = allconfig.find(conf => conf.name === 'active_model')?.value || "";
  const method = allconfig.find(conf => conf.name === 'recognition')?.value || "";

  const capturedImg = document.getElementById('capturedImg');

  cameracontainer.classList.remove('flex');
  cameracontainer.classList.add('hidden');
  
  productInfoContainer.classList.remove('hidden');
  productInfoContainer.classList.add('flex');

  const video = document.getElementById('cameraFeed');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageDataURL = canvas.toDataURL('image/jpeg', 0.6); // quality 60%  capturedImg.src = imageDataURL;
  capturedImg.src = imageDataURL;
  console.log("Captured Image:", imageDataURL);

  // 🗣️ Wait for the voice before analyzing
  await speakWithVoice(
    'Image captured. Analyzing for the closest store match. One moment, please.',
    "Google UK English Female"
  );

  confirmSound.play();

  try {
    if (method === 'gemini'){
      
      // const result = await analyzeImage(imageDataURL, user_question);
      // console.log(result);
      const res = await fetch('/api/processimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ img: imageDataURL, question: user_question })
      });

      const data = await res.json();

      console.log(data);

      infoSound.play();
      await speakWithVoice(data.message, "Google UK English Female");
      cameramode = false;
      typeCaption(data.message);
      resumeRecognition();

      if (data.item){
        console.log(data.item);
        showproduct(data.item);
      }
    } else if (method === 'ml'){  
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ img: imageDataURL})
      });

      const data = await res.json();

      console.log(data);

      if (data.status === 'success'){

        if (data.prediction.confidence < 0.50){
            infoSound.play();
            await speakWithVoice(`Apologies, I wasn’t able to identify the product. Could you please check if the item is clearly visible?`, "Google UK English Female");
            cameramode = false;
            typeCaption(`Apologies, I wasn’t able to identify the product. Could you please check if the item is clearly visible?`);
            resumeRecognition();
            handDetectedEnabled = true;
        } else {
          const GEMINI_API_KEY = "AIzaSyDv7QyjafeOqA9wlSX1GtRkh9rkBEQyVTM";
          const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

          const payload = {
            contents: [
              {
                role: "user",
                parts: [{ text: question }]
              }
            ],
            // optional: generation config
            generationConfig: {
              maxOutputTokens: 200,
              temperature: 0.2
            }
          };

          try {
            const r = await fetch(GEMINI_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": GEMINI_API_KEY
              },
              body: JSON.stringify(payload)
            });

            if (!r.ok) {
              const errBody = await r.text();
              outEl.textContent = `HTTP ${r.status} — ${r.statusText}\n\n${errBody}`;
              return;
            }

            const data = await r.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? JSON.stringify(data, null, 2);

            console.log(data);
            console.log(text);

          } catch (err) {
            outEl.textContent = "Network or CORS error:\n\n" + err.message;
          }
          
          // const res = await fetch('/api/ask', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify({question: data.prediction.prediction})
          // });

          // const data2 = await res.json();
          // console.log(data2);
          // if (data2.success){
          //   infoSound.play();
          //   await speakWithVoice(data2.message, "Google UK English Female");
          //   cameramode = false;
          //   typeCaption(data2.message);
          //   resumeRecognition();
          // } else {
          //   infoSound.play();
          //   await speakWithVoice("Something went wrong. Please try again", "Google UK English Female");
          //   cameramode = false;
          //   typeCaption("Something went wrong. Please try again");
          //   resumeRecognition();
          // }
          
        }
        
      } else {
        infoSound.play();
        await speakWithVoice("Something went wrong. Please try again", "Google UK English Female");
        cameramode = false;
        typeCaption("Something went wrong. Please try again");
        resumeRecognition();
      }
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

const checkboxes = document.querySelectorAll('.recognition-toggle');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        checkboxes.forEach(cb => {
          if (cb !== checkbox) cb.checked = false;
        });
      }
    });
});

let handDetectedOnce = false; // flag to track detection
let handDetectedEnabled = true;

async function initCamera() {
  cameracontainer.classList.remove('flex');
  cameracontainer.classList.add('hidden');
  try {
    const video = document.getElementById('cameraFeed');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults((results) => {
      const handIsVisible = results.multiHandLandmarks.length > 0;

      if (handIsVisible && !handDetectedOnce && handDetectedEnabled) {
        console.log('✋ Hand detected (first time)!');

        cameracontainer.classList.remove('hidden');
        cameracontainer.classList.add('flex');

        startCamera(); // call your camera-start logic here
        handDetectedOnce = true;
        pauseRecognition();    
      }

      // // Optional: hide if hand is gone (but won't re-trigger start)
      // if (!handIsVisible) {
      //   cameracontainer.classList.remove('flex');
      //   cameracontainer.classList.add('hidden');
      // }
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 480
    });

    camera.start();
  } catch (error) {
    console.error('❌ Error accessing camera:', error);
    alert('Unable to access the camera. Please check permissions.');
  }
}

async function analyzeImage(imageDataURL, userQuestion) {
  const question = userQuestion || "What is in this image?";

  try {
    // Fetch config from backend
    const configResp = await fetch("/api/getconfig", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const configData = await configResp.json();

    const prompt = `
      You are tasked with identifying a single object in an image.
      ...
      General Merchandise Items:
      ${configData.productsString}
      ---
      Topics you are not allowed to respond:
      ${configData.restrictions}
      ---
      Customer question: ${question}
    `;

    const GEMINI_API_KEY = "AIzaSyDv7QyjafeOqA9wlSX1GtRkh9rkBEQyVTM";
    const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    // Front-end uses inline_data for the image
    const bodyPayload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageDataURL.split(",")[1] // strip "data:image/jpeg;base64,"
              }
            },
            { text: prompt }
          ]
        }
      ]
    };

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`HTTP ${response.status} — ${errBody}`);
      return;
    }

    const apiResponse = await response.json();
    const text = apiResponse?.candidates?.[0]?.content?.[0]?.text ?? "";

    console.log(apiResponse);
    console.log(response);

    console.log("Gemini response:", text);
    return text;

  } catch (err) {
    console.error("Error analyzing image:", err);
    return null;
  }
}


initCamera();


function showproduct(data) {
  console.log(data);

  const productlistcontainer = document.querySelector('.product-list-container');
  const productInfoContainer = productlistcontainer.querySelector('.max-w-sm'); // FIXED

  productlistcontainer.classList.remove('hidden');
  productlistcontainer.classList.add('flex');

  const name = productlistcontainer.querySelector('.product-name');
  const description = productlistcontainer.querySelector('.product-description');
  const image = productlistcontainer.querySelector('.product-image');
  const price = productlistcontainer.querySelector('.product-price');

  name.textContent = data.name;
  description.textContent = data.description;
  price.textContent = "₱" + data.price;

  const allImagePaths = data.image_path.split(', ');
  const firstImagePath = allImagePaths[0].trim();
  image.src = firstImagePath;
}


function hideproduct(){
  const productlistcontainer = document.querySelector('.product-list-container');
  productlistcontainer.classList.remove('flex');
  productlistcontainer.classList.add('hidden');
}