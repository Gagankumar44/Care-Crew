/**
 * Breathing Rate Detection
 * Analyzes chest/upper body movement from video to detect breathing
 */

export class BreathingRateDetector {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null
  private measurements: number[] = []
  private startTime: number = 0
  private animationFrameId: number | null = null

  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })
  }

  /**
   * Start measuring breathing rate from video
   */
  async startMeasurement(
    video: HTMLVideoElement,
    duration: number = 30000, // 30 seconds for breathing
    onProgress?: (progress: number) => void,
    onUpdate?: (rate: number) => void
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      this.measurements = []
      this.startTime = Date.now()

      let lastUpdate = Date.now()
      const updateInterval = 2000 // Update every 2 seconds

      const processFrame = () => {
        if (!this.ctx || !video.videoWidth || !video.videoHeight) {
          return
        }

        try {
          // Setup canvas
          this.canvas.width = video.videoWidth
          this.canvas.height = video.videoHeight
          this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height)

          // Focus on chest/upper body region
          const chestRegion = {
            x: Math.floor(this.canvas.width * 0.3),
            y: Math.floor(this.canvas.height * 0.5),
            width: Math.floor(this.canvas.width * 0.4),
            height: Math.floor(this.canvas.height * 0.3)
          }

          // Get image data from chest region
          const imageData = this.ctx.getImageData(
            chestRegion.x,
            chestRegion.y,
            chestRegion.width,
            chestRegion.height
          )

          // Calculate vertical position of center of mass (chest expansion)
          let weightedSum = 0
          let totalWeight = 0

          for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
              const idx = (y * imageData.width + x) * 4
              // Use brightness to detect movement
              const brightness = (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3
              weightedSum += y * brightness
              totalWeight += brightness
            }
          }

          const centerOfMass = totalWeight > 0 ? weightedSum / totalWeight : 0
          this.measurements.push(centerOfMass)

          // Calculate elapsed time
          const elapsed = Date.now() - this.startTime
          const progress = Math.min((elapsed / duration) * 100, 100)

          if (onProgress) {
            onProgress(progress)
          }

          // Calculate and update breathing rate periodically
          if (this.measurements.length > 60 && Date.now() - lastUpdate >= updateInterval) {
            const rate = this.calculateBreathingRate()
            if (rate > 0 && onUpdate) {
              onUpdate(rate)
            }
            lastUpdate = Date.now()
          }

          // Continue if within duration
          if (elapsed < duration) {
            this.animationFrameId = requestAnimationFrame(processFrame)
          } else {
            // Measurement complete
            const finalRate = this.calculateBreathingRate()
            resolve(finalRate)
          }
        } catch (error) {
          reject(error)
        }
      }

      // Start processing
      this.animationFrameId = requestAnimationFrame(processFrame)
    })
  }

  /**
   * Calculate breathing rate from measurements
   */
  private calculateBreathingRate(): number {
    if (this.measurements.length < 180) {
      return 0 // Need at least 6 seconds at 30fps
    }

    // Use last 30 seconds of data
    const recentData = this.measurements.slice(-900) // ~30 seconds at 30fps

    // Find cycles (inhale/exhale)
    const cycles = this.detectBreathingCycles(recentData)

    if (cycles.length < 2) {
      return 0
    }

    // Calculate average time between cycles
    const intervals: number[] = []
    for (let i = 1; i < cycles.length; i++) {
      intervals.push(cycles[i] - cycles[i - 1])
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length

    // Convert to breaths per minute (assuming 30fps)
    const fps = 30
    const rate = (60 * fps) / avgInterval

    // Clamp to reasonable range (8-30 breaths/min)
    return Math.max(8, Math.min(30, Math.round(rate)))
  }

  /**
   * Detect breathing cycles (inhale/exhale)
   */
  private detectBreathingCycles(data: number[]): number[] {
    const cycles: number[] = []
    
    // Smooth the data
    const smoothed = this.smoothData(data, 5)

    // Find peaks and valleys
    for (let i = 10; i < smoothed.length - 10; i++) {
      const current = smoothed[i]
      const prev = smoothed[i - 1]
      const next = smoothed[i + 1]

      // Detect peak (inhale) or valley (exhale) - we'll use peaks
      if (current > prev && current > next) {
        // Check if significant enough change
        const threshold = this.calculateThreshold(smoothed)
        if (current > threshold) {
          cycles.push(i)
        }
      }
    }

    return cycles
  }

  /**
   * Smooth data using moving average
   */
  private smoothData(data: number[], windowSize: number): number[] {
    const smoothed: number[] = []
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2))
      const end = Math.min(data.length, i + Math.floor(windowSize / 2))
      const window = data.slice(start, end)
      const avg = window.reduce((a, b) => a + b, 0) / window.length
      smoothed.push(avg)
    }
    return smoothed
  }

  /**
   * Calculate dynamic threshold
   */
  private calculateThreshold(data: number[]): number {
    const sorted = [...data].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    return median
  }

  /**
   * Stop measurement
   */
  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }
}

