# Project architecture

As explained in the Readme, Label is splited between the specific features for the Cour de cassation (machine learning engine API, database connector, etc.) and the generic features (not linked to the specific needs of the Cour de cassation).

The project itself is splited into 4 packages:

- `/packages/courDeCassation` is the specific features for the Cour de cassation.
- `/packages/generic/backend` is the Label backend.
- `/packages/generic/client` is the Label frontend.
- `/packages/generic/core` includes the functions used by both the frontend and the backend.

Label is also using external packages:

- [`pelta-design-system`](https://github.com/Cour-de-cassation/pelta-design-system) is the design system used by the frontend.
- (to be deprecated) [`sder`](https://github.com/Cour-de-cassation/sder) is a common packages with various modules, functions and type.
- (to be deprecated) [`sder-core`](https://github.com/Cour-de-cassation/sder-core) is another common packages with functions related to authentification.


