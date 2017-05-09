/* @flow */
import { Match, Empty, Skip, Fault } from "../results";
import { FunctionalSchema } from "../schema";
import { parse } from "../utils";

export function exists(predicate, schema) {
  const meta = { type: "exists", schema, predicate };

  predicate = predicate || (x => typeof x !== "undefined");

  function fn(obj, key, parents, parentKeys) {
    return context =>
      predicate(obj)
        ? schema
            ? parse(schema)(obj, key, parents, parentKeys)(context)
            : new Empty({ obj, key, parents, parentKeys }, meta)
        : new Skip("Does not exist.", { obj, key, parents, parentKeys }, meta);
  }

  return new FunctionalSchema(fn, undefined, meta);
}
