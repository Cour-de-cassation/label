The annotated terms are replaced through the anonymizer, which is built via `core/src/lib/anonymizer/buildAnonymizer.ts`.

A mapper is first generated: for every entityId in the annotations array, the specifier (`%c` or `%d`, which stands respectively for a character or a digit) will be replaced by the corresponding text, specified in the settings.json file.
