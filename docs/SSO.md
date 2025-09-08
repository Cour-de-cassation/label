**EN** | [FR](README.fr.md)

# SSO Module

This service implements Single Sign-On (SSO) using **SAML 2**, built with the `samlify` library.  
It facilitates authentication with Identity Providers (IdP) such as **Keycloak**, **Pages Blanches**, or any other SAML-compatible provider.  
The service utilizes the **SAMLify** library to interface with SSO, simplifying the management of SAML requests and responses.

## Workflow

<section style="min-height:200px">
The diagram below illustrates the interaction between the Label application and the Pages Blanches SSO for authentication.

<img src="./images/LABEL_auth_workflow.png" alt="Label auth workflow" />

1. When a user initiates access to LABEL, the frontend communicates with the backend to check the user’s authentication status. If the user is not authenticated, the backend initiates a redirect to the identity provider (IdP), passing the necessary authentication parameters.

2. The user is then prompted to log in via the SSO page. Upon successful authentication, the identity provider generates a SAML assertion and sends it to LABEL's backend via the Assertion Consumer Service (ACS) URL.

3. The backend processes and validates the SAML assertion to ensure data integrity and verify the authenticity of the digital signature

4. After validation, access to secured resources is granted, allowing the user to continue their authenticated session.

</section>

## Prerequisites

- **Node.js** (version 16 or higher)
- **SAMLify**: Library for managing interactions with SAML 2.
- A **SAML 2.0 compatible Identity Provider (IdP)** (e.g., Keycloak, Pages Blanches).
- The `sso_idp_metadata.xml` file containing the Identity Provider configuration.
- The `.env` file that holds the necessary environment variables for the module.

## Configuration

### Environment Variables

The environment variables needed for SSO to work are present in the `docker.env.example` and `.env.example` files.

# Service Provider (SP) Configuration

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
  privateKey: fs.readFileSync("path/to/privatekey.pem", "utf8"),
  signingCert: fs.readFileSync("path/to/certificate.pem", "utf8"),
  authnRequestsSigned: true,
  wantAssertionsSigned: true,
};
```

## Identity Provider (IdP) Configuration

- SSO_IDP_METADATA: XML file containing the IdP metadata (Entity ID, certificates, endpoints).
- SSO_IDP_SINGLE_SIGN_ON_SERVICE_LOCATION: URL where the Service Provider redirects users for authentication.
- SSO_IDP_SINGLE_LOGOUT_SERVICE_LOCATION: URL for user logout.

## Features

### Metadata Generation

> The **_generateMetadata()_** method allows for the generation and retrieval of the Service Provider (SP) metadata.

### Creating a Login Request URL

> The **_createLoginRequestUrl()_** method generates a URL to initiate the login process via SAML 2..

### Parsing and Handling SAML 2 Responses

> The **_parseResponse()_** method parses and processes the SAML response received from the IdP after a login attempt.

### Creating a Logout Request URL

> The **_createLogoutRequestUrl(user)_** method generates a logout URL based on user information (nameID).

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
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: "votre_secret", // Replace with a strong secret.
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set to true in production if you are using HTTPS.
    })
  );

  await app.listen(3000);
}
bootstrap();
```

#### Initialisation du service

Integrate SamlService by injecting it into your NestJS controller or service for optimal usage.

```typescript
import { SamlService } from "./saml.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly samlService: SamlService) {}

  @Get("login")
  async login(@Res() res: Response) {
    const loginUrl = await this.samlService.createLoginRequestUrl();
    return res.redirect(loginUrl);
  }

  @Post("sso/acs")
  async handleSSO(@Req() req: Request) {
    const response = await this.samlService.parseResponse(req);
    req.session.user = response; // Register the user in the session.
    return response; // Process the response according to your logic.
  }

  @Get("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    const logoutUrl = await this.samlService.createLogoutRequestUrl(
      req.session.user
    );
    req.session.destroy(); // Destroy the session.
    return res.redirect(logoutUrl);
  }
}
```

1. **Login method**

   Endpoint : **_GET /auth/login_**

   This method initiates the login process by redirecting the user to the SAML login request URL

> ##### Mechanism
>
> When a user accesses the endpoint /auth/login, the login method is called.
> The method uses the SAML service (SamlService) to generate a login request URL.
> The user is then redirected to this URL to proceed with authentication.

2. **SSO Response Handling Method**  
   Endpoint : **_POST /auth/sso/acs_**

   This method handles SSO responses after the user has authenticated.

> #### Mechanism
>
> When the user is authenticated, the SSO redirects to the endpoint /auth/sso/acs with a SAML response.
> The handleSSO method is called, which uses the SAML service to parse the response.
> The user's information is extracted from the response and stored in the session.

3. **Logout Method**  
   Endpoint : **_GET /auth/logout_**

   This method allows the user to log out and manages the logout process with the SSO.

> #### Mechanism
>
> When the user wishes to log out, they access the endpoint /auth/logout.
> The logout method is called, which generates a SAML logout request URL.
> The user's session is destroyed, and the user is redirected to the logout URL to finalize the process.
