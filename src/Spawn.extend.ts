import { hashCode } from './utils/hashCode';
import { getCreepBody } from './creep/roles';

StructureSpawn.prototype.spawnCreepWithRole = function(body:BodyPartConstant[], role:string, baseRoom:string, targetRoom:string){
	try{
		return spawnCreepFilled(this, body, role, baseRoom, targetRoom);
	} catch (err){
		return ERR_INVALID_ARGS;
	}
}

StructureSpawn.prototype.create = function(role:string){
	return spawnCreepFilled(this, getCreepBody(role, this.room), role, this.room.name, this.room.name);
}

StructureSpawn.prototype.createEmergencyHarvester = function() {
	return spawnCreepFilled(this, [WORK, CARRY, MOVE], 'harvester', this.room.name, this.room.name);
}

// Helper function to actually spawn the creep with all the needed arguments passed in
function spawnCreepFilled(spawn:StructureSpawn, body:BodyPartConstant[], role:string, baseRoom:string, targetRoom:string):ScreepsReturnCode{
	const name = hashCode(`${role}*${spawn.name}*${Game.time}`);
	const result = spawn.spawnCreep(body,name,{
		memory: {
			role: role,
			baseRoom: baseRoom,
			targetRoom: targetRoom
		}
	});
	if (result === OK){
		console.log(`Spawned new ${role} at ${spawn.name}`);
	}
	return result;
}
