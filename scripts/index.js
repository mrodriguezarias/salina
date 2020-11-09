import yargs from "yargs"
import envUtils from "../src/utils/env"
import uploadPlaces from "./uploadPlaces"
import refreshOccupations from "./refreshOccupations"
import addAddresses from "./addAddresses"
import createAdminUser from "./createAdminUser"
import addReservations from "./addReservations"

const scripts = [
  uploadPlaces,
  refreshOccupations,
  addAddresses,
  createAdminUser,
  addReservations,
]

const handler = async (script, args) => {
  envUtils.load(args.env)
  await script.run(args)
  console.info("Done")
}

let args = yargs
for (const script of scripts) {
  args = args.command({
    command: script.name,
    desc: "",
    builder: script?.options,
    handler: (args) => handler(script, args),
  })
}
args
  .demandCommand()
  .option("env", {
    alias: "e",
    desc: "Specify environment",
    type: "string",
    default: "local",
  })
  .version(false)
  .help()
  .strict().argv
