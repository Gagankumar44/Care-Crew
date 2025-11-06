/**
 * Heart Rate Detection using Photoplethysmography (PPG)
 * Analyzes color changes in video frames to detect pulse
 */

export class HeartRateDetector {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null
  private frameCount: number = 0
  private measurements: number[] = []
  private startTime: number = 0
  private animationFrameId: number | null = null
  
  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })
  }

  /**
   * Start measuring heart rate from video
   */
  async startMeasurement(
    video: HTMLVideoElement,
    duration: number = 15000, // 15 seconds
    onProgress?: (progress: number) => void,
    onUpdate?: (bpm: number) => void
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      this.measurements = []
      this.frameCount = 0
      this.startTime = Date.now()
      
      // Setup canvas to match video dimensions
      this.canvas.width = video.videoWidth || 640
      this.canvas.height = video.videoHeight || 480

      let lastUpdate = Date.now()
      const updateInterval = 1000 // Update every second

      const processFrame = () => {
        if (!this.ctx || !video.videoWidth || !video.videoHeight) {
          return
        }

        try {
          // Draw current video frame to canvas
          this.canvas.width = video.videoWidth
          this.canvas.height = video.videoHeight
          this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height)

          // Get image data
          const imageData = this.ctx.getImageData(
            Math.floor(this.canvas.width * 0.45), // Center-left region (face area)
            Math.floor(this.canvas.height * 0.4),
            Math.floor(this.canvas.width * 0.1), // Small region for efficiency
            Math.floor(this.canvas.height * 0.2)
          )

          // Calculate average green channel intensity (green is most sensitive to blood flow)
          let sum = 0
          for (let i = 1; i < imageData.data.length; i += 4) {
            sum += imageData.data[i] // Green channel
          }
          const avg = sum / (imageData.data.length / 4)
          this.measurements.push(avg)

          this.frameCount++

          // Calculate elapsed time
          const elapsed = Date.now() - this.startTime
          const progress = Math.min((elapsed / duration) * 100, 100)

          // Update progress callback
          if (onProgress) {
            onProgress(progress)
          }

          // Calculate and update BPM periodically
          if (this.frameCount > 30 && Date.now() - lastUpdate >= updateInterval) {
            const bpm = this.calculateBPM()
            if (bpm > 0 && onUpdate) {
              onUpdate(bpm)
            }
            lastUpdate = Date.now()
          }

          // Continue if within duration
          if (elapsed < duration) {
            this.animationFrameId = requestAnimationFrame(processFrame)
          } else {
            // Measurement complete
            const finalBPM = this.calculateBPM()
            resolve(finalBPM)
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
   * Calculate BPM from measurements using FFT-like analysis
   */
  private calculateBPM(): number {
    if (this.measurements.length < 60) {
      return 0 // Need at least 60 frames (~2 seconds at 30fps)
    }

    // Use last 15 seconds of data for calculation
    const recentData = this.measurements.slice(-450) // ~15 seconds at 30fps
    
    // Find peaks in the signal (representing heartbeats)
    const peaks = this.detectPeaks(recentData)
    
    if (peaks.length < 2) {
      return 0
    }

    // Calculate time between peaks
    const intervals: number[] = []
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i - 1])
    }

    // Calculate average interval (in frames)
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length

    // Convert to BPM (assuming 30fps)
    const fps = 30
    const bpm = (60 * fps) / avgInterval

    // Clamp to reasonable range
    return Math.max(40, Math.min(200, Math.round(bpm)))
  }

  /**
   * Detect peaks in signal
   */
  private detectPeaks(data: number[]): number[] {
    const peaks: number[] = []
    const threshold = this.calculateThreshold(data)

    for (let i = 10; i < data.length - 10; i++) {
      const current = data[i]
      const prev = data[i - 1]
      const next = data[i + 1]

      // Local maximum above threshold
      if (current > prev && current > next && current > threshold) {
        peaks.push(i)
      }
    }

    return peaks
  }

  /**
   * Calculate dynamic threshold
   */
  private calculateThreshold(data: number[]): number {
    const sorted = [...data].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    const deviation = this.calculateStdDev(data, median)
    return median + deviation * 0.5
  }

  /**
   * Calculate standard deviation
   */
  private calculateStdDev(data: number[], mean: number): number {
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    return Math.sqrt(variance)
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

  /**
   * Get current measurement count
   */
  getProgress(): number {
    return this.measurements.length
  }
}

