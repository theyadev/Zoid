import { readdirSync } from "fs"

export default function getJsFiles(dir: string) {
  return readdirSync(dir).filter((file) => file.endsWith(".js"))
}
