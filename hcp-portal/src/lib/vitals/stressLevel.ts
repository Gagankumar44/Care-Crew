/**
 * Stress Level Estimation
 * Analyzes facial features and expressions to estimate stress level
 */

export class StressLevelDetector {
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
   * Start measuring stress level from video
   */
  async startMeasurement(
    video: HTMLVideoElement,
    duration: number = 10000, // 10 seconds
    onProgress?: (progress: number) => void,
    onUpdate?: (level: number) => void
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      this.measurements = []
      this.startTime = Date.now()

      let lastUpdate = Date.now()
      const updateInterval = 1000 // Update every second

      const processFrame = () => {
        if (!this.ctx || !video.videoWidth || !video.videoHeight) {
          return
        }

        try {
          // Setup canvas
          this.canvas.width = video.videoWidth
          this.canvas.height = video.videoHeight
          this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height)

          // Analyze facial region
          const faceRegion = {
            x: Math.floor(this.canvas.width * 0.35),
            y: Math.floor(this.canvas.height * 0.25),
            width: Math.floor(this.canvas.width * 0.3),
            height: Math.floor(this.canvas.height * 0.4)
          }

          // Get image data from face region
          const imageData = this.ctx.getImageData(
            faceRegion.x,
            faceRegion.y,
            faceRegion.width,
            faceRegion.height
          )

          // Calculate stress indicators
          const stressScore = this.analyzeStressIndicators(imageData)
          this.measurements.push(stressScore)

          // Calculate elapsed time
          const elapsed = Date.now() - this.startTime
          const progress = Math.min((elapsed / duration) * 100, 100)

          if (onProgress) {
            onProgress(progress)
          }

          // Calculate and update stress level periodically
          if (this.measurements.length > 30 && Date.now() - lastUpdate >= updateInterval) {
            const level = this.calculateStressLevel()
            if (level >= 0 && onUpdate) {
              onUpdate(level)
            }
            lastUpdate = Date.now()
          }

          // Continue if within duration
          if (elapsed < duration) {
            this.animationFrameId = requestAnimationFrame(processFrame)
          } else {
            // Measurement complete
            const finalLevel = this.calculateStressLevel()
            resolve(finalLevel)
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
   * Analyze stress indicators from facial image
   */
  private analyzeStressIndicators(imageData: ImageData): number {
    // Analyze various stress indicators:
    // 1. Facial asymmetry (more asymmetry = higher stress)
    // 2. Color variation (skin tone changes can indicate stress)
    // 3. Edge detection (tension creates more defined edges)
    // 4. Overall brightness variation

    let edgeScore = 0
    let variationScore = 0
    let asymmetryScore = 0

    // Analyze left and right halves for asymmetry
    const midX = Math.floor(imageData.width / 2)
    
    const leftBrightness: number[] = []
    const rightBrightness: number[] = []

    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const idx = (y * imageData.width + x) * 4
        const r = imageData.data[idx]
        const g = imageData.data[idx + 1]
        const b = imageData.data[idx + 2]
        const brightness = (r + g + b) / 3

        if (x < midX) {
          leftBrightness.push(brightness)
        } else {
          rightBrightness.push(brightness)
        }

        // Edge detection using Sobel-like gradient
        if (x > 0 && y > 0 && x < imageData.width - 1 && y < imageData.height - 1) {
          const prevIdx = ((y - 1) * imageData.width + x) * 4
          const gradient = Math.abs(brightness - ((imageData.data[prevIdx] + imageData.data[prevIdx + 1] + imageData.data[prevIdx + 2]) / 3))
          edgeScore += gradient
        }

        // Variation in color (higher variation can indicate flushing/pallor)
        const variation = Math.sqrt(
          Math.pow(r - brightness, 2) +
          Math.pow(g - brightness, 2) +
          Math.pow(b - brightness, 2)
        )
        variationScore += variation
      }
    }

    // Calculate asymmetry
    const leftAvg = leftBrightness.reduce((a, b) => a + b, 0) / leftBrightness.length
    const rightAvg = rightBrightness.reduce((a, b) => a + b, 0) / rightBrightness.length
    asymmetryScore = Math.abs(leftAvg - rightAvg)

    // Normalize scores
    edgeScore = edgeScore / (imageData.width * imageData.height)
    variationScore = variationScore / (imageData.width * imageData.height)

    // Combine scores (higher = more stress indicators)
    const combinedScore = (edgeScore * 0.3) + (variationScore * 0.3) + (asymmetryScore * 0.4)

    return combinedScore
  }

  /**
   * Calculate stress level from measurements
   */
  private calculateStressLevel(): number {
    if (this.measurements.length < 30) {
      return 0
    }

    // Use average of recent measurements
    const recentData = this.measurements.slice(-30)
    const avg = recentData.reduce((a, b) => a + b, 0) / recentData.length

    // Normalize to 0-100 scale
    // Based on empirical thresholds (would need calibration in production)
    const minStress = 50
    const maxStress = 150
    const normalized = ((avg - minStress) / (maxStress - minStress)) * 100

    // Clamp to 0-100
    return Math.max(0, Math.min(100, Math.round(normalized)))
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

