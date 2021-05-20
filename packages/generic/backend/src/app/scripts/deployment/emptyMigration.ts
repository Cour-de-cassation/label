export { emptyMigration };

const emptyMigration = `import { logger } from "../../../../utils"

export { up, down }

async function up() {
logger.log("Up: ")

const documentRepository = buildDocumentRepository();



}

async function down() {
  logger.log("Down: ")

}
`;
