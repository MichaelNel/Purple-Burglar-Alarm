import {ErrorMapper} from "utils/ErrorMapper";
import {HarvestNearestSourceRole} from "./roles/role.harvester";
import {UpgraderRole} from "./roles/role.upgrader";
import {BuilderRole} from "./roles/role.builder";
import {Role} from "./roles/RoleEnum";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */

  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  function EnsureMinimumCreeps(role: string, count: number) {
    let numberOfCreepsWithRole = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    console.log(role + 's: ' + numberOfCreepsWithRole.length);
    if (numberOfCreepsWithRole.length < count) {
      let newName = role + Game.time;
      console.log('Spawning new ' + role + ': ' + newName);
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, <SpawnOptions>{memory: {role: role}});
    }
  }

  EnsureMinimumCreeps(Role.Harvester, 2);
  EnsureMinimumCreeps(Role.Upgrader, 1);
  EnsureMinimumCreeps(Role.Builder, 1);

  for (const name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role == Role.Harvester) {
      HarvestNearestSourceRole.run(creep);
    }
    if (creep.memory.role == Role.Upgrader) {
      UpgraderRole.run(creep);
    }
    if (creep.memory.role == Role.Upgrader) {
      BuilderRole.run(creep);
    }
  }
});
