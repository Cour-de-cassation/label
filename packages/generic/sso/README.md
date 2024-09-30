# Module SSO
Ce service implémente l'authentification unique (SSO) via **SAML 2** en de basant sur le framework **NestJS** et la bibliothèque `samlify`. Le service gère l'authentification avec un Identity Provider (IdP) comme **Keycloak**, **Pages Blanches** ou un autre fournisseur SAML. Il utilise **SAMLify** pour s'interfacer avec le SSO et faciliter la gestion des requêtes et réponses SAML.

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
Pour cette partie, 
SSO_SP_ENTITY_ID=<votre-entity-id-sp>
SSO_SP_ASSERTION_CONSUMER_SERVICE_LOCATION=<url-d-assertion-consumer-service>
SSO_SP_PRIVATE_KEY=<chemin-vers-cle-privee-sp>

# Configuration de l'Identity Provider (IdP)
SSO_IDP_METADATA=<chemin-vers-idp-metadata>
SSO_IDP_SINGLE_SIGN_ON_SERVICE_LOCATION=<url-de-single-sign-on-service>
SSO_IDP_SINGLE_LOGOUT_SERVICE_LOCATION=<url-de-single-logout-service>

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