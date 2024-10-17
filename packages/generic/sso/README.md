
**EN** | [FR](README.fr.md)

# SSO Module

This service implements Single Sign-On (SSO) using **SAML 2**, built on the **NestJS** framework and the `samlify` library.  
It facilitates authentication with Identity Providers (IdP) such as **Keycloak**, **Pages Blanches**, or any other SAML-compatible provider.  
The service utilizes the **SAMLify** library to interface with SSO, simplifying the management of SAML requests and responses.

## Prerequisites

- **Node.js** (version 16 or higher)
- **NestJS**
- **SAMLify**: Library for managing interactions with SAML 2.
- A **SAML 2.0 compatible Identity Provider (IdP)** (e.g., Keycloak, Pages Blanches).
- The `sso_idp_metadata.xml` file containing the Identity Provider configuration.
- The `.env` file that holds the necessary environment variables for the module.

## Technologies

- **NestJS**: A framework for building efficient Node.js applications.
- **TypeScript**: A programming language that adds static typing.
- **Jest**: A testing framework for JavaScript.
- **Prettier**: A code formatting tool.
- **ESLint**: A linting tool for identifying and reporting patterns in JavaScript code.

## Dependencies

The SSO module requires the following dependencies:
- `@nestjs/common`
- `@nestjs/core`
- `@nestjs/config`
- `@authenio/samlify-node-xmllint`
- `@nestjs/platform-express`
- `body-parser`
- `dotenv`
- `reflect-metadata`
- `samlify`

### Installation Prerequisites

1. Install [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.
2. Run the following command to install the required Node.js version:

   ```bash
   nvm install

### Installation

To install the necessary packages for the application, open a terminal and execute the following command:

```bash
npm install
```

## Configuration
### Environment Variables
Configure the environment variables required for the SSO module in the [docker.env.example](../../../docker.env.example) / [.env.example](../../../.env.example) file located at the root of the main project. Rename this file to docker.env or .env as necessary, and adjust the environment variables as needed.


# Service Provider (SP) Configuration
<b>Specific instructions for configuring the Identity Provider (IdP) and the Service Provider (SP) can be found in the following document:</b> `MANU_SSO_Configuration_IDP_SAML_VM_Test_V1.1.odt`

- SSO_SP_ENTITY_ID: Unique identifier for the SP (e.g., SP-LABEL).
- SSO_SP_ASSERTION_CONSUMER_SERVICE_LOCATION: URL where the SP receives SAML assertions after authentication.
- SSO_SP_PRIVATE_KEY: Private key of the Service Provider used for signing and decrypting SAML messages exchanged with the Identity Provider.

### Generating a Private Key and Self-Signed Certificate for SAML

This section details the steps needed to generate a private key and a self-signed certificate using OpenSSL, which can be used to set up a Service Provider (SP) in a SAML environment.

**Self-signed certificates are typically suitable for development or testing environments. For production use, it is highly recommended to obtain a certificate from a trusted Certificate Authority (CA) to ensure secure and trusted communication.**

#### Prérequis

- **OpenSSL**: Verify that OpenSSL is installed on your system. It can be downloaded from the official website or installed via a package manager.

#### Étapes de Génération

1. **Installer OpenSSL**:

```sh
   sudo apt-get update
   sudo apt-get install openssl
```
2. **Generate a Private Key**
```sh
   openssl genrsa -out privatekey.pem 2048
```
3. **Generate a Self-Signed Certificate**

Use the private key to create a self-signed certificate
```sh
   openssl req -new -x509 -key privatekey.pem -out certificate.pem
```
Integrate the private key and the self-signed certificate into your application configuration. For example, in your SAML configuration file
```typescript
const spProps = {
   entityID: process.env.SSO_SP_ENTITY_ID,
   assertionConsumerService: [
      {
      Binding: samlify.Constants.namespace.binding.post,
      Location: process.env.SSO_SP_ASSERTION_CONSUMER_SERVICE_LOCATION,
      },
   ],
   privateKey: fs.readFileSync('path/to/privatekey.pem', 'utf8'),
   signingCert: fs.readFileSync('path/to/certificate.pem', 'utf8'),
   authnRequestsSigned: true,
   wantAssertionsSigned: true,
};
```

## Identity Provider (IdP) Configuration
- SSO_IDP_METADATA: XML file containing the IdP metadata (Entity ID, certificates, endpoints).
- SSO_IDP_SINGLE_SIGN_ON_SERVICE_LOCATION: URL where the Service Provider redirects users for authentication.
- SSO_IDP_SINGLE_LOGOUT_SERVICE_LOCATION: URL for user logout.


## Scripts
-   The following scripts are available in `package.json` :

| Commande           | Description                                                                     |
|--------------------|---------------------------------------------------------------------------------|
| `build`            | Cleans and compiles the NestJS application.                                     |
| `compile`          | Compiles the NestJS application.                                                |
| `format`           | Checks the code formatting with Prettier.                                       |
| `lint`             | Checks TypeScript code with ESLint.                                             |
| `test`             | Runs unit and integration tests.                                                |
| `test:watch`       | Executes tests in interactive mode with change monitoring.                      |
| `test:coverage`    | Runs tests while generating a coverage report.                                  |
| `fix`              | Corrects formatting errors with ESLint and Prettier.                            |    

## Testing
- To run the tests, use the following command:

```bash
npm run test
```

- To run the tests in interactive mode, execute:

```bash
 npm run test:watch 
 ```

- To run the tests with coverage reporting, execute:

```bash
 npm run test:cov 
 ```

## Features

### Metadata Generation



>The ***generateMetadata()*** method allows for the generation and retrieval of the Service Provider (SP) metadata.


### Creating a Login Request URL


>The ***createLoginRequestUrl()*** method generates a URL to initiate the login process via SAML 2..


### Parsing and Handling SAML 2 Responses


>The ***parseResponse()*** method parses and processes the SAML response received from the IdP after a login attempt.


### Creating a Logout Request URL


>The ***createLogoutRequestUrl(user)*** method generates a logout URL based on user information (nameID).


## Usage
The following example illustrates the use of the SSO module within a NestJS application.


### Session Management
Example implementation of user session management with express-session.

#### Installation
```sh
npm install express-session
```

#### Configuring the Session
In your NestJS application, configure express-session in the main file (e.g., main.ts) as follows::
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: 'votre_secret', // Replace with a strong secret.
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production if you are using HTTPS.
  }));

  await app.listen(3000);
}
bootstrap();

```

#### Initialisation du service
Integrate SamlService by injecting it into your NestJS controller or service for optimal usage.
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
        req.session.user = response; // Register the user in the session.
        return response; // Process the response according to your logic.
    }

    @Get('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        const logoutUrl = await this.samlService.createLogoutRequestUrl(req.session.user);
        req.session.destroy(); // Destroy the session.
        return res.redirect(logoutUrl);
    }
    
}
```

1. **Login method**

   Endpoint : ***GET /auth/login***

   This method initiates the login process by redirecting the user to the SAML login request URL

>##### Mechanism
>When a user accesses the endpoint /auth/login, the login method is called.
The method uses the SAML service (SamlService) to generate a login request URL.
The user is then redirected to this URL to proceed with authentication.

2. **SSO Response Handling Method**  
   Endpoint : ***POST /auth/sso/acs***

   This method handles SSO responses after the user has authenticated.

>#### Mechanism
>When the user is authenticated, the SSO redirects to the endpoint /auth/sso/acs with a SAML response.
The handleSSO method is called, which uses the SAML service to parse the response.
The user's information is extracted from the response and stored in the session.

3. **Logout Method**  
   Endpoint : ***GET /auth/logout***

   This method allows the user to log out and manages the logout process with the SSO.

>#### Mechanism
>When the user wishes to log out, they access the endpoint /auth/logout.
The logout method is called, which generates a SAML logout request URL.
The user's session is destroyed, and the user is redirected to the logout URL to finalize the process.
