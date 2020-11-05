export const isElectron = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf(" electron/") > -1;
};

export const copyToClipboard = (value: string | number): void => {
  if (isElectron()) {
    (window as any).electron.copyToClipboard(value);
    return;
  }
  navigator.clipboard.writeText(value.toString());
};
