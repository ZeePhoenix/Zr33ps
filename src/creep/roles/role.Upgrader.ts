import { goToRoom, isInRoom } from "creep/actions/action.goToRoom";
import { harvest } from "creep/actions/action.harvest";
import { runCreepStateMachine, StateMachine } from "creep/creepStateMachine";
import { CreepRole } from "definitions";
import { getNearbyAvalibleBuffer } from "utils/positions";
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
						const buffer = getNearbyAvalibleBuffer(creep);
						if (buffer){
							if (creep.pos.getRangeTo(buffer) < 2){
								creep.withdraw(buffer, RESOURCE_ENERGY);
							} else {
								creep.moveTo(buffer.pos);
							}
							if (creep.store.energy === creep.store.getCapacity()){
								return 'UPGRADING';
							}
						} else {
							return 'HARVESTING';
						}
						return null;
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
