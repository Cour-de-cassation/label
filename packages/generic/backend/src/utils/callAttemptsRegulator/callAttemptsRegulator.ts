export { buildCallAttemptsRegulator };

function buildCallAttemptsRegulator(
  maxAttempts: number,
  delayBetweenAttemptsInSeconds: number,
) {
  const callAttempts: Record<string, number[]> = {};

  return { checkCallAttempts };

  function checkCallAttempts(identifier: string) {
    const now = new Date().getTime();
    if (!callAttempts[identifier]) {
      callAttempts[identifier] = [now];
      return;
    }
    callAttempts[identifier] = [
      ...callAttempts[identifier].filter(
        (timestamp) => now - timestamp < delayBetweenAttemptsInSeconds,
      ),
      now,
    ];
    if (callAttempts[identifier].length > maxAttempts) {
      throw new Error(`Too many call attempts for identifier ${identifier}`);
    }
  }
}
