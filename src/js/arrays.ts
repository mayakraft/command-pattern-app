
/**
 *
 */
export const arrayIntersection = (a = [], b = []) => (
  a.filter(value => b.includes(value))
);
