/* @flow */

/*
  This is the base class for all schemas.
*/
export type SchemaParams<TResult> = {
  name?: string,
  key?: string,
  selector?: string,
  build?: (res: any) => (context: ?Object) => TResult
};

export default class Schema<TResult, TParams : SchemaParams<TResult>> {
  params: TParams;
  meta: ?Object;

  constructor(params: TParams, meta?: ?Object) {
    this.params = params;
    this.meta = meta;
  }
}
