export class HarvestNearestSourceRole {
  public static run(creep: Creep) {
    if (creep.store.getFreeCapacity() > 0) {
      let closestSource = creep.pos.findClosestByPath(FIND_SOURCES);
      if (closestSource != null && creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    } else {
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if (targets != null && targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
  }
}
