import { annotationModule, settingsModule } from '@label/core';
import { getAnnotationTextDisplayStyle } from './getAnnotationTextDisplayStyle';

describe('getAnnotationTextDisplayStyle', () => {
  const settings = settingsModule.lib.buildSettings({
    prenom: { order: 1, text: 'Prénom', status: 'hidden' },
    nom: { order: 2, text: 'Nom', status: 'alwaysVisible' },
    adresse: { order: 3, text: 'Adresse', status: 'annotable' },
  });

  it('should return none', () => {
    const annotation = annotationModule.generator.generate({ category: 'prenom' });
    const documentViewerMode = { kind: 'annotation' as const, isAnonymizedView: true };
    const displayStyle = getAnnotationTextDisplayStyle({ settings, annotation, documentViewerMode });

    expect(displayStyle).toBe('none');
  });

  it('should return underlined', () => {
    const annotation = annotationModule.generator.generate({ category: 'nom' });
    const documentViewerMode = { kind: 'annotation' as const, isAnonymizedView: true };
    const displayStyle = getAnnotationTextDisplayStyle({ settings, annotation, documentViewerMode });

    expect(displayStyle).toBe('underlined');
  });

  it('should return outlined', () => {
    const annotation = annotationModule.generator.generate({ category: 'adresse' });
    const documentViewerMode = {
      kind: 'occurrence' as const,
      category: annotation.category,
      entityId: 'OTHER_ENTITY_ID',
      isAnonymizedView: true,
      entityLineNumbers: [],
    };
    const displayStyle = getAnnotationTextDisplayStyle({ settings, annotation, documentViewerMode });

    expect(displayStyle).toBe('outlined');
  });

  it('should return filled', () => {
    const annotation = annotationModule.generator.generate({ category: 'adresse' });
    const documentViewerMode = {
      kind: 'occurrence' as const,
      category: annotation.category,
      entityId: annotation.entityId,
      isAnonymizedView: true,
      entityLineNumbers: [],
    };
    const displayStyle = getAnnotationTextDisplayStyle({ settings, annotation, documentViewerMode });

    expect(displayStyle).toBe('filled');
  });
});
