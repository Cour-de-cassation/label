import { annotationModule } from '../../modules/annotation';
import { textSplitter } from './textSplitter';

describe('textSplitter', () => {
  describe('splitTextAccordingToAnnotations', () => {
    const annotations = [
      { category: 'firstName', text: 'Benoit', start: 0 },
      { category: 'firstName', text: 'Nicolas', start: 29 },
      { category: 'firstName', text: 'Romain', start: 61 },
    ].map(annotationModule.generator.generate);

    it('should split a text according to the given annotations', () => {
      const text = 'Benoit is software engineer. Nicolas is a software engineer. Romain is a designer.';

      const splittedText = textSplitter.splitTextAccordingToAnnotations(text, annotations);

      expect(splittedText).toEqual([
        {
          type: 'annotation',
          index: annotations[0].start,
          annotation: annotations[0],
        },
        { type: 'text', content: { index: 6, text: ' is software engineer. ' }, before: [], after: [] },
        {
          type: 'annotation',
          index: annotations[1].start,
          annotation: annotations[1],
        },
        { type: 'text', content: { index: 36, text: ' is a software engineer. ' }, before: [], after: [] },
        {
          type: 'annotation',
          index: annotations[2].start,
          annotation: annotations[2],
        },
        { type: 'text', content: { index: 67, text: ' is a designer.' }, before: [], after: [] },
      ]);
    });
  });
});
