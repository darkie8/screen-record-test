const { desktopCapturer, remote } = require('electron');

const { writeFile } = require('fs');

const { dialog, Menu } = remote;

const VideoStreamMerger = require('video-stream-merger');
const webcamStreamPromise = navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
      width: { min: 720, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 800, max: 1080 },
      aspectRatio: (16 / 9),
      frameRate: { max: 60 }
    },
    audio: true
  });
  this.merger = new VideoStreamMerger({ width: 1920, height: 1080 });
// Global state
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

// Buttons
const videoElement = document.querySelector('video');

const startBtn = document.getElementById('startBtn');
startBtn.onclick = e => {
  mediaRecorder.start();
  startBtn.classList.add('is-danger');
  startBtn.innerText = 'Recording';
};

const stopBtn = document.getElementById('stopBtn');

stopBtn.onclick = e => {
  mediaRecorder.stop();
  startBtn.classList.remove('is-danger');
  startBtn.innerText = 'Start';
};

const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;

// Get the available video sources
async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      };
    })
  );


  videoOptionsMenu.popup();
}

// Change the videoSource window to record
async function selectSource(source) {

  videoSelectBtn.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720,
        maxAspectRatio: (16 / 9),
        maxFrameRate: 60
        
      }
    //   ,
    //   width: { min: 720, ideal: 1280, max: 1920 },
    //   height: { min: 480, ideal: 800, max: 1080 },
    //   aspectRatio: (16 / 9)
    }
  };

  // Create a Stream
  const stream = await navigator.mediaDevices
    .getUserMedia(constraints);
    this.merger.addStream(stream, {
        x: 0, // position of the topleft corner
        y: 0,
        width: (this.merger).width,
        height: (this.merger).height,
        mute: true // we don't want sound from the screen (if there is any)
      });
    const webcamStream = await webcamStreamPromise;
      this.merger.addStream(webcamStream, {
        x: 0,
        y: (this.merger).height - 300,
        width: 300 * (16 / 9),
        height: 300,
        mute: false
      });
      this.merger.start();
  // Preview the source in a video element
  videoElement.srcObject = merger.result;
  videoElement.play();

  // Create the Media Recorder
  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(merger.result, options);

  // Register Event Handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;

  // Updates the UI
}

// Captures all recorded chunks
function handleDataAvailable(e) {
  console.log('video data available');
  recordedChunks.push(e.data);
}

// Saves the video file on stop
async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });

  const buffer = Buffer.from(await blob.arrayBuffer());

  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  });

  if (filePath) {
    writeFile(filePath, buffer, () => console.log('video saved successfully!'));
  }

}