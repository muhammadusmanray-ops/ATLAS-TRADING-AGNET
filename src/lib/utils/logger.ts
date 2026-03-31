type LogCallback = (message: string) => void;

let logCallback: LogCallback | null = null;

export const setLogCallback = (callback: LogCallback) => {
  logCallback = callback;
};

export const addLog = (message: string) => {
  if (logCallback) {
    logCallback(message);
  }
  console.log(message);
};
