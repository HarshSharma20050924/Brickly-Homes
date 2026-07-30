export const TOTAL_FRAMES = 1749;
export const loadedImages: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
export const isFrameLoaded = new Uint8Array(TOTAL_FRAMES);

export function getFrameUrl(i: number) {
  const n = i + 136;
  return `/image-asset/frame_${String(n).padStart(6, '0')}.jpg`;
}

// Stage 1 keyframe indices (every 5th frame = 350 keyframes)
export const KEYFRAME_INDICES: number[] = [];
for (let i = 0; i < TOTAL_FRAMES; i += 5) {
  KEYFRAME_INDICES.push(i);
}

let isPreloadingStarted = false;
let globalProgressCallback: ((pct: number) => void) | null = null;
let globalCompleteCallback: (() => void) | null = null;

export function startPreloading(onProgress?: (pct: number) => void, onComplete?: () => void) {
  if (onProgress) globalProgressCallback = onProgress;
  if (onComplete) globalCompleteCallback = onComplete;

  const totalKeyframes = KEYFRAME_INDICES.length;
  const currentLoadedKeyframes = KEYFRAME_INDICES.filter((idx) => isFrameLoaded[idx]).length;
  const initialPct = Math.min(100, Math.round((currentLoadedKeyframes / totalKeyframes) * 100));

  if (globalProgressCallback) {
    globalProgressCallback(initialPct);
  }

  if (currentLoadedKeyframes >= totalKeyframes) {
    if (globalCompleteCallback) globalCompleteCallback();
    return;
  }

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
  let keyframesLoadedCount = currentLoadedKeyframes;
  const CONCURRENCY = 18;
  let hasCompleted = false;

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

      if (i % 5 === 0) {
        keyframesLoadedCount++;
        const pct = Math.min(100, Math.round((keyframesLoadedCount / totalKeyframes) * 100));
        if (globalProgressCallback) globalProgressCallback(pct);

        if (keyframesLoadedCount >= totalKeyframes && !hasCompleted) {
          hasCompleted = true;
          if (globalCompleteCallback) globalCompleteCallback();
        }
      }

      loadNext();
    };

    img.onload = onDone;
    img.onerror = onDone;
  };

  for (let c = 0; c < CONCURRENCY; c++) {
    loadNext();
  }
}
