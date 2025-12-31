import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { NormalizedLandmarkList } from '@mediapipe/hands';

export interface MediaPipeCallbacks {
  onResults: (results: {
    landmarks: NormalizedLandmarkList[];
    multiHandLandmarks: NormalizedLandmarkList[];
  }) => void;
}

export class MediaPipeService {
  private hands: Hands | null = null;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;

  async initialize(
    videoElement: HTMLVideoElement,
    callbacks: MediaPipeCallbacks
  ): Promise<void> {
    this.videoElement = videoElement;

    this.hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.hands.onResults((results) => {
      callbacks.onResults({
        landmarks: results.multiHandLandmarks || [],
        multiHandLandmarks: results.multiHandLandmarks || [],
      });
    });

    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        if (this.hands) {
          await this.hands.send({ image: this.videoElement! });
        }
      },
      width: 640,
      height: 480,
    });

    await this.camera.start();
  }

  async stop(): Promise<void> {
    if (this.camera) {
      await this.camera.stop();
      this.camera = null;
    }
    if (this.hands) {
      this.hands.close();
      this.hands = null;
    }
  }
}

