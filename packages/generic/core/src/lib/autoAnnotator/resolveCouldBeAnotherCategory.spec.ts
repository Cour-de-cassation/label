import { annotationModule } from '../../modules/annotation';
import { settingsModule } from '../../modules/settings';
import { resolveCouldBeAnotherCategory } from './resolveCouldBeAnotherCategory';

describe('resolveCouldBeAnotherCategory', () => {
  it('should change the category of the given annotation if it could be from another one', () => {
    const annotations = [
      { text: 'TEXT_1', category: 'CATEGORY_1' },
      { text: 'TEXT_2', category: 'CATEGORY_1' },
      { text: 'TEXT_1', category: 'CATEGORY_1' },
      { text: 'TEXT_1', category: 'CATEGORY_2' },
    ].map(annotationModule.generator.generate);
    const settings = settingsModule.lib.buildSettings({
      CATEGORY_1: {
        couldBe: 'CATEGORY_2',
      },
      CATEGORY_2: {},
    });

    const resolvedAnnotation = resolveCouldBeAnotherCategory(annotations[0], annotations, settings);

    expect(resolvedAnnotation).toEqual({
      ...annotations[0],
      category: 'CATEGORY_2',
      entityId: annotationModule.lib.entityIdHandler.compute('CATEGORY_2', 'TEXT_1'),
    });
  });

  it('should not change the category of the given annotation if it could be from another one but there are no proof', () => {
    const annotations = [
      { text: 'TEXT_1', category: 'CATEGORY_1' },
      { text: 'TEXT_2', category: 'CATEGORY_1' },
      { text: 'TEXT_1', category: 'CATEGORY_1' },
      { text: 'TEXT_2', category: 'CATEGORY_2' },
    ].map(annotationModule.generator.generate);
    const settings = settingsModule.lib.buildSettings({
      CATEGORY_1: {
        couldBe: 'CATEGORY_2',
      },
      CATEGORY_2: {},
    });

    const resolvedAnnotation = resolveCouldBeAnotherCategory(annotations[0], annotations, settings);

    expect(resolvedAnnotation).toEqual(annotations[0]);
  });
});
