enum Color {
  DEFAULT = "\x1b[0m",
  GREEN = "\x1b[32m",
  YELLOW = "\x1b[33m",
  RED = "\x1b[31m",
  CYAN = "\x1b[36m",
}

export class AppLogger {
  private static stamp(): string {
    return new Date().toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  private static write(level: string, message: string, color: Color): void {
    console.log(
      `${color}[DICTIONARY]${Color.DEFAULT} ${AppLogger.stamp()} ${color}${level}${Color.DEFAULT} ${message}`,
    )
  }

  private static colorForStatus(status: number): Color {
    if (status >= 500) return Color.RED
    if (status >= 400) return Color.YELLOW
    return Color.GREEN
  }

  static startRoute(message: string): void {
    AppLogger.write("[---->]", message, Color.CYAN)
  }

  static finishRoute(message: string, status: number): void {
    AppLogger.write("[<----]", message, AppLogger.colorForStatus(status))
  }

  static info(message: string): void {
    AppLogger.write("[INFO ]", message, Color.GREEN)
  }

  static warn(message: string): void {
    AppLogger.write("[WARN ]", message, Color.YELLOW)
  }

  static error(message: string): void {
    AppLogger.write("[ERROR]", message, Color.RED)
  }
}
