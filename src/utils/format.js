export const formatRoundLabel = (roundIndex, distance) => {
  if (roundIndex === null || roundIndex === undefined) {
    return '';
  }

  const number = roundIndex + 1;
  let suffix = 'th';
  if (number === 1) suffix = 'st';
  if (number === 2) suffix = 'nd';
  if (number === 3) suffix = 'rd';

  return `${number}${suffix} Lap - ${distance}m`;
};
