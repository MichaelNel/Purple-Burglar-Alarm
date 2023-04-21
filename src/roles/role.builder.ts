export class BuilderRole {
  public static run(creep: Creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say('🚧 build');
    }

    if (creep.memory.working) {
      let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (target) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    } else {
      let closestSource = creep.pos.findClosestByPath(FIND_SOURCES);
      if (closestSource != null && creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
}
