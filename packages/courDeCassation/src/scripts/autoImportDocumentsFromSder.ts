import yargs from 'yargs';
import {buildBackend} from '@label/backend';
import {sderConnector} from '../connector';
import {parametersHandler} from '../lib/parametersHandler';
import {Sources} from "dbsder-api-types";

(async () => {
    const {settings} = await parametersHandler.getParameters();
    const {count, threshold, sources} = parseArgv();
    const backend = buildBackend(settings);

    const sourcesArr = sources ? sources.split(',') : undefined;

    backend.runScript(
        () =>
            autoImportDocumentsFromSder({
                count,
                threshold,
                sourcesArr,
            }),
        {
            shouldLoadDb: true,
        },
    );
})();

async function autoImportDocumentsFromSder({
                                               count,
                                               threshold,
                                               sourcesArr,
                                           }: {
    count: number;
    threshold?: number;
    sourcesArr?: string[];
}) {
    await sderConnector.importNewDocuments({
        documentsCount: count,
        threshold,
        sources: sourcesArr as Sources[],
    });
}

function parseArgv() {
    const argv = yargs
        .options({
            count: {
                demandOption: true,
                description: 'number of decisions you want to import',
                type: 'number',
            },
            threshold: {
                demandOption: false,
                description:
                    'free documents count below which you want to launch a decisions import',
                type: 'number',
            },
            sources: {
                demandOption: false,
                description:
                    'sources (jurinet, jurica or juritj) of the decisions you want to import',
                type: 'string',
            },
        })
        .help()
        .alias('help', 'h').argv;

    return {
        count: argv.count as number,
        threshold: argv.threshold as number,
        sources: argv.sources as string,
    };
}
