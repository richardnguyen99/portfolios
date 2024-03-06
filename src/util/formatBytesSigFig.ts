const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"] as const;

/**
 * Formats a number of bytes into a human-readable string with a specified
 * number of significant figures.
 *
 * @param {number} bytes - The number of bytes to format.
 * @param {number} [sigFigs=3] - The number of significant figures to display.
 * Defaults to `3`.
 * @returns [number, string] - A tuple containing the formatted number and the
 * unit.
 *
 * @example
 * const [num, unit] = formatBytesSigFig(1024);
 * console.log(`${num} ${unit}`); // 1 KB
 *
 * @example
 * const [num, unit] = formatBytesSigFig(1024, 2);
 * console.log(`${num} ${unit}`); // 1 KB
 *
 * @example
 * const [num, unit] = formatBytesSigFig(1099511, 3);
 * console.log(`${num} ${unit}`); // 1.05 MB
 */
const formatBytesSigFig = (
  bytes: number,
  sigFigs: number = 3,
): [number, string] => {
  let unitIndex = 0;
  let value = bytes;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return [Number(value.toPrecision(sigFigs)), units[unitIndex]];
};

export default formatBytesSigFig;
