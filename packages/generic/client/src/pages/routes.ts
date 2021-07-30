export { defaultRoutes, routes };

const routes = {
  ADMIN: { getPath: () => '/admin' },
  ADMIN_MAIN: { getPath: () => '/admin/main/' },
  WORKING_USERS: { getPath: () => '/admin/main/working-users' },
  ANNOTATION: { getPath: () => '/annotation' },
  ANONYMIZED_DOCUMENT: { getPath: (documentId?: string) => `/anonymized-document/${documentId || ':documentId'}` },
  DEFAULT: { getPath: () => '/' },
  DOCUMENT: { getPath: (documentId?: string) => `/admin/document/${documentId || ':documentId'}` },
  LOGIN: { getPath: () => '/login' },
  PROBLEM_REPORTS: { getPath: () => '/admin/main/problem-reports' },
  RESET_PASSWORD: { getPath: () => '/reset-password' },
  PUBLISHABLE_DOCUMENTS: { getPath: () => '/publishable-documents' },
  STATISTICS: { getPath: () => '/admin/main/statistics' },
  TREATED_DOCUMENTS: { getPath: () => '/admin/main/treated-documents' },
  UNTREATED_DOCUMENT: { getPath: () => '/admin/main/untreated-documents' },
};

const defaultRoutes = {
  admin: routes.STATISTICS.getPath(),
  annotator: routes.ANNOTATION.getPath(),
  publicator: routes.PUBLISHABLE_DOCUMENTS.getPath(),
};
