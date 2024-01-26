import { documentType } from "@label/core";
import { buildDocumentRepository } from "../../repository";

export { updateDocumentComputedAdditionalTerms }

async function updateDocumentComputedAdditionalTerms(
  _id: documentType['_id'],
  computedAdditionalTermsToAnnotate: documentType['decisionMetadata']['computedAdditionalTerms'],
) {
  const documentRepository = buildDocumentRepository();

  const document = await documentRepository.findById(_id);

  return document;
}
