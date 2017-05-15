/* @flow */
import exception from "./exception";

import { Result, Match, Empty, Skip, Fault } from "./results";

import arrayParser from "./parsers/array";
import functionParser from "./parsers/function";
import primitiveParser from "./parsers/primitive";
import objectParser from "./parsers/object";

import { ArraySchema, FunctionSchema, PrimitiveSchema, ObjectSchema, Schema } from "./schemas";

import type { Context, EvalFunction } from "./types";

function getSchemaAndParser<TSchema>(source: mixed): TSchema {
  const normalize = (src, SchemaClass, params = {}) =>
    src instanceof SchemaClass ? src : new SchemaClass(src, params);

  return source instanceof PrimitiveSchema ||
    ["string", "number", "boolean", "symbol"].includes(typeof source)
    ? { schema: normalize(source, PrimitiveSchema), parse: primitiveParser }
    : source instanceof FunctionSchema || source instanceof Function
        ? { schema: normalize(source, FunctionSchema), parse: functionParser }
        : source instanceof ArraySchema || source instanceof Array
            ? { schema: normalize(source, ArraySchema), parse: arrayParser }
            : source instanceof ObjectSchema || source.constructor === Object
                ? { schema: normalize(source, ObjectSchema), parse: objectParser }
                : exception(`Invalid schema type ${typeof source}.`);
}

export default function(source: mixed): EvalFunction {
  const { schema, parse: schemaParse } = getSchemaAndParser(source);

  return (obj, key = "__INIT__", parents = [], parentKeys = []) => (_context = {}) => {
    const context = schema.params.newContext ? {} : _context;
    const result = schemaParse(schema)(obj, key, parents, parentKeys)(context);
    return schema.params && schema.params.build
      ? (() => {
          const output = schema.params.build(result)(context);
          return output instanceof Result
            ? output
            : new Match(output, { obj, key, parents, parentKeys });
        })()
      : result;
  };
}