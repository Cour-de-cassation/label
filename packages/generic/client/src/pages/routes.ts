export { defaultRoutes, routes };

const routes = {
  ADMIN: { getPath: () => '/admin' },
  ADMIN_MAIN: { getPath: () => '/admin/main/' },
  AGENTS: { getPath: () => '/admin/main/agents' },
  ANNOTATION: { getPath: () => '/annotation' },
  ANONYMIZED_DOCUMENT: { getPath: (documentId?: string) => `/anonymized-document/${documentId || ':documentId'}` },
  DEFAULT: { getPath: () => '/' },
  DOCUMENT: { getPath: (documentId?: string) => `/admin/document/${documentId || ':documentId'}` },
  LOGIN: { getPath: () => '/login' },
  PROBLEM_REPORTS: { getPath: () => '/admin/main/problem-reports' },
  SPECIAL_DOCUMENTS: { getPath: () => '/special-documents' },
  STATISTICS: { getPath: () => '/admin/main/statistics' },
  TREATED_DOCUMENTS: { getPath: () => '/admin/main/treated-documents' },
  UNTREATED_DOCUMENT: { getPath: () => '/admin/main/untreated-documents' },
};

const defaultRoutes = {
  admin: routes.STATISTICS.getPath(),
  annotator: routes.ANNOTATION.getPath(),
  publicator: routes.SPECIAL_DOCUMENTS.getPath(),
};
