# Reuser guide

If you are reusing Label, these instructions will be usefull. Also have a look at the [project architecture](projectArchitecture.md).

## Add documents you want to annotate

We provide seeds to populate the database with test data.
To use seeds you can use the following commands from the project root :

- clean the database : `node seeds/clean.js`
- load fake data in all collections : `node seeds/load.js`
- save your current database data on seeds : `node seeds/save.js`
- refresh date to a recent date : `node seeds/refreshDate.js <timestamp>`

## Edit the annotation settings

- Open the `packages/courDeCassation/settings`
- Edit the file, for each category:
  - `anonymization`: text with which the annotated text is replaced. %c / %d are respectively iterating letters / numbers
  - `color`:
    - `darkMode`: color of the category when in dark mode. The available colors are the [shades of MaterialUI](https://material-ui.com/customization/color/#color-palette)
    - `lightMode`: color of the category when in light mode. The available colors are the [shades of MaterialUI](https://material-ui.com/customization/color/#color-palette)
  - `iconName`: the icon name in the `packages/generic/client/src/components/generic/materialUI/Icon.tsx` file. All the used icons are Material UI.
  - `order`: order the category is displayed in the annotator interface
  - `text`: name of the category displayed in the annotator interfaces

## Use the tool to annotate your documents

- Log in with the following credentials:
  - email: test.annotator@label.fr
  - password: annotator
- Select the document you want to annotate - you can pick among max 3 available documents
- Annotate it with the annotation interface
- Validate the decision by clicking on "Valider"

## Use the tool to review the annotated documents

- Log in with the following credentials:
  - email: test.admin@label.fr
  - password: admin
- Select the "Décisions traitées" tab on the left menu
- Hover the document you want to open, then click on "Ouvrir la décision"
- Click on the Copy icon on the bottom-right hand corner to copy the anonymzed text in the clipboard
