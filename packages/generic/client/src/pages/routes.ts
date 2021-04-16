export { defaultRoutes, routes };

const routes = {
  ADMIN: '/admin',
  AGENTS: '/admin/agents',
  ANNOTATION: '/annotation',
  ANONYMIZED_DOCUMENT: '/anonymized-document/:documentId',
  DEFAULT: '/',
  DOCUMENT: '/admin/document/:documentId',
  LOGIN: '/login',
  PROBLEM_REPORTS: '/admin/problem-reports',
  SPECIAL_DOCUMENTS: '/special-documents',
  STATISTICS: '/admin/statistics',
  TREATED_DOCUMENTS: '/admin/treated-documents',
  UNTREATED_DOCUMENT: '/admin/untreated-documents',
};

const defaultRoutes = {
  admin: routes.STATISTICS,
  annotator: routes.ANNOTATION,
  specialDocumentAnnotator: routes.SPECIAL_DOCUMENTS,
};
