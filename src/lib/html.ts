export const replaceHTML = (
  originalHTML: string,
  replaceText: string,
  range: { index: number; length: number }
) => {
  let startIndex = 0;
  let consumed = 0;
  while (consumed <= range.index) {
    if (originalHTML[startIndex] === "<") {
      while (originalHTML[startIndex] !== ">") {
        startIndex++;
      }
      startIndex++;
      continue;
    }

    consumed++;
    startIndex++;
  }

  consumed = 0;
  let endIndex = --startIndex;
  while (consumed <= range.length && endIndex < originalHTML.length) {
    if (originalHTML[endIndex] === "<") {
      while (originalHTML[endIndex] !== ">") {
        endIndex++;
      }
      endIndex++;
      continue;
    }

    consumed++;
    endIndex++;
  }

  return replaceTextInRange(originalHTML, startIndex, endIndex, replaceText);
};

const replaceTextInRange = (
  originalString: string,
  startIndex: number,
  endIndex: number,
  newText: string
): string => {
  console.log(startIndex, endIndex)
  // Ensure the indices are within the bounds of the string
  if (startIndex < 0 || endIndex > originalString.length || startIndex >= endIndex) {
    throw new Error("Invalid range specified.");
  }

  // Use substring to get parts of the string
  const before = originalString.substring(0, startIndex);
  const after = originalString.substring(endIndex);

  // Concatenate the parts with the new text
  return before + newText + after;
};
