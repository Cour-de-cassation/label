![Logo Label](./packages/generic/client/src/assets/logo/logo.svg)

EIG 4 promotion

URL of the challenge: https://entrepreneur-interet-general.etalab.gouv.fr/defis/2020/label.html

## Installation

Install the backend with:

```sh
yarn buildLocalDevDocker
```

Install the frontend with:

```sh
yarn
```

## Launch

For the first launch, you may want to have example data. To do so, follow the `Add documents you want to annotate` step bellow.

Run in two different terminals:

```sh
yarn startLocalDevDocker
```

```sh
yarn startLocalClientDev
```

The container will be started with a database with fresh data.

Then, on your web browser, open http://localhost:55432

## Troubleshooting

To use mongo, you need to run in your terminal:

```
sudo chmod 666 /var/run/docker.sock
```

## Business logic index

- List of document statuses : "./documentStatuses.md"
- Annotations flow : "./annotationFlow.md"
- Replacement terms : "./replacementTerms.md"

## How to reuse LABEL

### Philosophy

LABEL has been designed to be reused whatever the annotation context. There are two different kinds of packages in LABEL

- specific: what is specific to the Cour de cassation (machine learning engine API, database connector, etc.)
- generic: what is not linked to the specific needs of the Cour de cassation

### Add documents you want to annotate

The `courDeCassation/storage-example` contains two folders:

- documents : the documents you want to annotate. Look at `courDeCassation/storage-example/documents/123452.json` for an example of the fields you are supposed to fill. The only required fields are:
  - `dateDecision`: the date of the document
  - `originalText`: the text of the document. Every paragraph has to be separated by \n
  - `sourceId`: the unique ID of the document, which must also be its name ("{ID}.json")
- annotations: the initial annotations for a document. If you don't have an automatic annotator, copy/paste the `courDeCassation/storage-example/annotations/123452.json` content.

The folder used by LABEL is `courDeCassation/storage`. If you want to reuse the `storage-example` folder as is, simply rename it to `storage`.

### Edit the annotation settings

- Open the `packages/courDeCassation/settings`
- Edit the file, for each category:
  - `anonymization`: text with which the annotated text is replaced. %c / %d are respectively iterating letters / numbers
  - `color`:
    - `darkMode`: color of the category when in dark mode. The available colors are the [shades of MaterialUI](https://material-ui.com/customization/color/#color-palette)
    - `lightMode`: color of the category when in light mode. The available colors are the [shades of MaterialUI](https://material-ui.com/customization/color/#color-palette)
  - `iconName`: the icon name in the `packages/generic/client/src/components/generic/materialUI/Icon.tsx` file. All the used icons are Material UI.
  - `order`: order the category is displayed in the annotator interface
  - `text`: name of the category displayed in the annotator interfaces

### Use the tool to annotate your documents

- Log in with the following credentials:
  - email: test.annotator@label.fr
  - password: annotator
- Select the document you want to annotate - you can pick among max 3 available documents
- Annotate it with the annotation interface
- Validate the decision by clicking on "Valider"

### Use the tool to review the annotated documents

- Log in with the following credentials:
  - email: test.admin@label.fr
  - password: admin
- Select the "Décisions traitées" tab on the left menu
- Hover the document you want to open, then click on "Ouvrir la décision"
- Click on the Copy icon on the bottom-right hand corner to copy the anonymzed text in the clipboard
