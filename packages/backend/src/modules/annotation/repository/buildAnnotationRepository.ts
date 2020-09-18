import { annotationType } from '@label/core';
import { mongo } from '../../../lib/mongo';
import { annotationRepositoryType } from './annotationRepositoryType';

export { buildAnnotationRepository };

function buildAnnotationRepository(): annotationRepositoryType {
  const db = mongo.getDb();
  const collection = db.collection('annotations');

  return {
    insert,
  };

  async function insert(annotation: annotationType) {
    const insertResult = await collection.insertOne(annotation);
    return { success: !!insertResult.result.ok };
  }
}
