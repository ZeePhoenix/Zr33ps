import { spawn } from 'child_process';
import { memoryUsage } from 'process';
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
	if (room.find(FIND_MY_CREEPS).length === 0){
		// We have no creeps, spawn emergency harvester+
		console.log(`Emergency Harvester Spawn`)
		spawn.createEmergencyHarvester();
		return;
	}


	if (handleBaseReqs(room, spawn, assignedCreeps) === 'REQS_FILLED'){
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
	return assignedCreeps.shift();
}

function getAssignedCreeps(room: Room): string[] {
	// TODO fix, functional but has error
	let roomCreeps = Array.from(room.find(FIND_MY_CREEPS), creep => creep.memory.role);
	let requirements = [...room.memory.reqs];
	let assignedCreeps:string[] = [];
	console.log(`room:${JSON.stringify(roomCreeps)} reqs:${JSON.stringify(requirements)}`)
	if (roomCreeps.length < requirements.length){
		requirements.forEach(creep => {
			const count = requirements.filter(x => x === creep).length
			const difference = count - roomCreeps.filter(x => x === creep).length;
			if (difference > 0){
				assignedCreeps.push(creep);
			}
		});
		console.log(`Assigned: ${JSON.stringify(assignedCreeps)}`)
	}
	return assignedCreeps;
}
