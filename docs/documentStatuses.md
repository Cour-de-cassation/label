# Document statuses

A `document` is supposed to follow a specific flow once it enters the label database. Its status will evolve accordingly.

- `loaded`: the document has only been imported in LABEL. No treatment has been done on it.
- `nlpAnnotating`: the document is currently being annotated by the NLP annotator.
- `free`: the document is ready to be annotated by a working user. There are already several `treatments` related to that document (one by the `NLP`, one by the `postProcess`, maybe one with the `supplementaryAnnotations` if asked by the clerk)
- `pending`: the document is proposed to a working user. An `assignation` and a corresponding empty `treatment` have been created. The document won't be proposed to another working user.
- `saved`: the document is being annotated by a working user.
- `toBeConfirmed`: the document needs to be proof-read a second time by an administrator
- `toBePublished`: the document has been treated and is waiting for a publicator to declare it published
- `done`: the document is ready to be released in open data
- `locked`: an alert has been raised for this document, and the working user has specified that he/she cannot proceed with the treatment. The document will stay in the database until its status changes.
- `rejected`: an admin has confirmed that this document cannot be treated and that it needs to be deleted from Label.
