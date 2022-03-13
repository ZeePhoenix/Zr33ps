import { getUnfilledExtension } from "creep/actions/action.store"
import { runCreepStateMachine, StateMachine } from "creep/creepStateMachine"
import { CreepRole } from "definitions"
import { getNearbyAvalibleBuffer } from "utils/positions"

interface ManagerMemory {
	state:string
	previousState:string|null
}

const roleManager: CreepRole = {
	getRoleName() { return 'manager' },
	getBody(energyCapacity:number) {
		let body:BodyPartConstant[] = [];
		for (let i=0; i<Math.floor(energyCapacity/100) i++){
			body.push(MOVE);
			body.push(CARRY);
		}
		return body;
	},
	run:function(creep){
		const machine: StateMachine<ManagerMemory> = {
			initialContext: () => ({
				state: 'GATHERING',
				previousState:null
			}),
			states: {
				'GATHERING':{
					tick: (context:any) => {
						const buffer = getNearbyAvalibleBuffer(creep);
						if (buffer){
							if (creep.pos.getRangeTo(buffer) < 2){
								creep.withdraw(buffer,RESOURCE_ENERGY);
							} else {
								creep.moveTo(buffer.pos);
							}
						} else {
							console.log(`Manager ${creep.name} has no buffer to extract from`);
							return null;
						}
						if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0){
							return 'DISTRIBUTING';
						} else {
							return null;
						}
					}
				},
				'DISTRIBUTING':{
					tick: (context:any) => {
						let extension = getUnfilledExtension(creep);
						if (extension !== null){
							if (creep.pos.getRangeTo(extension) < 2){
								creep.transfer(extension, RESOURCE_ENERGY)
							} else {
								creep.moveTo(extension);
							}
						} else {
							const room = Game.rooms[creep.memory.baseRoom];
							const spawn = room.find(FIND_MY_SPAWNS)[0];
							if (creep.pos.getRangeTo(spawn.pos) < 2){
								creep.transfer(spawn, RESOURCE_ENERGY);
							} else {
								creep.moveTo(spawn.pos);
							}
						}

						if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0){
							return 'GATHERING';
						} else {
							return null;
						}
					}
				},
			}
		}
		runCreepStateMachine(creep, machine, 'roleManager');
	}
}

export default roleManager;
