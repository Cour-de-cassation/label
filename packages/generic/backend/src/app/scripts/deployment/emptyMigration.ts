export { emptyMigration };

const emptyMigration = `import { logger } from "../../../../utils"

export { up, down }

async function up() {
  logger.log({ operationName: "migration", msg: "Up: "})

}

async function down() {
  logger.log({ operationName: "migration", msg: "Down: "})

}
`;
