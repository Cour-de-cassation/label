export { fr };

const fr = {
  business: {
    account: 'Compte',
    adminViews: {
      label: 'Choisir une vue',
      values: {
        admin: 'Vue administrateur',
        annotator: 'Vue annotateur',
        publicator: 'Vue publicateur',
        scrutator: 'Vue scrutateur',
      },
    },
    decisionNumberPlaceholder: 'Rechercher...',
    decisionNumberHint: 'Numéro de décision à rechercher',
    documentReviewFilterStatus: {
      none: { filter: 'Décisions non revues' },
      viewed: { iconTooltip: 'Vue par {viewerNames}', filter: 'Décisions revues' },
      amended: { iconTooltip: 'Revue et modifiée', filter: 'Décisions revues et modifiées' },
    },
    documentRoute: {
      automatic: 'Automatique',
      exhaustive: 'Exhaustif',
      simple: 'Simple',
      confirmation: 'Confirmation',
      request: 'Demande',
      default: 'N/A',
    },
    documentStatus: {
      loaded: "En attente d'annotation par le moteur NLP",
      nlpAnnotating: "En cours d'annotation par le moteur NLP",
      free: 'Disponible pour être relu',
      pending: 'Assigné à un agent',
      saved: 'En cours de relecture par un agent',
      toBePublished: 'À publier',
      done: 'Prêt à être exporté',
      toBeConfirmed: 'A confirmer par un administrateur',
      locked: 'En alerte',
      rejected: 'Rejeté',
    },
    errors: {
      deleteProblemReportFailed: 'La suppression du signalement a échoué. Veuillez recharger la page.',
      deletePreAssignationFailed: 'La suppression de la pré-assignation a échoué. Veuillez recharger la page.',
      deleteDocumentFailed: 'La suppression du document a échoué. Veuillez recharger la page.',
      pendingDocumentsFreed:
        'Les documents ont été libérés, ils ne vous sont maintenant plus réservés. Veuillez recharger la page.',
      noUserIdFound:
        'Une erreur est survenue lors de votre identification. Veuillez vous déconnecter et vous reconnecter.',
      assignDocumentFailed: 'La réassignation du document a échoué. Veuillez recharger la page.',
      deleteHumanTreatmentsByDocumentIdFailed:
        'La suppression des traitements manuels effectués sur ce document a échoué. Veuillez recharger la page.',
      updateDocumentStatusFailed: 'La mise à jour du statut du document a échoué. Veuillez recharger la page.',
      updateDocumentRouteFailded: 'La mise à jour du circuit de relecture a échoué. Veuillez recharger la page.',
      updateTreatmentFailed: 'La mise à jour des annotations pour ce traitement a échoué. Veuillez recharger la page.',
      updateProblemReportHasBeenReadFailed:
        'La mise à jour du statut de lecture du signalement a échoué. Veuillez recharger la page.',
    },
    filters: {
      button: 'Filtrer',
      resultsCount: '{count} décisions affichées',
      chips: {
        documentCreationDate: 'Importé ',
        treatmentDate: 'Traité ',
        mustHaveSubAnnotations: 'Avec sous-annotations',
        mustHaveSurAnnotations: 'Avec sur-annotations',
        source: 'BDD {source}',
        publicationCategoryLetter: 'Arrêts {publicationCategoryLetter}',
      },
      fields: {
        mustHaveSurAnnotations: 'Avec sur annotation',
        mustHaveSubAnnotations: 'Avec sous annotation',
        publicationCategoryLetter: 'Diffusion',
        source: 'Source',
        jurisdiction: 'Juridiction',
        userName: 'Agent',
        route: 'Circuit de traitement',
        importer: 'Importateur',
        documentReviewFilterStatus: 'Statut de revue',
        treatmentDate: {
          start: 'Début traitement',
          end: 'Fin traitement',
        },
        documentCreationDate: {
          start: 'Début import',
          end: 'Fin import',
        },
      },
      columnTitles: {
        documentNumber: 'N° décision',
        chamberName: 'Chambre',
        appealNumber: 'N° de pourvoi',
        occultationBlock: { title: 'Bloc', tooltipText: "Bloc d'occultation" },
        jurisdiction: { title: 'Cour', tooltipText: 'Juridiction de la décision' },
        publicationCategory: { title: 'Dif.', tooltipText: 'Type de diffusion' },
        session: { title: 'Formation', tooltipText: 'Acronyme de la formation' },
        source: { title: 'Source', tooltipText: 'Base de données source' },
        userName: 'Attribué à',
        route: { title: 'Circuit', tooltipText: 'Circuit de traitement' },
        status: 'Statut',
        decisionDate: { title: 'Date décision', tooltipText: 'Date de rendu de la décision' },
        creationDate: { title: 'Date import', tooltipText: "Date d'import de la décision" },
        treatmentDate: 'Traité le',
        workingUser: { title: 'Agent', tooltipText: 'Agent principal' },
        problemReportType: 'Type',
        problemReportDate: 'Date du signalement',
        problemReportText: 'Message',
        reviewStatus: { title: 'Revue', tooltipText: 'Statut de revue' },
        loss: { title: 'Loss', tooltipText: 'Complexité de la décision et du traitement' },
        surAnnotationsCount: { title: 'Sur.', tooltipText: 'Nombre de sur-annotations' },
        subAnnotationsSensitiveCount: {
          title: 'Sous. (sens.)',
          tooltipText: 'Nombre de sous-annotations sensibles',
        },
        subAnnotationsNonSensitiveCount: {
          title: 'Sous. (autres)',
          tooltipText: 'Nombre de sous-annotations non sensibles',
        },
        duration: { title: 'Tps', tooltipText: 'Temps de traitement total' },
      },
    },
    problemReportType: { bug: 'Bug', annotationProblem: "Problème lié à l'annotation", suggestion: 'Suggestion' },
    update: 'Mettre à jour',
    userRoles: {
      admin: 'Administrateur',
      annotator: 'Annotateur',
      publicator: 'Publicateur',
      scrutator: 'Scrutateur',
    },
  },
  homePage: {
    anonymisedView: 'Vue anonymisée',
    applyEveryWhere: 'Appliquer à tous',
    askedAnnotations: 'Annotations demandées',
    askedAdditionalOccultations: "Demandes d'occultation particulières :",
    additionalTermsParsingFailed:
      "Attention, les demandes d'occultations particulières n'ont pas pu être annotées automatiquement intégralement.",
    promptRawAdditionalTermsText: 'Texte fourni par la juridiction :',
    additionalTermsToAnnotate: 'Termes supplémentaires à annoter :',
    additionalTermsToUnAnnotate: 'Termes à NE PAS annoter :',
    annotationGuide: "Guide d'annotation",
    category: 'Catégorie',
    changeCategory: 'Changer de catégorie',
    checklist: 'Mises en doute : ',
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
    motivationOccultation: 'Les débats de cette décision ne sont pas publics, les motifs sont occultés.',
    problemIsBlocking: `Ce problème m'empêche de terminer l'annotation du document.`,
    problemType: 'Type de problème',
    publishedDocument: 'Cette décision sera publiée',
    redo: 'Rétablir',
    replacement: 'Remplacement',
    reportProblem: 'Signaler un problème',
    reset: 'Réinitialiser',
    send: 'Envoyer',
    scrutatorInfo: 'Vous êtes en mode lecture seule. Les modifications que vous ferez ne seront pas sauvegardées.',
    simpleReviewScreen: {
      title: 'Relecture simple',
      subtitle:
        'Ce document ne nécessite pas de relecture exhaustive de la décision. Vous pouvez effectuer la vérification par le panneau latéral.',
    },
    undo: 'Annuler',
    unlink: 'Supprimer la liaison',
    unlinkOption: {
      __one__: 'Cette liaison',
      __all__: 'Toutes les liaisons',
    },
    validate: 'Valider',
  },
  errorPage: {
    title: 'Une erreur est survenue...',
    errorCode: 'Erreur {code}',
    onRequest: "L'erreur est apparue sur la requête {route}",
  },
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
    intervalDate: {
      startDate: 'depuis le {startDate}',
      endDate: "jusqu'au {endDate}",
      both: 'du {startDate} au {endDate}',
      sameDay: 'le {date}',
    },
    back: 'Précédent',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    copyToClipboard: 'Copier dans le presse-papier',
    logout: 'Se déconnecter',
    refresh: 'Rafraîchir',
    moreOptions: "Plus d'options",
    or: 'ou',
    settingsDrawer: {
      displayMode: "Type d'affichage",
      darkMode: 'Mode sombre',
      lightMode: 'Mode lumineux',
      title: 'Réglages',
    },
    personalStatisticsDrawer: {
      title: 'Statistiques personnelles',
    },
  },
  loadingPage: 'Veuillez patienter...',
  problemReportsPage: {
    header: {
      title: 'Administration',
      subtitle: 'Signalements',
    },
    table: {
      optionItems: {
        answerByEmail: 'Répondre par email...',
        deleteProblemReport: 'Supprimer le signalement',
        deleteDocument: 'Supprimer définitivement le document',
        openDocument: 'Ouvrir la décision...',
        reassignToWorkingUser: "Renvoyer à l'agent",
        validate: 'Débloquer et valider la décision',
      },
      mailSubject: 'Alerte sur le document {documentNumber}',
      popupConfirmMessage: 'Souhaitez-vous vraiment supprimer ce document ? Cette action est irréversible.',
    },
  },
  preAssignDocumentsPage: {
    header: {
      title: 'Administration',
      subtitle: 'Pré-assignation des décisions',
    },
    table: {
      columnTitles: {
        source: 'Source',
        number: 'N° de décision ou pourvoi',
        agent: 'Agent',
        creationDate: 'Date de création',
      },
      optionItems: {
        delete: 'Supprimer la pré-affectation',
      },
    },
    createPreAssignationDrawer: {
      title: 'Ajouter une pré-assignation',
      fields: {
        source: 'Source',
        number: 'N° de document, pourvoi (au format "00-00.000") ou RG (au format "00/00000")',
        numberPlaceholder: 'Numéro',
        user: 'Agent',
      },
      submit: 'Créer la pré-assignation',
    },
  },
  publishableDocumentsPage: {
    title: 'Arrêts P',
    confirmationDocumentAlert: "Pour information : Il y a {count} décision(s) en confirmation de lecture aujourd'hui.",
    table: {
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
    agregatedStatisticsHintMessage: 'Veuillez sélectionner un filtre pour afficher les statistiques.',
    specificStatisticsHintMessage:
      "Veuillez chercher par numéro de décision pour afficher les statistiques. Le nom de l'agent ayant traité la décision est conservé 6 mois.",
    specificStatisticsNotFound: "Il n'y a pas de statistiques pour ce numéro de document.",
    box: {
      computation: {
        total: 'Total',
        average: 'Moyenne',
      },
      fields: {
        annotationsCount: 'Annotations',
        surAnnotationsCount: 'Sur.',
        subAnnotationsSensitiveCount: 'Sous. (sens.)',
        subAnnotationsNonSensitiveCount: 'Sous. (autres)',
        treatmentDuration: 'Temps de traitement',
        wordsCount: 'Mots',
        documentNumber: 'N° décision',
        endCaseCode: 'Code décision',
        NACCode: 'Code NAC',
        chamberName: 'Chambre',
        circuit: 'Circuit',
        importer: 'Importeur',
        juridiction: 'Juridiction',
        documentTreatment: 'Temps de traitement',
        agent: 'Agent',
        decisionDate: 'Date de décision',
        treatmentDate: 'Date de Traitement',
      },
    },
  },
  summaryPage: {
    header: {
      title: 'Administration',
      subtitle: 'Sommaire',
    },
    welcomeMessage: 'Bienvenue dans Label',
    box: {
      fields: {
        loadedDocuments: 'Documents chargés',
        nlpAnnotatingDocuments: 'Documents en annotation',
        freeDocuments: 'Documents en attente',
        pendingDocuments: 'Documents assignés',
        savedDocuments: 'Documents en relecture',
        doneDocuments: 'Documents traités',
        lockedDocuments: 'Documents bloqués',
        rejectedDocuments: 'Documents rejetés',
      },
    },
  },
  toBeConfirmedDocumentsPage: {
    header: { title: 'Administration', subtitle: 'Décisions à confirmer' },
    table: {
      optionItems: {
        openDocument: 'Ouvrir la décision...',
      },
    },
  },
  treatedDocumentsPage: {
    header: {
      title: 'Administration',
      subtitle: 'Décisions traitées',
    },
    table: {
      resetDocumentConfirmationPopup: {
        text:
          'Cette action va supprimer toutes les corrections effectuées par les agents et renvoyer la décision dans le flux à traiter.\nÊtes-vous sûr de vouloir effectuer cette opération ?',
      },
      annotationDiffDrawer: {
        title: 'Modifications',
        subtitle: 'Décision n° {documentNumber}, traitée par {userName}',
      },
      optionItems: {
        openDocument: 'Ouvrir la décision...',
        displayAnnotationDiff: 'Afficher les modifications',
        resetTheDocument: 'Réinitialiser la décision',
        reassignToWorkingUser: "Renvoyer à l'agent",
      },
    },
  },
  untreatedDocumentsPage: {
    header: {
      title: 'Administration',
      subtitle: 'Flux de décisions',
    },
    table: {
      assignDocumentConfirmationPopup: {
        text:
          "Cette action supprimera les annotations effectuées au préalable sur ce document, et vous assignera ensuite ce document pour traitement. Si l'utilisateur était en train d'annoter le document, il devra recharger la page. Souhaitez-vous continuer ?",
      },
      optionItems: {
        assignToMyself: "M'assigner la décision",
        assignToWorkingUser: {
          label: 'Assigner à un agent',
          description: 'A quel agent souhaitez-vous assigner la décision ?',
          dropdownLabel: "Nom de l'agent",
        },
        freeDocument: 'Libérer la décision',
        openAnonymizedDocument: 'Ouvrir la décision anonymisée...',
      },
    },
  },
};
