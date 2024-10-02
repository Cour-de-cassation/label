# Module SSO
Ce service implémente l'authentification unique (SSO) via **SAML 2** en de basant sur le framework **NestJS** et la bibliothèque `samlify`.   
Il gère l'authentification avec un fournisseur d'identité (IdP) tel que **Keycloak**, **Pages Blanches** ou tout autre fournisseur compatible SAML.   
Le service utilise la librairie **SAMLify** pour s'interfacer avec le SSO et faciliter la gestion des requêtes et des réponses SAML.

## Prérequis

- **Node.js** (version 16 ou plus récente)
- **NestJS**
- **SAMLify** : Bibliothèque pour gérer les interactions avec SAML 2.
- Un **Identity Provider (IdP)** compatible SAML 2.0 (par ex. Keycloak, Pages Blanches)
- Le fichier `sso_idp_metadata.xml` contient la configuration de l'Identity Provider.
- Le fichier `.env` contient les variables d'environnement nécessaires au fonctionnement du module.

## Technologies

- **NestJS** : Framework pour construire des applications Node.js performantes.
- **TypeScript** : Langage de programmation pour un typage statique.
- **Jest** : Framework de tests pour JavaScript.
- **Prettier** : Outil de formatage de code.
- **ESLint** : Outil de linting pour identifier et reporter les motifs dans le code JavaScript.

## Dépendances
### Le projet JURITCOM utilise les dépendances suivantes :
- `@nestjs/common`
- `@nestjs/core`
- `@nestjs/config`
- `@authenio/samlify-node-xmllint`
- `@nestjs/platform-express`
- `body-parser`
- `dotenv`
- `reflect-metadata`
- `samlify`

### Pré-requis

- Installer [nvm](https://github.com/nvm-sh/nvm) afin d'avoir la version utilisée pour cette application et lancer la commande :

```bash
nvm install
```

### Installation

Pour installer les packages nécessaires au bon fonctionnement de l'application, ouvrir un terminal et executer la commande suivante :

```bash
npm install
```

## Configuration
### Configurer les variables d'environnement:

    Les variables d'environnement nécessaires au fonctionnement du SSO doivent être configurées dans le fichier docker.env.example, situé à la racine du projet principal. Ce fichier doit ensuite être renommé en docker.env ou .env, selon le besoin, adapter les variables d'environnement si besoin

# Configuration du Service Provider (SP) 
<b> Les instructions spécifiques à la configuration du fournisseur d'identité (IdP) et du fournisseur de services (SP) sont détaillées dans le document suivant  :</b> `MANU_SSO_Configuration_IDP_SAML_VM_Test_V1.1.odt`

- SSO_SP_ENTITY_ID: Identifiant unique du SP (ie: SP-LABEL)
- SSO_SP_ASSERTION_CONSUMER_SERVICE_LOCATION: URL où le SP reçoit les assertions SAML après authentification
- SSO_SP_PRIVATE_KEY: Clé privée du Service Provider utilisée pour signer et déchiffrer les messages SAML échangés avec l'Identity Provider

# Configuration de l'Identity Provider (IdP)
- SSO_IDP_METADATA: Fichier XML contenant les métadonnées du IdP (Entity ID, certificats, endpoints).
- SSO_IDP_SINGLE_SIGN_ON_SERVICE_LOCATION: URL du SSO où le Service Provider redirige les utilisateurs pour l'authentification.
- SSO_IDP_SINGLE_LOGOUT_SERVICE_LOCATION: URL permettant la déconnexion  des utilisateurs


# Autres variables
SSO_IDP_KEYCLOAK=true # ou false si un autre IdP est utilisé

## Scripts
-   Voici une liste des scripts disponibles dans `package.json` :

| Commande           | Description                                                                                   |
|--------------------|-----------------------------------------------------------------------------------------------|
| `build`            | Clean et compile l'application NestJS.                                                        |
| `compile`          | Compile l'application NestJS.                                                                 |
| `format`           | Vérifie le formatage du code avec Prettier.                                                   |
| `lint`             | Vérifie le code TypeScript avec ESLint.                                                       |
| `test`             | Exécute les tests unitaires et d'intégration.                                                 |
| `test:watch`       | Exécute les tests en mode interactif avec surveillance des changements.                       |
| `test:cov`         | Exécute les tests avec génération de rapports de couverture.                                  |
| `fix`              | Corrige les erreurs de formatage avec ESLint et Prettier.                                     |    

## Tests
- Pour exécuter les tests, utilisez la commande suivante :

```bash
npm run test
```

- Pour exécuter les tests en mode interactif :

```bash
 npm run test:watch 
 ```

- Pour exécuter les tests avec un rapport de couverture :

```bash
 npm run test:cov 
 ```

## Fonctionnalités

### Génération des métadonnées



    La méthode `generateMetadata()` permet de générer et de récupérer les métadonnées du Service Provider (SP).


### Création d'une URL de demande de connexion


    La méthode `createLoginRequestUrl()` génère une URL pour initier la procédure de connexion via SAML 2.


### Analyse et traitement de la réponse SAML 2


    La méthode `parseResponse()` permet d'analyser et de traiter la réponse SAML reçue du IdP après une tentative de connexion.


### Création d'une URL de demande de déconnexion


     La méthode `createLogoutRequestUrl(user)` permet de créer une URL de déconnexion basée sur les informations d'utilisateur (nameID).


## Utilisation
L'exemple ci-dessous illustre l'utilisation du module SSO dans une application NestJs.


### Gestion de la session
Exemple d'implémentation de la gestion des sessions utilisateurs avec express-session.

#### Installation
```sh
npm install express-session
```

#### Configuration de la session
Dans votre application NestJS, procédez à la configuration d'express-session dans le fichier principal (par exemple, main.ts) comme suit :
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: 'votre_secret', // Remplacez par un secret fort
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Mettez à true en production si vous utilisez HTTPS
  }));

  await app.listen(3000);
}
bootstrap();

```

#### Initialisation du service 
Intégrez SamlService en l'injectant dans votre contrôleur ou service NestJS afin de l'utiliser de manière optimale.
```typescript
import { SamlService } from './saml.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly samlService: SamlService) {}

    @Get('login')
    async login(@Res() res: Response) {
        const loginUrl = await this.samlService.createLoginRequestUrl();
        return res.redirect(loginUrl);
    }

    @Post('sso/acs')
    async handleSSO(@Req() req: Request) {
        const response = await this.samlService.parseResponse(req);
        req.session.user = response; // Enregistrer l'utilisateur dans la session
        return response; // Traiter la réponse selon votre logique
    }

    @Get('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        const logoutUrl = await this.samlService.createLogoutRequestUrl(req.session.user);
        req.session.destroy(); // Détruire la session
        return res.redirect(logoutUrl);
    }
}
```

1. **Méthode de Connexion**

   Endpoint : ***GET /auth/login***
  
   Cette méthode initie le processus de connexion en redirigeant l'utilisateur vers l'URL de demande de connexion SAML.

>##### Fonctionnement
>Lorsqu'un utilisateur accède à l'endpoint /auth/login, la méthode login est appelée.
La méthode utilise le service SAML (SamlService) pour générer une URL de demande de connexion.
L'utilisateur est ensuite redirigé vers cette URL pour procéder à l'authentification.

2. **Méthode de Gestion des Réponses SSO**  
   Endpoint : ***POST /auth/sso/acs***
  
   Cette méthode gère les réponses du SSO après que l'utilisateur se soit authentifié.

>#### Fonctionnement
>Lorsque l'utilisateur est authentifié, le SSO redirige vers l'endpoint /auth/sso/acs avec une réponse SAML.
La méthode handleSSO est appelée, qui utilise le service SAML pour analyser la réponse.
Les informations de l'utilisateur sont extraites de la réponse et stockées dans la session.

3. **Méthode de Déconnexion**  
   Endpoint : ***GET /auth/logout***  
   
   Cette méthode permet de déconnecter l'utilisateur et de gérer le processus de déconnexion avec le SSO.

>#### Fonctionnement
>Lorsque l'utilisateur souhaite se déconnecter, il accède à l'endpoint /auth/logout.
La méthode logout est appelée, qui génère une URL de demande de déconnexion SAML.
La session de l'utilisateur est détruite, et l'utilisateur est redirigé vers l'URL de déconnexion pour finaliser le processus.
