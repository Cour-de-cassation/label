import { buildPreAssignationRepository } from '../repository';
import { preAssignationModule } from '@label/core';
import {
  fetchPreAssignationBySourceAndDocumentNumber,
  fetchAllPreAssignation,
} from './fetch';

describe('fetch', () => {
  const preAssignationRepository = buildPreAssignationRepository();
  const preAssignation1 = preAssignationModule.generator.generate({
    documentNumber: 123456,
    source: 'mySource',
  });
  preAssignationRepository.insert(preAssignation1);
  const preAssignation2 = preAssignationModule.generator.generate({
    documentNumber: 654321,
    source: 'myOtherSource',
  });
  preAssignationRepository.insert(preAssignation2);

  for (let i = 0; i < 10; i++) {
    const preAssignation = preAssignationModule.generator.generate();
    preAssignationRepository.insert(preAssignation);
  }

  describe('fetchAllPreAssignation', () => {
    it('should fetch all preAssignations', async () => {
      const allPreAssignation = await fetchAllPreAssignation();

      expect(allPreAssignation.length).toEqual(12);
    });

    describe('fetchPreAssignationBySourceAndDocumentNumber', () => {
      it('should fetch one pre assignation with documentNumber and source provided', async () => {
        const myPreAssignation = await fetchPreAssignationBySourceAndDocumentNumber(
          123456,
          'mySource',
        );
        expect(myPreAssignation).toEqual(preAssignation1);
      });
    });
  });
});
