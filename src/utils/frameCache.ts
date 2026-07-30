export const TOTAL_FRAMES = 1749;
export const loadedImages: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
export const isFrameLoaded = new Uint8Array(TOTAL_FRAMES);

export function getFrameUrl(i: number) {
  const n = i + 136;
  return `/image-asset/frame_${String(n).padStart(6, '0')}.jpg`;
}

// Keyframe indices (every 5th frame = 350 keyframes)
export const KEYFRAME_INDICES: number[] = [];
for (let i = 0; i < TOTAL_FRAMES; i += 5) {
  KEYFRAME_INDICES.push(i);
}

const progressListeners = new Set<(pct: number) => void>();
const completeListeners = new Set<() => void>();

let isPreloadingStarted = false;
let isKeyframesComplete = false;

function notifyProgress() {
  const totalKeyframes = KEYFRAME_INDICES.length;
  let loadedCount = 0;
  for (let k = 0; k < totalKeyframes; k++) {
    if (isFrameLoaded[KEYFRAME_INDICES[k]]) loadedCount++;
  }
  const pct = Math.min(100, Math.round((loadedCount / totalKeyframes) * 100));

  progressListeners.forEach((cb) => cb(pct));

  if (loadedCount >= totalKeyframes && !isKeyframesComplete) {
    isKeyframesComplete = true;
    completeListeners.forEach((cb) => cb());
  }
}

export function startPreloading(onProgress?: (pct: number) => void, onComplete?: () => void) {
  if (onProgress) progressListeners.add(onProgress);
  if (onComplete) completeListeners.add(onComplete);

  // Immediately notify listener of current progress
  notifyProgress();

  if (isPreloadingStarted) return;
  isPreloadingStarted = true;

  // Build loading queue: Stage 1 (Keyframes), Stage 2 (Half-frames), Stage 3 (Rest)
  const queue: number[] = [...KEYFRAME_INDICES];

  for (let i = 0; i < TOTAL_FRAMES; i += 2) {
    if (i % 5 !== 0) queue.push(i);
  }
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    if (i % 2 !== 0 && i % 5 !== 0) queue.push(i);
  }

  let queueIdx = 0;
  const CONCURRENCY = 20;

  const loadNext = () => {
    while (queueIdx < queue.length && isFrameLoaded[queue[queueIdx]]) {
      queueIdx++;
    }
    if (queueIdx >= queue.length) return;

    const i = queue[queueIdx++];

    const img = new Image();
    img.src = getFrameUrl(i);

    const onDone = () => {
      isFrameLoaded[i] = 1;
      loadedImages[i] = img;
      notifyProgress();
      loadNext();
    };

    img.onload = onDone;
    img.onerror = onDone;
  };

  for (let c = 0; c < CONCURRENCY; c++) {
    loadNext();
  }
}
