import { traverse, number } from "../../../chimpanzee";

export const input = {
  hello: "world"
}

export const schema = traverse({
  hello: number()
})
