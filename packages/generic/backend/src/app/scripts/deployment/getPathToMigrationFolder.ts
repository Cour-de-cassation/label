export { getPathToMigrationFolder };

function getPathToMigrationFolder() {
  return `${__dirname.replace('dist', 'src')}/migrations`;
}
