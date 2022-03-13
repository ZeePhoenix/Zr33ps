import { hashCode } from './utils/hashCode';
import { getCreepBody } from './creep/roles';

StructureSpawn.prototype.spawnCreepWithRole = function(body:BodyPartConstant[], role:string, baseRoom:string, targetRoom:string){
	try{
		return spawnCreep(this, body, role, baseRoom, targetRoom);
	} catch (err){
		return ERR_INVALID_ARGS;
	}
}

StructureSpawn.prototype.create = function(role:string){
	return spawnCreep(this, getCreepBody(role, this.room), role, this.room.name, this.room.name);
}

StructureSpawn.prototype.createEmergencyHarvester = function() {
	return spawnCreep(this, [WORK, CARRY, MOVE], 'harvester', this.room.name, this.room.name);
}

// Helper function to actually spawn the creep with all the needed arguments passed in
function spawnCreep(spawn:StructureSpawn, body:BodyPartConstant[], role:string, baseRoom:string, targetRoom:string):ScreepsReturnCode{
	const name = hashCode(`${role}*${spawn.name}*${Game.time}`);
	const result = spawn.spawnCreep(body,name,{
		memory: {
			role: role,
			baseRoom: baseRoom,
			targetRoom: targetRoom
		}
	});
	if (result === OK){
		console.log(`Spawned new ${role}`);
		//spawn.room.recordSpawntime(); // TODO
	}
	return result;
}
