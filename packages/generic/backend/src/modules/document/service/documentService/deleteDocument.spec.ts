import { buildAnnotationReportRepository } from '../../../annotationReport/repository';
import { buildAssignationRepository } from '../../../assignation/repository';
import { buildMonitoringEntryRepository } from '../../../monitoringEntry/repository';
import { buildTreatmentRepository } from '../../../treatment/repository';
import {
  annotationReportModule,
  assignationModule,
  documentModule,
  idModule,
  monitoringEntryModule,
  treatmentModule,
} from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { deleteDocument } from './deleteDocument';

describe('deleteDocument', () => {
  const annotationReportRepository = buildAnnotationReportRepository();
  const assignationRepository = buildAssignationRepository();
  const documentRepository = buildDocumentRepository();
  const monitoringEntryRepository = buildMonitoringEntryRepository();
  const treatmentRepository = buildTreatmentRepository();

  it('should remove the given document from the database with all its dependencies', async () => {
    const documentId = idModule.lib.buildId();
    const annotationReports = ([
      { documentId },
      { documentId },
      { documentId: idModule.lib.buildId() },
    ] as const).map(annotationReportModule.generator.generate);
    const assignations = ([
      { documentId },
      { documentId },
      { documentId: idModule.lib.buildId() },
    ] as const).map(assignationModule.generator.generate);
    const documents = ([
      { _id: documentId },
      { _id: idModule.lib.buildId() },
    ] as const).map(documentModule.generator.generate);
    const monitoringEntries = ([
      { documentId },
      { documentId },
      { documentId: idModule.lib.buildId() },
    ] as const).map(monitoringEntryModule.generator.generate);
    const treatments = ([
      { documentId },
      { documentId },
      { documentId: idModule.lib.buildId() },
    ] as const).map(treatmentModule.generator.generate);
    await Promise.all(annotationReports.map(annotationReportRepository.insert));
    await Promise.all(assignations.map(assignationRepository.insert));
    await Promise.all(documents.map(documentRepository.insert));
    await Promise.all(monitoringEntries.map(monitoringEntryRepository.insert));
    await Promise.all(treatments.map(treatmentRepository.insert));

    await deleteDocument(documentId);

    const annotationReportsAfterRemove = await annotationReportRepository.findAll();
    const assignationsAfterRemove = await assignationRepository.findAll();
    const documentsAfterRemove = await documentRepository.findAll();
    const monitoringEntriesAfterRemove = await monitoringEntryRepository.findAll();
    const treatmentsAfterRemove = await treatmentRepository.findAll();
    expect(annotationReportsAfterRemove).toEqual([annotationReports[2]]);
    expect(assignationsAfterRemove).toEqual([assignations[2]]);
    expect(documentsAfterRemove).toEqual([documents[1]]);
    expect(monitoringEntriesAfterRemove).toEqual([monitoringEntries[2]]);
    expect(treatmentsAfterRemove).toEqual([treatments[2]]);
  });
});
