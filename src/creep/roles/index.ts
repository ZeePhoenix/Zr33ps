import { CreepRole } from '../../definitions';
import roleHarvester from '../roles/role.Harvester';
import roleBuilder from './role.builder';
import roleExplorer from './role.Explorer';
import roleManager from './role.manager';
import roleRepairer from './role.repairer';
import roleUpgrader from './role.Upgrader';

interface RoleLookup {
	[roleName: string]: CreepRole
}

const ROLES: RoleLookup = {
	'harvester': roleHarvester,
	'upgrader': roleUpgrader,
	'builder': roleBuilder,
	'manager': roleManager,
	'repairer': roleRepairer,
	'explorer': roleExplorer
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
		creep.suicide();
	}
}

export function getCreepBody(role:string, room:Room): BodyPartConstant[]{
	return getRole(role)!.getBody(room.energyAvailable);
}
