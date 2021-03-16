import { annotationType } from '../annotationType';

export { areOverlapping };

function areOverlapping(annotation1: annotationType, annotation2: annotationType) {
  const startA = annotation1.start;
  const endA = annotation1.start + annotation1.text.length;
  const startB = annotation2.start;
  const endB = annotation2.start + annotation2.text.length;

  return (
    (startA < startB && endA > startB) ||
    (startA <= startB && endA >= endB) ||
    (startB < startA && endB > startA) ||
    (startB <= startA && endB >= endA)
  );
}
