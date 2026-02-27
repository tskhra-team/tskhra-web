import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

type LivenessCameraProps = {
  onSuccess: (file: File) => void;
};

type Step =
  | "LOADING"
  | "CENTER"
  | "TURN_LEFT"
  | "CENTER_AFTER_LEFT"
  | "TURN_RIGHT"
  | "CENTER_AFTER_RIGHT"
  | "BLINK"
  | "DONE";

export default function LivenessCamera({ onSuccess }: LivenessCameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const [step, setStep] = useState<Step>("LOADING");
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const requestRef = useRef<number | undefined>(undefined);

  // 1. Инициализация MediaPipe
  useEffect(() => {
    const initVision = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
        },
      );
      setStep("CENTER");
    };
    initVision();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (faceLandmarkerRef.current) faceLandmarkerRef.current.close();
    };
  }, []);

  // 2. Функция конвертации Base64 -> File
  const captureAndSubmit = useCallback(async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    // Конвертируем base64 в Blob, а затем в File
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const file = new File([blob], "liveness_face.jpg", { type: "image/jpeg" });

    setStep("DONE");
    onSuccess(file); // Отдаем файл в твою форму!
  }, [onSuccess]);

  // 3. Главный цикл проверки (работает каждый кадр)
  const detectFace = useCallback(() => {
    if (
      !faceLandmarkerRef.current ||
      !webcamRef.current?.video ||
      step === "DONE"
    )
      return;

    const video = webcamRef.current.video;
    if (video.currentTime > 0) {
      const results = faceLandmarkerRef.current.detectForVideo(
        video,
        performance.now(),
      );

      if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
        const shapes = results.faceBlendshapes[0].categories;
        const blinkLeft =
          shapes.find((s) => s.categoryName === "eyeBlinkLeft")?.score || 0;
        const blinkRight =
          shapes.find((s) => s.categoryName === "eyeBlinkRight")?.score || 0;

        // Для поворота головы берем координаты носа и скул (landmarks)
        const landmarks = results.faceLandmarks[0];
        const nose = landmarks[1];
        const leftCheek = landmarks[234];
        const rightCheek = landmarks[454];

        // Логика переключения шагов (with less sensitive thresholds)
        setStep((currentStep) => {
          if (currentStep === "CENTER") {
            const isCentered =
              Math.abs(nose.x - (leftCheek.x + rightCheek.x) / 2) < 0.03;
            if (isCentered) return "TURN_LEFT";
          }
          if (
            currentStep === "TURN_LEFT" &&
            nose.x < (leftCheek.x + rightCheek.x) / 2 - 0.15
          ) {
            return "CENTER_AFTER_LEFT";
          }
          if (currentStep === "CENTER_AFTER_LEFT") {
            const isCentered =
              Math.abs(nose.x - (leftCheek.x + rightCheek.x) / 2) < 0.03;
            if (isCentered) return "TURN_RIGHT";
          }
          if (
            currentStep === "TURN_RIGHT" &&
            nose.x > (leftCheek.x + rightCheek.x) / 2 + 0.15
          ) {
            return "CENTER_AFTER_RIGHT";
          }
          if (currentStep === "CENTER_AFTER_RIGHT") {
            const isCentered =
              Math.abs(nose.x - (leftCheek.x + rightCheek.x) / 2) < 0.03;
            if (isCentered) return "BLINK";
          }
          if (currentStep === "BLINK" && blinkLeft > 0.5 && blinkRight > 0.5) {
            // Wait 0.5 seconds for eyes to open before capturing
            setTimeout(() => {
              captureAndSubmit();
            }, 200);
            return "DONE";
          }
          return currentStep;
        });
      }
    }

    requestRef.current = requestAnimationFrame(detectFace);
  }, [step, captureAndSubmit]);

  useEffect(() => {
    if (step !== "LOADING" && step !== "DONE") {
      requestRef.current = requestAnimationFrame(detectFace);
    }
  }, [step, detectFace]);

  const instructions = {
    LOADING: "Loading AI...",
    CENTER: "Look straight to camera",
    TURN_LEFT: "Turn head right", //its not a bug, it should be like that beacuse camera mirroring you
    CENTER_AFTER_LEFT: "Look straight to camera",
    TURN_RIGHT: "Turn head left",
    CENTER_AFTER_RIGHT: "Look straight to camera",
    BLINK: "Blink",
    DONE: "Success!",
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative rounded-xl overflow-hidden border-4 border-green-500 w-full max-w-sm">
        <Webcam
          ref={webcamRef}
          mirrored={true}
          screenshotFormat="image/jpeg"
          className="w-full h-auto object-cover"
        />
        {/* Овал для лица */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-64 border-2 border-dashed border-white/70 rounded-[50%]"></div>
        </div>
      </div>

      <div className="bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
        {step === "LOADING" && <Loader2 className="w-5 h-5 animate-spin" />}
        {step === "DONE" && <CheckCircle2 className="w-5 h-5" />}
        {instructions[step]}
      </div>
    </div>
  );
}
