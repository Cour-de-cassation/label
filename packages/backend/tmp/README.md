# Data test folder

All the files prefixed by `ignored\_` will be ignored by git.

## storage

In order to run our platform locally, we need to fake the infrastructure of the "Cour de cassation".
We need to have a fake Jurinet database with fake data and a fake NLP engine with fake annotations for these data.

To do so, just add `storage` folder with the given layout:

```
storage/
  nlpEngine/
    jurinet/
      ignored_courtDecision1.json
      ignored_courtDecision2.json
      ...
  oracle/
    jurinet/
      ignored_courtDecision1.xml
      ignored_courtDecision2.xml
      ...
```

The name of the files in `storage/nlpEngine/jurinet` and `storage/oracle/jurinet` should have corresponding names.

If you want a complete dataset, ask the mains maintainers.
