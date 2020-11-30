import Ajv from 'ajv';

import { ConfigEntity } from '../types';

const ajv = new Ajv();

export const validateConfig = (config: ConfigEntity) => {
  const options = {
    type: 'object',
    additionalProperties: false,
    properties: {
      middlewarePath: { type: 'string' },
      controllerPath: { type: 'string' },
    },
  };

  const middleware = {
    type: 'object',
    patternProperties: {
      '[^\\s]': { type: 'string' },
    },
  };

  const routes = {
    type: 'array',
    items: {
      type: 'object',
      additionalProperties: false,
      required: ['name', 'controller', 'path'],
      properties: {
        name: { type: 'string' },
        controller: { type: 'string' },
        path: { type: 'string' },
        prefix: { type: 'string' },
        methods: { type: 'string' },
        middleware: { type: 'array', items: { type: 'string' } },
        response: { type: 'object' },
      },
    },
  };

  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['routes'],
    properties: {
      options,
      middleware,
      routes,
    },
  };

  const validate = ajv.compile(schema);

  const result = validate(config);

  if (result) {
    return true;
  }

  return validate.errors;
};
