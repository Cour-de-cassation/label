import { gql } from '@apollo/client';
import {
  buildGraphQLTypeName,
  graphQLMutation,
  graphQLQuery,
  graphQLCustomTypes,
  graphQLTypeType,
  graphQLEntryType,
} from '@label/core';

export { graphQLClientBuilder, buildMutationString, buildQueryString };

const graphQLClientBuilder = {
  buildQuery,
  buildMutation,
};

function buildMutation(mutationEntryName: keyof typeof graphQLMutation) {
  return gql`
    ${buildMutationString(mutationEntryName)}
  `;
}

function buildMutationString(mutationEntryName: keyof typeof graphQLMutation) {
  return buildgraphQLEntryString('mutation', mutationEntryName, graphQLMutation[mutationEntryName]);
}

function buildQuery(queryEntryName: keyof typeof graphQLQuery) {
  return gql`
    ${buildQueryString(queryEntryName)}
  `;
}

function buildQueryString(queryEntryName: keyof typeof graphQLQuery) {
  return buildgraphQLEntryString('query', queryEntryName, graphQLQuery[queryEntryName]);
}

function buildgraphQLEntryString(kind: 'mutation' | 'query', entryName: string, entry: graphQLEntryType) {
  const body = buildSchemaBody(entry.type);

  if (entry.args) {
    const argDeclarations = buildArgDeclarations(entry.args);
    const entryArgs = buildEntryArgs(entry.args);

    return `${kind} ${entryName}(${argDeclarations}) {
${entryName}(${entryArgs}) {
${body}
}
}`;
  } else {
    return `${kind} ${entryName} {
${entryName} {
${body}
}
}`;
  }
}

function buildSchemaBody(graphQLType: graphQLTypeType): string {
  switch (graphQLType.kind) {
    case 'primitive':
      return '';
    case 'list':
      return buildSchemaBody(graphQLType.type);
    case 'custom':
      return Object.keys(graphQLCustomTypes[graphQLType.type].fields).join('\n');
  }
}

function buildArgDeclarations(args: { [argName: string]: graphQLTypeType }) {
  return Object.entries(args)
    .map(([arg, argType]) => `${buildArgVariable(arg)}: ${buildArgType(argType)}`)
    .join(', ');
}

function buildEntryArgs(args: { [argName: string]: graphQLTypeType }) {
  return Object.keys(args)
    .map((arg) => `${arg}: ${buildArgVariable(arg)}`)
    .join(', ');
}

function buildArgVariable(arg: string) {
  return `$${arg}`;
}

function buildArgType(argType: graphQLTypeType): string {
  switch (argType.kind) {
    case 'custom':
      return buildGraphQLTypeName('input', argType.type);
    case 'list':
      return `[${buildArgType(argType.type)}]`;
    case 'primitive':
      switch (argType.type) {
        case 'boolean':
          return 'Boolean';
        case 'date':
          return 'String';
        case 'id':
          return 'String';
        case 'number':
          return 'Int';
        case 'string':
          return 'String';
        default:
          return 'String';
      }
  }
}
