# Cron jobs

Here are all the cron jobs of Label :

## nlp-annotation

Send Label documents to the nlp annotation service.

## import-j-7

Import recent (7 days) documents from the source databases.

## urgent-import

Fill Label with old documents if Label is lacking of documents to treat.

## import-chained

Import chained decisions.

## export-j-4

Export all treated documents 4 days after their treated date.

## export-publishable

Export important "publishable" documents.

## free-pending

Free documents assigagned to an annotator that is AFK after X minutes.

## purge-m-6

Purge statistics data after 6 months due to GDPR laws/privacy policies.

## renew-cache

Asynchronously renew the cache.
