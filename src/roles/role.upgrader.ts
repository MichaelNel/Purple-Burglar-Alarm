export class UpgraderRole{
  public static run(creep: Creep){
    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say('⚡ upgrade');
    }

    if(creep.memory.working) {
      if(creep.room.controller != null && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    }
    else {
      let closestSource = creep.pos.findClosestByPath(FIND_SOURCES);
      if(closestSource != null && creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
}
