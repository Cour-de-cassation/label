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
      optionItems: {
        resetPassword: 'Réinitialiser le mot de passe',
      },
      passwordResetPopup: {
        passwordResetConfirmation: 'Le mot de passe a bien été réinitialisé',
        passwordIndication:
          'Veuillez noter et lui transmettre son nouveau mot de passe ci-après. Ce mot de passe doit être changé dès la première connexion afin d’assurer la sécurité du système.',
        button: "C'est noté",
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
    adminViews: {
      label: 'Choisir une vue',
      values: {
        admin: 'Vue administrateur',
        annotator: 'Vue annotateur',
        specialDocumentAnnotator: 'Vue publicateur',
      },
    },
    changePassword: 'Modifier le mot de passe',
    confirmPassword: 'Confirmer le nouveau mot de passe',
    decisionNumberPlaceholder: 'Rechercher...',
    documentStatus: {
      loaded: 'Chargé depuis la base SDER',
      nlpAnnotating: "En cours d'annotation par le moteur NLP",
      free: 'Disponible pour être annoté',
      pending: 'Assigné à un agent',
      saved: 'En cours de traitement par un agent',
      done: 'Validé',
      rejected: 'Bloqué',
      exported: 'Publié',
    },
    filters: {
      button: 'Filtrer',
      chips: {
        mustHaveAddedAnnotations: 'Avec sous-annotations',
        mustHaveDeletedAnnotations: 'Avec sur-annotations',
        mustHaveModifiedAnnotations: 'Avec modifications de catégorie',
        mustHaveNoModifications: 'Aucune modification',
        mustHaveResizedBiggerAnnotations: 'Avec redimensionnements +',
        mustHaveResizedSmallerAnnotations: 'Avec redimensionnements -',
      },
      intervalDate: {
        start: 'Date début',
        end: 'Date fin',
      },
    },
    problemReportType: { bug: 'Bug', annotationProblem: "Problème lié à l'annotation", suggestion: 'Suggestion' },
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
    category: 'Catégorie',
    changeCategory: 'Changer de catégorie',
    close: 'Fermer',
    describeTheProblem: 'Décrivez le problème. Soyez exhaustif.',
    delete: 'Supprimer',
    deletionOption: {
      annotation: 'Annotation seule',
      representative: 'Représentant seul ({count} annot.)',
      entity: "Supprimer toute l'entité",
    },
    documentSelector: {
      publishedDocumentTitle: 'Cette décision sera publiée',
      genericDocumentInfoEntries: {
        annotations: 'Annotations',
        entities: 'Entités',
        linkedEntities: "Liaison d'entités",
        wordCount: 'Mots',
      },
      specificDocumentInfoEntries: {
        decisionNumber: 'N° de décision',
        chamberName: 'Chambre',
      },
      noDocumentLeft: "Il n'y a plus de documents à traiter pour le moment...",
      pleaseRefresh: 'Veuillez rafraîchir la page',
      start: 'Commencer',
      unknownJuridiction: 'Juridiction non précisée',
    },
    identicalOccurrencesSpotted: 'occurence(s) identique(s) détectée(s)',
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
    cancel: 'Annuler',
    copyToClipboard: 'Copier dans le presse-papier',
    logout: 'Se déconnecter',
    refresh: 'Rafraîchir',
    moreOptions: "Plus d'options",
    passwordChangedConfirmation: { text: 'Votre mot de passe a été modifié.', button: 'OK' },
    settingsDrawer: {
      displayMode: "Type d'affichage",
      darkMode: 'Mode sombre',
      lightMode: 'Mode lumineux',
      title: 'Réglages',
    },
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
        status: 'Statut',
        text: 'Message',
        type: 'Type',
      },
      optionItems: {
        answerByEmail: 'Répondre par email...',
        deleteProblemReport: "Supprimer l'alerte",
        openDocument: 'Ouvrir la décision...',
        reassignToAgent: "Renvoyer à l'agent",
        validate: 'Valider la décision',
      },
      mailSubject: 'Alerte sur le document {documentNumber}',
    },
  },
  specialDocumentsPage: {
    title: 'Arrêts P',
    table: {
      columnTitles: {
        number: 'N° décision',
        status: 'Statut',
        importDate: "Date d'import",
      },
      status: {
        notTreated: 'En traitement',
        toBePublished: 'À publier',
        published: 'Publié',
      },
      optionItems: {
        openAnonymizedDocument: 'Ouvrir la décision anonymisée...',
        markAsPublished: 'Marquer comme publiée',
        markAsUnPublished: 'Marquer comme à publier',
      },
    },
  },
  statisticsPage: {
    header: {
      title: 'Administration',
      subtitle: 'Statistiques',
    },
    treatedDecisions: 'Décisions traitées',
    filter: {
      fields: {
        agents: 'Agents',
        mustHaveAddedAnnotations: 'Avec sous-annotations',
        mustHaveDeletedAnnotations: 'Avec sur-annotations',
        mustHaveModifiedAnnotations: 'Avec modifications de catégorie',
        mustHaveNoModifications: 'Aucune modification',
        mustHaveResizedBiggerAnnotations: 'Avec redimensionnements +',
        mustHaveResizedSmallerAnnotations: 'Avec redimensionnements -',
        publicationCategory: 'Diffusion',
        source: 'Base de données source',
      },
    },
  },
  treatedDocumentsPage: {
    header: {
      title: 'Administration',
      subtitle: 'Décisions traitées',
    },
    table: {
      annotationDiffDrawer: {
        title: 'Modifications',
      },
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
        duration: { title: 'Tps', tooltipText: 'Temps de traitement (agent principal)' },
        publicationCategory: { title: 'Dif.', tooltipText: 'Type de diffusion' },
        date: 'Traité le',
        surAnnotation: { title: 'Sur.', tooltipText: 'Nombre de surannotations' },
        resizeAnnotationSmaller: { title: 'R.-', tooltipText: 'Sur-annotations partielles (redimensionnements)' },
        subAnnotation: { title: 'Sous.', tooltipText: 'Sous-annotations partielles' },
        resizeAnnotationBigger: { title: 'R.+', tooltipText: 'Sous-annotations partielles (redimensionnements)' },
        changeAnnotation: { title: 'Cat.', tooltipText: 'Modifications de catégorie' },
        number: { title: 'N° décision', tooltipText: 'Numéro de la décision' },
      },
      statistics: {
        computation: {
          total: 'Total',
          average: 'Moyenne',
        },
        fields: {
          addedAnnotationsCount: 'Sous-annotations',
          annotationsCount: 'Annotations',
          deletedAnnotationsCount: 'Sur-annotations',
          linkedEntitiesCount: 'Liaisons',
          modifiedAnnotationsCount: 'Modifications de catégorie',
          resizedBiggerAnnotationsCount: 'Redimensionnements +',
          resizedSmallerAnnotationsCount: 'Redimensionnements -',
          treatmentDuration: 'Temps de traitement',
          wordsCount: 'Mots',
        },
      },
      optionItems: {
        openDocument: 'Ouvrir la décision...',
        displayAnnotationDiff: 'Afficher les modifications',
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
        userName: 'Attribué à',
        status: 'Statut',
        importDate: "Date d'import",
      },
      optionItems: {
        freeDocument: 'Libérer la décision',
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
