import { CreepRole } from '../../definitions';
import roleHarvester from '../roles/role.Harvester';
import roleUpgrader from './role.Upgrader';

interface RoleLookup {
	[roleName: string]: CreepRole
}

const ROLES: RoleLookup = {
	'harvester': roleHarvester,
	'upgrader': roleUpgrader
};

export function getRole(roleName:string): CreepRole | null{
	return ROLES[roleName] || null;
}

export function runCreepRole(creep:Creep){
	const role = getRole(creep.memory.role);
	//console.log(`${JSON.stringify(creep)}`)
	if (role ){
		role.run(creep);
		if (Memory.debug.creepRoles){ creep.say(role.getRoleName()); }
	} else {
		console.log(`No role defined for ${creep.name}`);
	}
}

export function getCreepBody(role:string, room:Room): BodyPartConstant[]{
	// TODO make this more programatic
	return [WORK, CARRY, MOVE];
}
