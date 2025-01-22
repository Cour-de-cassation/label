const { MongoClient } = require("mongodb");
if (!process.env.NODE_ENV) require("dotenv").config();

function setDate(dateRef, day, month) {
  const date = new Date(dateRef.toISOString())
  date.setDate(day > 28 ? 28: day)
  date.setMonth(month)
  return date
}

async function refreshDocuments(db, date) {
  const decisions = await db.collection("documents").find();

  return decisions
    .map(({ _id, decisionMetadata, nlpVersions }) => {
      return db.collection("documents").updateOne(
        { _id },
        {
          $set: {
            creationDate: date.getTime(),
            "decisionMetadata.date": setDate(date, (new Date(decisionMetadata.date)).getDate(), date.getMonth() -1).getTime(),
            updateDate: date.getTime(),
            nlpVersions: Object.entries(nlpVersions).reduce(
              (acc, [key, value]) => {
                return value?.date
                  ? {
                      ...acc,
                      [key]: {
                        ...value,
                        date: date.toISOString().replace("T", " ").slice(0, -5),
                      },
                    }
                  : { ...acc, [key]: value };
              },
              {}
            ),
          },
        }
      );
    })
    .toArray();
}

async function refreshAssignations(db, date) {
  const decisions = await db.collection("assignations").find();

  return decisions
    .map(({ _id }) => {
      return db.collection("assignations").updateOne(
        { _id },
        {
          $set: {
            assignationDate: date.getTime(),
          },
        }
      );
    })
    .toArray();
}

async function refreshStatistics(db, date) {
  const decisions = await db.collection("statistics").find();

  return decisions
    .map(({ _id, treatmentDate, decisionDate }) => {
      return db.collection("statistics").updateOne(
        { _id },
        {
          $set: {
            decisionDate: setDate(date, (new Date(decisionDate)).getDate(), date.getMonth() -1).getTime(),
            treatmentDate: treatmentDate ? date.getTime() : null,
          },
        }
      );
    })
    .toArray();
}

async function refreshTreatments(db, date) {
  const decisions = await db.collection("treatments").find();

  return decisions
    .map(({ _id }) => {
      return db.collection("treatments").updateOne(
        { _id },
        {
          $set: {
            lastUpdateDate: date.getTime(),
          },
        }
      );
    })
    .toArray();
}

async function main() {
  const client = new MongoClient(process.env.LABEL_DB_URL, {
    useUnifiedTopology: true,
  });
  await client.connect();

  const db = client.db(process.env.LABEL_DB_NAME);

  const input = process.argv[2];
  const date = new Date(input * 1000);
  if (!(date instanceof Date) || isNaN(date.valueOf()))
    throw new Error(
      `script.js [date]: waiting for an unix epoch date valid (input: ${input})`
    );

  const resDocuments = await refreshDocuments(db, date);
  const resAssignations = await refreshAssignations(db, date);
  const resStatistics = await refreshStatistics(db, date)
  const resTreatments = await refreshTreatments(db, date)

  return Promise.all([...resDocuments, ...resAssignations, ...resStatistics, ...resTreatments]);
}

main()
  .then((_) => console.log(`update successfull: ${_.length} documents`))
  .catch(console.error)
  .finally((_) => process.exit());
