import { goToRoom, isInRoom } from "creep/actions/action.goToRoom";
import { harvest } from "creep/actions/action.harvest";
import { runCreepStateMachine, StateMachine } from "creep/creepStateMachine";
import { CreepRole } from "definitions";
import { shuffle } from "utils/random";
import { assignSource } from "./role.Harvester";


interface UpgraderMemory {
	state:string
	previousState: string
	sourceId: string|null
}

const roleUpgrader: CreepRole = {
	getRoleName() { return 'upgrader'; },
	getBody(energyCapacity:number){
		return [WORK, CARRY, MOVE];
	},
	run: function(creep){
		const machine: StateMachine<UpgraderMemory> = {
			initialContext: () => ({
				state: 'GATHERING',
				previousState: null,
				sourceId: null
			}),
			states: {
				'GATHERING' : {
					tick: (context:any) => {
						// TODO implement BUFFERS
						const room = Game.rooms[creep.memory.targetRoom];
						let containers = room.find(FIND_STRUCTURES).filter(t => t.structureType === STRUCTURE_CONTAINER)
						if (containers.length !== 0){
							let container = shuffle(containers)[0];
							if (creep.pos.getRangeTo(container) <= 2){
								creep.withdraw(container, RESOURCE_ENERGY);
							}
							if (creep.store.energy === creep.store.getCapacity()){
								return 'UPGRADING';
							}
						} else {
							return 'HARVESTING';
						}
						throw new Error(`Something went wrong with ${creep.name}`);
					}
				},
				'HARVESTING' : {
					tick: (context:any) => {
						if (!context.sourceId){
							context.sourceId = assignSource(creep);
						}

						if (creep.store.energy === creep.store.getCapacity()){
							return 'UPGRADING';
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
				'UPGRADING' :{
					tick: (context:any) => {
						if (creep.store.energy === 0) { return 'GATHERING'; }
						if (!isInRoom(creep, creep.memory.baseRoom)){
							goToRoom(creep, creep.memory.baseRoom);
						} else {
							if (creep.room.controller){
								if (creep.pos.getRangeTo(creep.room.controller) <= 2){
									creep.transfer(creep.room.controller, RESOURCE_ENERGY);
									return 'GATHERING';
								} else {
									creep.moveTo(creep.room.controller);
									return null;
								}
							} else {
								throw new Error(`No controller in base room ${creep.memory.baseRoom}`);
							}
						}
						return null;
					}
				}
			}
		}
		runCreepStateMachine(creep, machine, 'roleUpgrader');
	}
}

export default roleUpgrader;
