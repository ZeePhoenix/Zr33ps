import { goToRoom, isInRoom } from "creep/actions/action.goToRoom";
import { harvest } from "creep/actions/action.harvest";
import { getUnfilledExtension, store, storeAtPos, storeNearby } from "creep/actions/action.store";
import { runCreepStateMachine, StateMachine } from "creep/creepStateMachine";
import { CreepRole } from "definitions";
import { debugCreep } from "utils/debugCreep";
import { getNearbyAvalibleBuffer } from "utils/positions";
import { shuffle } from "utils/random";

const CAPACITY_RCL_1 = 300;
const CAPACITY_EXT = 50;
const CAPACITY_EXT_7 = 100;
const CAPACITY_EXT_8 = 200;

interface HarvesterMemory {
	state: string
	previousState: string | null
	sourceId: string | null
}

const roleHarvester: CreepRole = {
	getRoleName() { return 'harvester'; },

	getBody(energyCapacity:number){
		if (energyCapacity >= (CAPACITY_RCL_1 + (CAPACITY_EXT * 2))){
			return [
				MOVE, MOVE,
				WORK, WORK,
				CARRY, CARRY
			]
		}
		return getDefaultBody();
	},

	run: function(creep){
		const machine: StateMachine<HarvesterMemory> = {
			initialContext: () => ({
				state: 'HARVESTING',
				previousState: null,
				sourceId: null
			}),
			states: {
				'HARVESTING' : {
					tick: (context:any) => {
						if (!context.sourceId){
							context.sourceId = assignSource(creep);
						}

						if (creep.store.energy === creep.store.getCapacity()){
							return 'STORING';
						}

						if (isInRoom(creep, creep.memory.targetRoom)){
							if (context.sourceId) {
								harvest(creep, context.sourceId);
							} else {
								harvest(creep);
							}

						} else {
							goToRoom(creep, creep.memory.targetRoom);
						}
						return null;
					}
				},
				'STORING': {
					tick: (context:any) => {
						if (creep.store.energy === 0){
							return 'HARVESTING';
						}
						const buffer = getNearbyAvalibleBuffer(creep, true);
						if (buffer){
							//storeNearby(creep, buffer); // TODO FIX
							storeAtPos(creep, buffer);
						}else {
							let room = creep.memory.baseRoom;
							// check for extensions
							const extension = getUnfilledExtension(creep);
							if (extension !== null){
								storeAtPos(creep, extension);
							} else {
								if (isInRoom(creep, room)){
									store(creep);
									return 'HARVESTING';
								} else {
									goToRoom(creep, room);
								}
							}
						}
						return null;
					}
				}
			}
		}
		runCreepStateMachine(creep, machine, 'roleHarvester');
	}
}

export default roleHarvester;

function getDefaultBody(): BodyPartConstant[] {
	return [WORK, CARRY, MOVE];
}
export function assignSource(creep: Creep): any {
	let room = Game.rooms[creep.memory.targetRoom];
	let sources = room.find(FIND_SOURCES_ACTIVE);
	let harvesters = room.find(FIND_MY_CREEPS).filter(creep => creep.memory.role === 'harvester');
	if (harvesters.length > 1){
		let tryBalanace = null;
		sources.forEach(source => {
			harvesters.forEach(harvester => {
				if (creep.id !== harvester.id){
					if (source.pos.getRangeTo(harvester) > 2){
						tryBalanace = source;
					}
				}
			});
		});
		if (tryBalanace !== null){
			//@ts-ignore
			return tryBalanace.id;
		} else {
			return shuffle(sources)[0].id;
		}
	} else {
		return shuffle(sources)[0].id;
	}
}

