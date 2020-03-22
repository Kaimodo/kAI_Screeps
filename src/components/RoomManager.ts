import * as Config from "settings/config";

import * as Harvester from "components/creeps/harvester";
import * as Upgrader from "components/creeps/upgrader";
import * as Miner from "components/creeps/miner";

import * as Inscribe from "screeps-inscribe";

import * as M from "settings/memory";

export let creeps: Creep[];
export let creepCount: number = 0;

export let harvesters: Creep[] = [];
export let upgraders: Creep[] = [];
export let miners: Creep[] = [];

export function run(room: Room): void {

  _loadCreeps(room);


  _buildMissingCreeps(room);


  _.each(creeps, (creep: Creep) => {
    const creepMem = M.cm(creep);
    if (creepMem.role === M.CreepRoles.ROLE_MINER) {

      Miner.run(creep);

    }
  });
}

function _loadCreeps(room: Room) {
  creeps = room.find(FIND_MY_CREEPS);
  creepCount = _.size(creeps);
  miners = _.filter(creeps, (creep) => M.cm(creep).role === M.CreepRoles.ROLE_MINER);
}

function _buildMissingCreeps(room: Room) {
  let bodyParts: BodyPartConstant[];

  const spawns: StructureSpawn[] = room.find(FIND_MY_SPAWNS, {
    filter: (spawn: StructureSpawn) => {
      return spawn.spawning === null;
    },
  });

  if (miners.length < 2) {
    if (miners.length < 1 || room.energyCapacityAvailable <= 800) {
      bodyParts = [WORK, WORK, CARRY, MOVE];
    } else if (room.energyCapacityAvailable > 800) {
      bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }

    _.each(spawns, (spawn: StructureSpawn) => {
      _spawnCreep(spawn, bodyParts, M.CreepRoles.ROLE_MINER);
    });
  }
}

function _spawnCreep(spawn: StructureSpawn, bodyParts: BodyPartConstant[], role: M.CreepRoles) {
  const uuid: number = Memory.uuid;
  let status: number | string = spawn.canCreateCreep(bodyParts, undefined);

  let properties: any | M.CreepMemory =
  {
    log: false,
    role,
    roleString: M.roleToString(role)
  };

  status = _.isString(status) ? OK : status;
  if (status === OK) {
    Memory.uuid = uuid + 1;
    const creepName: string = spawn.room.name + " - " + role + uuid;

    console.log(`[${Inscribe.color("Started creating new Creep: " + creepName, "Green")}]`);
    if (Config.DEBUG_MODE) {
      console.log(`[${Inscribe.color("Body: " + bodyParts, "Blue")}]`);
    }

    status = spawn.createCreep(bodyParts, creepName, properties);

    return _.isString(status) ? OK : status;
  }
  else {
    if (Config.DEBUG_MODE && status !== ERR_NOT_ENOUGH_ENERGY) {
      console.log(`[${Inscribe.color("Failed creating new creep: " + status, "Red")}]`);
    }

    return status;
  }
}
