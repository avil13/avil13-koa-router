import Ajv, { DefinedError, JSONSchemaType } from 'ajv';
import { ConfigEntity, RouteControllerConfigItem, RouteStaticConfigItem } from '../types';

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

  const routeObject: JSONSchemaType<RouteControllerConfigItem> = {
    type: 'object',
    required: ['name', 'controller', 'path'],
    additionalProperties: false,
    properties: {
      name: { type: 'string' },
      controller: { type: 'string' },
      path: { type: 'string' },
      prefix: { type: 'string', nullable: true },
      methods: { type: 'string', nullable: true },
      middleware: { type: 'array', items: { type: 'string' }, nullable: true },
      response: { type: 'object', nullable: true },
    },
  };
  const routeStaticObject: JSONSchemaType<RouteStaticConfigItem> = {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'static', 'path'],
    properties: {
      name: { type: 'string' },
      static: { type: 'string' },
      path: { type: 'string' },
      middleware: { type: 'array', items: { type: 'string' }, nullable: true },
    }
  };

  const routes = {
    type: 'array',
    items: {
      oneOf: [routeObject, routeStaticObject],
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

  return validate.errors as DefinedError[];
};
