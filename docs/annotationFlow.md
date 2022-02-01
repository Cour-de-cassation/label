The annotations are stored in the Label database in a specific format :

```
annotationType: {
  category, // category of the annotation ("personnePhysique")
  entityId, // id that is common for every linked annotation ("personnePhysique_DUPONT")
  start, // index of the beginning of the annotation
  text, // text of the annotation ("DUPONT"),
  certaintyScore // certainty score computed by NLP
}
```

For every treatment, we store an object "annotationsDiff" that contains the modifications operated on all the previous annotations. It follows the "commit" pattern:

```
annotationsDiffType: {
  before: annotationType[],
  after: annotationType[]
}
```

For instance, if the only operation in a treatment is the change of category from "personnePhysique" to "personneMorale" in an annotation, the annotations diff will be the following :

```
{
  before: [{...annotation1, category: "personnePhysique"}],
  after: [{...annotation1, category: "personneMorale"}],
}
```
