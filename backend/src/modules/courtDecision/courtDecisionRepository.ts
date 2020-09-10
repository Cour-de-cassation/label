import { MongoDbType } from '../../mongo';

export { buildCourtDecisionRepository };

function buildCourtDecisionRepository(db: MongoDbType) {
  const collection = db.collection('courtDecisions');

  return {
    async findAll() {
      const courtDecisions = await collection.find().toArray();
      console.log(courtDecisions);
      return courtDecisions;
    },
  };
}
