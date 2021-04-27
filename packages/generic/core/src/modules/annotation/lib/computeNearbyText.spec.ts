import { annotationGenerator } from '../generator';
import { computeNearbyText } from './computeNearbyText';

describe('computeNearbyText', () => {
  it('should only have before text', () => {
    const wholeText = 'The developer who knows all design patterns is Romain';
    const annotation = annotationGenerator.generate({ start: 47, text: 'Romain' });

    const { textStart, textEnd } = computeNearbyText(annotation, wholeText);

    const text = wholeText.substring(textStart, textEnd);
    expect(text).toBe(' all design patterns is Romain');
  });

  it('should only have after text', () => {
    const wholeText = 'Sure!\nNicolas is a designer who speaks several languages.';
    const annotation = annotationGenerator.generate({ start: 6, text: 'Nicolas' });

    const { textStart, textEnd } = computeNearbyText(annotation, wholeText);

    const text = wholeText.substring(textStart, textEnd);
    expect(text).toBe('Nicolas is a designer who speaks');
  });

  it('should have both before and after texts', () => {
    const wholeText = 'As a data scientist, Benoit knows everything about pizzas';
    const annotation = annotationGenerator.generate({ start: 21, text: 'Benoit' });

    const { textStart, textEnd } = computeNearbyText(annotation, wholeText);

    const text = wholeText.substring(textStart, textEnd);
    expect(text).toBe('s a data scientist, Benoit knows everything about p');
  });
});
