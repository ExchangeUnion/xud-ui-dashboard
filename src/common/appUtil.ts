export const isElectron = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf(" electron/") > -1;
};

export const copyToClipboard = (value: string | number): void => {
  if (isElectron()) {
    sendMessageToParent(`copyToClipboard: ${value}`);
    return;
  }
  navigator.clipboard.writeText(value.toString());
};

export const sendMessageToParent = (message: string): void => {
  window.parent.postMessage(message, "*");
};
