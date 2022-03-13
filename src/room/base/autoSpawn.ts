import { spawn } from 'child_process';
import { getCreepBody, getRole } from '../../creep/roles';

type RoomSpawnResult =
	| 'REQS_FILLED'
	| 'REQS_NEEDED'

export function autoSpawn(room:Room){
	const spawn = room.find(FIND_MY_SPAWNS)[0];
	_autoSpawn(room, spawn);
}

function _autoSpawn(room:Room, spawn:StructureSpawn){
	//console.log(`${room.name}: autoSpawn`);
	const assignedCreeps = getAssignedCreeps(room);
	if (assignedCreeps.length === 0){
		// We have no creeps, spawn emergency harvester
		spawn.createEmergencyHarvester();
		return;
	}


	if (handleBaseReqs(room, spawn, assignedCreeps) === 'REQS_NEEDED'){
		return;
	}
}

function handleBaseReqs(room:Room, spawn:StructureSpawn, assignedCreeps:string[]): RoomSpawnResult{
	const base = room.name;

	const next = getNext(room, assignedCreeps);
	if (!next){ return 'REQS_FILLED'; }

	// Gets the role from the next needed role in the list
	const role = getRole(next);
	if (role){
		const body = getCreepBody(next, room);
		spawn.spawnCreepWithRole(body, next, base, base);
		return 'REQS_NEEDED';
	} else { throw new Error(`autoSpawn is missing definition for next role ${next}`); }
}
function getNext(room: Room, assignedCreeps: string[]): string | undefined {
	if (assignedCreeps[0]){
		return assignedCreeps.pop() as string;
	} else {
		return undefined;
	}
}

function getAssignedCreeps(room: Room): string[] {
	return room.memory.reqs;
}

