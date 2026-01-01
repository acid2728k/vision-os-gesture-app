import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { NormalizedLandmarkList } from "@mediapipe/hands";

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

    console.log("Initializing MediaPipe Hands...");

    // Check camera availability first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop immediately, we just needed to check
      console.log("Camera access granted");
    } catch (err) {
      console.error("Camera access denied or unavailable:", err);
      throw new Error(
        "Не удалось получить доступ к камере. Убедитесь, что вы разрешили доступ к камере в настройках браузера."
      );
    }

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

    console.log("Creating Camera instance...");
    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        if (this.hands) {
          await this.hands.send({ image: this.videoElement! });
        }
      },
      width: 1280,
      height: 720,
    });

    console.log("Starting camera...");
    // Add timeout for camera start
    const startPromise = this.camera.start();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () =>
          reject(
            new Error(
              "Таймаут запуска камеры. Проверьте, что камера не используется другим приложением."
            )
          ),
        10000
      );
    });

    await Promise.race([startPromise, timeoutPromise]);
    console.log("Camera started successfully");

    // Verify video element has stream
    if (this.videoElement.srcObject) {
      console.log("Video element has stream attached");
      console.log(
        "Video dimensions:",
        this.videoElement.videoWidth,
        "x",
        this.videoElement.videoHeight
      );
    } else {
      console.warn("Video element has no stream after camera start!");
    }
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
