const formatBytesSigFig = (
  bytes: number,
  sigFigs: number = 3,
): [number, string] => {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let unitIndex = 0;
  let value = bytes;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return [Number(value.toFixed(sigFigs)), units[unitIndex]];
};

export default formatBytesSigFig;
