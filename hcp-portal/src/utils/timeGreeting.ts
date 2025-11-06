/**
 * Time-based greeting utility
 * Returns appropriate greeting and emoji based on time of day
 */

export interface Greeting {
  message: string
  emoji: string
  subtext: string
}

export function getTimeBasedGreeting(userName: string = "there"): Greeting {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return {
      message: `Good Morning, ${userName}`,
      emoji: "👋",
      subtext: "Ready to start your day strong?"
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      message: `Good Afternoon, ${userName}`,
      emoji: "☀️",
      subtext: "Hope you're having a productive day!"
    }
  } else if (hour >= 17 && hour < 21) {
    return {
      message: `Good Evening, ${userName}`,
      emoji: "🌆",
      subtext: "Time to wind down and relax"
    }
  } else {
    return {
      message: `Good Night, ${userName}`,
      emoji: "🌙",
      subtext: "Don't forget to get some rest!"
    }
  }
}

/**
 * Format time to readable string
 */
export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

/**
 * Get motivational message based on health metrics
 */
export function getMotivationalMessage(heartRate: number, sleepQuality: number): string {
  if (heartRate < 60 || heartRate > 100) {
    return "Keep monitoring your heart rate today."
  }
  
  if (sleepQuality < 60) {
    return "Try to get more rest tonight. Your body needs it!"
  }
  
  if (sleepQuality >= 80 && heartRate >= 60 && heartRate <= 80) {
    return "You're in great shape! Keep up the excellent work!"
  }
  
  return "Great job maintaining your health!"
}

