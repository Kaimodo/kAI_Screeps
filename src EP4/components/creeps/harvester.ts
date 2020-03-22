import * as Config from "settings/config";

import * as Utils from "utils/utils";

import * as M from "settings/memory";

/*
export function run(creep: Creep) {
  if (creep.store.getFreeCapacity() > 0) {
    let sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  } else {
    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          (structure.structureType === STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      }
    });
    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  }
}
*/
export function run(creep: Creep): void {
  const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
  const energySource = creep.room.find(FIND_SOURCES_ACTIVE)[0];

  if (creep.store.getCapacity() === creep.carryCapacity) {
    _moveToDropEnergy(creep, spawn);
  } else {
    _moveToHarvest(creep, energySource);
  }
}

function _tryHarvest(creep: Creep, target: Source): number {
  return creep.harvest(target);
}

function _moveToHarvest(creep: Creep, target: Source): void {
  if (_tryHarvest(creep, target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target.pos);
  }
}

function _tryEnergyDropOff(creep: Creep, target: StructureSpawn | Structure): number {
  return creep.transfer(target, RESOURCE_ENERGY);
}

function _moveToDropEnergy(creep: Creep, target: StructureSpawn | Structure): void {
  if (_tryEnergyDropOff(creep, target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target.pos);
  }
}
