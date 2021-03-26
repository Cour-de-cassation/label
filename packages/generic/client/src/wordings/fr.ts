export { fr };

const fr = {
  agentsPage: {
    header: {
      title: 'Administration',
      subtitle: 'Gestion des agents',
    },
    createAgentDrawer: {
      title: 'Créer un agent',
      fields: {
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        role: 'Sélectionnez un rôle',
      },
      submit: "Créer l'agent",
      createdAgentPopup: {
        createdAgentConfirmation: "L'agent a bien été créé.",
        passwordIndication:
          'Veuillez noter et lui transmettre le mot de passe temporaire suivant. Ce mot de passe doit être changé dès la première connexion afin d’assurer la sécurité du système.',
        button: "C'est noté",
      },
    },
    table: {
      columnTitles: {
        name: 'Nom',
        email: 'E-mail',
        role: 'Habilitation',
      },
      roles: {
        admin: 'Administrateur',
        annotator: 'Annotateur',
        specialDocumentAnnotator: 'Annotateur arrêt P',
      },
    },
  },
  business: {
    account: 'Compte',
    changePassword: 'Modifier le mot de passe',
    confirmPassword: 'Confirmer le nouveau mot de passe',
    filters: {
      button: 'Filtrer',
      intervalDate: {
        start: 'Date début',
        end: 'Date fin',
      },
    },
    newPassword: 'Nouveau mot de passe',
    newPasswordsDontMatch: 'Les nouveaux mots de passe ne correspondent pas',
    newPasswordInstructions: 'Le mot de passe doit contenir au moins 8 caractères',
    previousPassword: 'Ancien mot de passe',
    update: 'Mettre à jour',
    wrongPassword: 'Le mot de passe est erroné',
  },
  homePage: {
    anonymisedView: 'Vue anonymisée',
    applyEveryWhere: 'Appliquer à tous',
    askedAnnotations: 'Annotations demandées',
    cancel: 'Annuler',
    category: 'Catégorie',
    changeCategory: 'Changer de catégorie',
    close: 'Fermer',
    darkMode: 'Mode sombre',
    describeTheProblem: 'Décrivez le problème. Soyez exhaustif.',
    delete: 'Supprimer',
    deletionOption: {
      annotation: 'Annotation seule',
      representative: 'Représentant seul ({count} annot.)',
      entity: "Supprimer toute l'entité",
    },
    displayMode: "Type d'affichage",
    documentSelector: {
      publishedDocumentTitle: 'Cette décision sera publiée',
      documentInfoEntries: {
        annotations: 'Annotations',
        entities: 'Entités',
        linkedEntities: "Liaison d'entités",
      },
      start: 'Commencer',
      wholeCheck: 'Lecture exhaustive',
    },
    enterYourText: 'Saisissez votre texte...',
    identicalOccurrencesSpotted: 'occurence(s) identique(s) détectée(s)',
    lightMode: 'Mode lumineux',
    link: 'Créer une liaison',
    originalText: 'Texte original',
    problemIsBlocking: `Ce problème m'empêche de terminer l'annotation du document.`,
    problemType: 'Type de problème',
    pseudonymisation: 'Pseudonymisation',
    publishedDocument: 'Cette décision sera publiée',
    redo: 'Rétablir',
    reportProblem: 'Signaler un problème',
    reset: 'Réinitialiser',
    send: 'Envoyer',
    settings: 'Réglages',
    undo: 'Annuler',
    unlink: 'Supprimer la liaison',
    unlinkOption: {
      __one__: 'Cette liaison',
      __all__: 'Toutes les liaisons',
    },
    validate: 'Valider',
  },
  loginPage: {
    login: 'Connexion',
    email: 'E-mail',
    forgottenPassword: 'Mot de passe oublié ?',
    password: 'Mot de passe',
    pleaseTryAgain: 'Veuillez réessayer.',
    wrongEmailOrPassword: "L'email et/ou le mot de passe sont erronés.",
  },
  errorPage: 'Une erreur est survenue...',
  shared: {
    daysOfWeek: {
      monday: 'L',
      tuesday: 'M',
      wednesday: 'M',
      thursday: 'J',
      friday: 'V',
      saturday: 'S',
      sunday: 'D',
    },
    back: 'Précédent',
    copyToClipboard: 'Copier dans le presse-papier',
    logout: 'Se déconnecter',
    moreOptions: "Plus d'options",
    problemReportType: { bug: 'Bug', annotationProblem: "Problème lié à l'annotation", suggestion: 'Suggestion' },
  },
  loadingPage: 'Veuillez patienter...',
  problemReportsPage: {
    header: {
      title: 'Administration',
      subtitle: 'Alertes',
    },
    table: {
      columnTitles: {
        agent: 'Agent',
        date: 'Date',
        number: 'N° décision',
        text: 'Message',
        type: 'Type',
      },
      optionItems: {
        openDocument: 'Ouvrir la décision...',
        reinjectIntoStream: 'Réinjecter dans le flux',
        reassignToAgent: "Renvoyer à l'agent",
      },
    },
  },
  specialDocumentsPage: {
    title: 'Arrêts P',
    table: {
      columnTitles: {
        number: 'N° décision',
      },
      optionItems: {
        openAnonymizedDocument: 'Ouvrir la décision anonymisée...',
      },
    },
  },
  treatedDocumentsPage: {
    header: {
      title: 'Administration',
      subtitle: 'Décisions traitées',
    },
    table: {
      filter: {
        exportButton: 'Exporter',
        resultsCount: '{count} décisions affichées',
        chips: {
          mustHaveSurAnnotations: 'Avec sur annotation',
          mustHaveSubAnnotations: 'Avec sous annotation',
          startDate: '> {startDate}',
          endDate: '< {endDate}',
        },
        fields: {
          agents: 'Agents',
          mustHaveSurAnnotations: 'Avec sur annotation',
          mustHaveSubAnnotations: 'Avec sous annotation',
          startDate: 'Date début',
          endDate: 'Date fin',
          publicationCategoryLetter: 'Diffusion',
        },
      },
      columnTitles: {
        agent: { title: 'Agent', tooltipText: 'Agent principal' },
        duration: { title: 'Tps', tooltipText: 'Temps de traitement' },
        publicationCategory: { title: 'Dif.', tooltipText: 'Type de diffusion' },
        date: 'Traité le',
        surAnnotation: { title: 'Sur', tooltipText: 'Nombre de surannotations' },
        resizeAnnotationSmaller: { title: 'R.-', tooltipText: '...dont redimensionnements' },
        subAnnotation: { title: 'Ss.', tooltipText: 'Nombre de sous-annotations' },
        resizeAnnotationBigger: { title: 'R.+', tooltipText: '...dont redimensionnements' },
        changeAnnotation: { title: 'Mod.', tooltipText: 'Modifications de catégorie' },
        number: { title: 'N° décision', tooltipText: 'Numéro de la décision' },
      },
      statistics: {
        computation: {
          total: 'Total',
          average: 'Moyenne',
        },
        fields: {
          changeAnnotation: 'Mod.',
          duration: 'Tps',
          resizeAnnotationBigger: 'R.+',
          resizeAnnotationSmaller: 'R.-',
          surAnnotation: 'Sur',
          subAnnotation: 'Ss.',
        },
      },
      optionItems: {
        openDocument: 'Ouvrir la décision...',
      },
    },
  },
  untreatedDocumentsPage: {
    header: {
      title: 'Administration',
      subtitle: 'Flux de décisions',
    },
    table: {
      columnTitles: {
        number: 'N° décision',
        publicationCategory: { title: 'Dif.', tooltipText: 'Type de diffusion' },
      },
      filter: {
        resultsCount: '{count} décisions affichées',
        chips: {
          publicationCategoryLetter: 'Arrêts {publicationCategoryLetter}',
        },
        fields: {
          publicationCategoryLetter: 'Diffusion',
        },
      },
    },
  },
};
