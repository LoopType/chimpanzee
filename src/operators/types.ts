import { captureIf } from "./capture";
import { Match, Empty, Skip, Fault } from "../results";
import { FunctionSchema } from "../schemas";
import parse from "../parse";
import { getParams } from "./utils";
import { IParams } from "../types";

export function number(params: IParams) {
  return checkType("number", params);
}

export function bool(params: IParams) {
  return checkType("boolean", params);
}

export function string(params: IParams) {
  return checkType("string", params);
}

export function object(params: IParams) {
  return checkType("object", params);
}

export function func(params: IParams) {
  return checkType("function", params);
}

function checkType(type, params = {}) {
  const meta = { type, params };

  function fn(obj, key, parents, parentKeys) {
    return context => {
      const result = parse(captureIf(obj => typeof obj === type))(
        obj,
        key,
        parents,
        parentKeys
      )(context);
      return result instanceof Skip
        ? new Skip(
            `Expected ${type} but got ${typeof obj}.`,
            { obj, key, parents, parentKeys },
            meta
          )
        : result;
    };
  }

  return new FunctionSchema(fn, getParams(params), meta);
}