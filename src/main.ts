import './commands';
import 'Room.extend';
import 'Spawn.extend';
import { runRoomRole } from './room/roles';
import { runCreepRole } from './creep/roles';
import { RoomRole, RoomHistoryItem, GlobalStats } from './definitions';

declare global {
	type RoomName = string

	interface Creep{
		setRole: (role:string) => any
	}

	interface Room {
		isInitialized: () => boolean
		initialize: () => void
		getRole: () => RoomRole
		debugExploration: () => void
		resetExploration: () => void
		addReq: (role:string) => void
	}

	interface CreepMemory{
		role: string
		baseRoom: RoomName
		targetRoom: RoomName

		[name:string]: any
	}

	interface CreepConstructor{
		debugRoles: (shouldDebug:boolean) => void
		getByName: (name:string) => Creep
		stringify: (name:string) => void
	}

	interface RoomConstructor{
		first: () => Room
	}

	interface RoomMemory {
		role: string
		initialized?: boolean
		reqs: string[]
		history: RoomHistoryItem[]

		[name: string]: unknown
	}

	interface Memory {
		debug: {
			creepId: string | null
			creepRoles: boolean
		}
		stats: GlobalStats
		[name:string] : any
	}

	interface StructureSpawn {
		spawnCreepWithRole: (body:BodyPartConstant[], role:string, baseRoom:string, targetRoom:string) => ScreepsReturnCode
		create: (roleName: string) => ScreepsReturnCode
		createEmergencyHarvester: () => ScreepsReturnCode
	}
}


function loop(){
	// Creep Cleanup
	for(const creepName in Memory.creeps) {
		if(!Game.creeps[creepName]) {
			console.log(`Deleting dead creep ${creepName}`);
			delete Memory.creeps[creepName];
		}
	}

	for (let creepName in Game.creeps){
		var creep = Game.creeps[creepName];
		//console.log(`running creep:${creepName}`)
		runCreepRole(creep);
	}

	for (let roomName in Game.rooms){
		const room = Game.rooms[roomName];
		if (!room.isInitialized()){
			room.initialize();
		}
		runRoomRole(room);
	}
}

module.exports = {
	loop
};
