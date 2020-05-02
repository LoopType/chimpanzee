import { Match, Empty, Skip, Fault } from "../results";
import { FunctionSchema } from "../schemas";
import parse from "../parse";
import { getParams } from "./utils";

export function optional(schema, params = {}) {
  const meta = { type: "optional", schema, params };

  function fn(obj: Value, key: string, parents: Value[], parentKeys: string[]) {
    return (context: IContext) => {
      const result = parse(schema)(obj, key, parents, parentKeys)(context);
      return !(result instanceof Skip)
        ? result
        : new Empty({ obj, key, parents, parentKeys }, meta);
    };
  }

  return new FunctionSchema(fn, getParams(params), meta);
}