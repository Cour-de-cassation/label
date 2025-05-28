/* eslint-disable @typescript-eslint/ban-types */
/* We don't use ban-types due it wasn't banned: theses types were in dbsder-api-types*/
export namespace Deprecated {
  export enum LabelStatus {
    TOBETREATED = 'toBeTreated',
    LOADED = 'loaded',
    DONE = 'done',
    EXPORTED = 'exported',
    BLOCKED = 'blocked',
    IGNORED_DEBAT_NON_PUBLIC = 'ignored_debatNonPublic',
    IGNORED_DECISION_NON_PUBLIQUE = 'ignored_decisionNonPublique',
    IGNORED_CODE_DECISION_BLOQUE_CC = 'ignored_codeDecisionBloqueCC',
    IGNORED_DATE_DECISION_INCOHERENTE = 'ignored_dateDecisionIncoherente',
    IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE = 'ignored_codeNACdeDecisionNonPublique',
    IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE = 'ignored_codeNACdeDecisionPartiellementPublique',
    IGNORED_CODE_NAC_INCONNU = 'ignored_codeNACInconnu',
    IGNORED_CARACTERE_INCONNU = 'ignored_caractereInconnu',
    IGNORED_DATE_AVANT_MISE_EN_SERVICE = 'ignored_dateAvantMiseEnService',
    IGNORED_CONTROLE_REQUIS = 'ignored_controleRequis',
    IGNORED_DECISION_NON_PUBLIQUE_PAR_ZONAGE = 'ignored_decisionNonPubliqueParZonage',
    IGNORED_DECISION_PARTIELLEMENT_PUBLIQUE_PAR_ZONAGE = 'ignored_decisionPartiellementPubliqueParZonage',
    IGNORED_BLOC_OCCULATION_NON_DEFINI = 'ignored_blocOcculationNonDefini',
    IGNORED_RECOMMANDATION_OCCULTATION_NON_SUIVIE = 'ignored_recommandationOccultationNonSuivie',
    IGNORED_JURIDICTION_EN_PHASE_DE_TEST = 'ignored_juridictionEnPhaseDeTest',
  }

  /**
   * publishStatus:
   *  toBePublished = décision à publier (positionné lorsque labelStatus passe à 'done' dans Label)
   *  pending = en cours de traitement (préparation et optimisation en vue de l'indexation)
   *  success =  publication effectuée avec succès
   *  failure_preparing = échec lors de la préparation (côté plateforme privée)
   *  failure_indexing = échec lors de l'indexation (côté plateforme publique/Elasticsearch)
   *  blocked = publication bloquée (positionné en amont suivant les besoins, par exemple lors du passage
   *            de labelStatus à 'done' pour une décision qui nécessiterait une validation finale avant
   *            publication)
   *  unpublished = décision dépubliée (devra repasser à 'toBePublished', manuellement ou automatiquement,
   *                afin que la décision soit à nouveau publiée)
   *
   * Could have:
   *  toBePublishedImmediately = à publier immédiatement (via un job hors "schedule" tournant en continu
   *                             et indépendant du job traitant les décisions 'toBePublished')
   */
  export enum PublishStatus {
    TOBEPUBLISHED = 'toBePublished',
    // TOBEPUBLISHEDIMMEDIATELY = 'toBePublishedImmediately',
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILURE_PREPARING = 'failure_preparing',
    FAILURE_INDEXING = 'failure_indexing',
    BLOCKED = 'blocked',
    UNPUBLISHED = 'unpublished',
  }

  export enum LabelRoute {
    AUTOMATIC = 'automatic',
    EXHAUSTIVE = 'exhaustive',
    SIMPLE = 'simple',
    CONFIRMATION = 'confirmation',
    REQUEST = 'request',
    DEFAULT = 'default',
  }

  /**
   * typePartie:
   * PP = personne physique,
   * PM = personne morale,
   * AA = autorité administrative
   * NA = non applicable ou non disponible (TCOM)
   */

  export enum TypePartie {
    PP = 'PP',
    PM = 'PM',
    AA = 'AA',
    NA = 'NA',
  }

  /**
   *Qualité de la partie :
   * Si Personne Physique :
   *  I = Demandeur
   *  K = Défendeur
   *  M = Partie intervenante
   *  F = Autre partie
   *
   * Si Personne Morale :
   *  J = Demandeur
   *  L = Défendeur
   *  G = Autre
   *  N = Partie intervenante
   */

  export enum QualitePartie {
    F = 'F',
    G = 'G',
    I = 'I',
    J = 'J',
    K = 'K',
    L = 'L',
    M = 'M',
    N = 'N',
  }

  export interface Annotation {
    category: string;
    entityId: string;
    start: number;
    text: string;
    score: number;
    source: string;
  }

  type nlpVersionDetails = {
    version: string;
    date: string;
  };

  type nlpVersion = {
    juriSpacyTokenizer: nlpVersionDetails;
    juritools: nlpVersionDetails;
    pseudonymisationApi: nlpVersionDetails;
    model: {
      name: string;
    };
  };

  export type Check = {
    check_type: string;
    message: string;
    short_message: string;
    entities: {
      text: string;
      start: number;
      category: string;
      source: string;
      score: number;
      entityId: string;
      end: number;
    }[];
    sentences: { start: number; end: number }[];
    metadata_text: string[];
  };

  export interface LabelTreatment {
    annotations: Annotation[];
    source: string;
    order: number;
    version?: nlpVersion;
    treatmentDate?: string;
    checklist?: Check[];
  }

  export interface DecisionAnalyse {
    analyse: string[];
    doctrine: string;
    link: string;
    reference: string[];
    source: string;
    summary: string;
    target: string;
    title: string[];
  }

  export interface PartieTJ {
    type: TypePartie;
    nom: string;
    prenom?: string;
    civilite?: string;
    qualite?: QualitePartie;
  }

  export interface DecisionOccultation {
    additionalTerms: string;
    categoriesToOmit: string[];
    motivationOccultation: boolean;
  }

  export enum Sources {
    CC = 'jurinet',
    TJ = 'juritj',
    CA = 'jurica',
    TCOM = 'juritcom',
  }

  export interface Zoning {
    zones?: ZoningZones;
    introduction_subzonage?: ZoningIntroductionSubzonage;
    visa?: string[];
    is_public?: number;
    is_public_text?: string[];
    arret_id: number;
  }

  export interface ZoningZones {
    introduction?: { start: number; end: number };
    moyens?: { start: number; end: number } | Array<{ start: number; end: number }>;
    'expose du litige'?: { start: number; end: number } | Array<{ start: number; end: number }>;
    motivations?: { start: number; end: number } | Array<{ start: number; end: number }>;
    dispositif?: { start: number; end: number };
    'moyens annexes'?: { start: number; end: number };
  }

  export interface ZoningIntroductionSubzonage {
    n_arret?: string;
    formation?: string;
    publication?: string[];
    juridiction: string;
    chambre: string;
    pourvoi?: string[];
    composition?: { start: number; end: number };
  }

  export interface DecisionAssociee {
    numeroRegistre: string;
    numeroRoleGeneral: string;
    idJuridiction: string;
    date: string;
    idDecisionWinci?: string;
  }
  export interface President {
    fonction: string;
    nom: string;
    prenom?: string;
    civilite?: string;
  }
  export enum Occultation {
    AUCUNE = 'aucune',
    CONFORME = 'conforme',
    SUBSTITUANT = 'substituant',
    COMPLEMENT = 'complément',
  }

  export enum Categories {
    ADRESSE = 'adresse',
    CADASTRE = 'cadastre',
    PERSONNEMORALE = 'personneMorale',
    PERSONNEPHYSIQUE = 'personnePhysique',
    PROFESSIONNELAVOCAT = 'professionnelAvocat',
    PROFESSIONNELMAGISTRATGREFFIER = 'professionnelMagistratGreffier',
    DATENAISSANCE = 'dateNaissance',
    DATEDECES = 'dateDeces',
    DATEMARIAGE = 'dateMariage',
    INSEE = 'insee',
    NUMEROIDENTIFIANT = 'numeroIdentifiant',
    PLAQUEIMMATRICULATION = 'plaqueImmatriculation',
    COMPTEBANCAIRE = 'compteBancaire',
    LOCALITE = 'localite',
    NUMEROSIRETSIREN = 'numeroSiretSiren',
    SITEWEBSENSIBLE = 'siteWebSensible',
    ETABLISSEMENT = 'etablissement',
    TELEPHONEFAX = 'telephoneFax',
    // ANNOTATIONSUPPLEMENTAIRE = "annotationSupplementaire",
  }

  export interface DecisionDTO {
    _id?: string;
    analysis?: DecisionAnalyse;
    appeals: string[];
    chamberId: string;
    chamberName: string;
    dateCreation: string;
    dateDecision: string;
    decatt?: number[];
    jurisdictionCode: string;
    jurisdictionId: string;
    jurisdictionName: string;
    labelStatus: LabelStatus;
    publishStatus?: PublishStatus;
    occultation: DecisionOccultation;
    originalText: string;
    pseudoStatus?: string;
    pseudoText?: string;
    public?: boolean;
    registerNumber: string;
    solution?: string;
    sourceId: number;
    sourceName: Sources;
    zoning?: object; // Deprecated : replaced by originalTextZoning and pseudoTextZoning
    originalTextZoning?: Zoning;
    pseudoTextZoning?: Zoning;
    publication?: string[];
    formation?: string;
    blocOccultation: number;
    NAOCode?: string;
    natureAffaireCivil?: string;
    natureAffairePenal?: string;
    codeMatiereCivil?: string;
    NACCode?: string;
    NPCode?: string;
    endCaseCode?: string;
    filenameSource?: string;
    labelTreatments?: LabelTreatment[];
    parties?: PartieTJ[] | object[];
    pubCategory?: string;
    selection: boolean;
    sommaire?: string;
  }

  export interface DecisionTJDTO extends DecisionDTO {
    codeService: string;
    debatPublic: boolean;
    decisionAssociee: DecisionAssociee;
    indicateurQPC?: boolean;
    idDecisionTJ: string;
    idDecisionWinci?: string;
    libelleEndCaseCode: string;
    libelleNAC: string;
    libelleNatureParticuliere?: string;
    libelleService: string;
    matiereDeterminee: boolean;
    numeroRoleGeneral: string;
    pourvoiCourDeCassation: boolean;
    pourvoiLocal: boolean;
    president?: President;
    recommandationOccultation: Occultation;
  }

  export interface DecisionTCOMDTO extends DecisionDTO {
    idGroupement: string;
    debatPublic: boolean;
    idDecisionTCOM: string;
    codeProcedure?: string;
    libelleMatiere?: string;
    composition?: object[];
  }

  export interface CategorieCodeDecision {
    code: string;
    libelle: string;
  }

  export interface CategorieCodeNAC {
    code: string;
    libelle: string;
  }

  export interface CodeNAC {
    codeNAC: string;
    libelleNAC: string;
    blocOccultationCA?: number;
    blocOccultationTJ?: number;
    indicateurDecisionRenduePubliquement?: boolean;
    indicateurDebatsPublics?: boolean;
    indicateurAffaireSignalee?: boolean;
    categoriesToOmitTJ: Record<Occultation, Categories[]>;
    categoriesToOmitCA: Record<Occultation, Categories[]>;
    niveau1NAC: CategorieCodeNAC;
    niveau2NAC: CategorieCodeNAC;
    routeRelecture?: LabelRoute;
  }

  export interface CodeDecision {
    codeDecision: string;
    libelleCodeDecision?: string;
    categorieCodeDecision?: CategorieCodeDecision;
    isTransmissibleToCC?: boolean;
    overwritesNAC?: boolean;
    routeCA?: LabelRoute;
    routeTJ?: LabelRoute;
  }
}
