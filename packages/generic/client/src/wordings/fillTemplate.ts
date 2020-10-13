import format from 'string-template';

export { fillTemplate };

function fillTemplate(template: string, interpolatedValue: string): string {
  return format(template, interpolatedValue);
}
