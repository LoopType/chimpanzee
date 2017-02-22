import { traverse, capture } from "../../../chimpanzee";

export const input = {
  level1: {
    hello: "world",
    other1: "something1",
    level2: [
      [
        "one",
        "two",
      ]
    ]
  }
}

export const schema = traverse({
  level1: {
    hello: capture(),
    level2: [
      [
        capture("arrayItem"),
        "two",
      ]
    ]
  }
});