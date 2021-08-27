export { buildTimer };

function buildTimer() {
  let lastTaskName: string | null = null;
  let timestamp: number | null = null;

  return {
    start,
    screenshot,
    stop,
  };

  function start(taskName: string) {
    console.log(`${taskName} started`);
    lastTaskName = taskName;
    timestamp = new Date().getTime();
  }

  function screenshot(taskName: string) {
    if (lastTaskName === null || timestamp === null) {
      throw new Error(`Cannot screenshot a new taskName if the timer was not started`);
    }
    const newTimestamp = new Date().getTime();
    console.log(`${lastTaskName} took ${newTimestamp - timestamp} ms`);
    start(taskName);
  }

  function stop() {
    if (lastTaskName === null || timestamp === null) {
      throw new Error(`Cannot the timer if it was not started before`);
    }
    const newTimestamp = new Date().getTime();
    console.log(`${lastTaskName} took ${newTimestamp - timestamp} ms`);
    lastTaskName = null;
    timestamp = null;
  }
}
