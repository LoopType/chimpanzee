import { builtins as $, wrap, composite, capture } from "../../../";

export const input = {
  node: {
    list: [{ inner: 1 }],
  },
  list: [{ altInner: 2 }],
};

export const schema = composite(
  {
    list: [
      {
        inner: capture(),
        altInner: wrap(capture(), { selector: "alt" }),
      },
    ],
  },
  [
    { name: "default", modifiers: { object: (x: any) => x.node } },
    { name: "alt", mergeArray: true },
  ]
);
