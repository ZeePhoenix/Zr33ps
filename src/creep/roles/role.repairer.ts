import { runCreepStateMachine, StateMachine } from "creep/creepStateMachine";
import { CreepRole } from "definitions";
import { getNearbyAvalibleBuffer } from "utils/positions";

interface RepairerMemory {
	state: string
	previousState: string
}

const roleRepairer:CreepRole = {
	getRoleName: function () { return 'repairer'; },
	getBody: function (energyCapacity: number): BodyPartConstant[] {
		let body:BodyPartConstant[] = []
		for (let i=0; i < Math.floor(energyCapacity/150); i++){
			body.push(WORK);
			body.push(CARRY);
			body.push(MOVE);
		}
		return body;
	},
	run: function (creep: Creep) {
		const machine:StateMachine<RepairerMemory> = {
			initialContext: () => ({
				state: 'GATHERING',
				previousState: null
			}),
			states: {
				'GATHERING' : {
					tick: (context:any) => {
						const buffer = getNearbyAvalibleBuffer(creep, false);
						if (buffer){
							// TODO this could be a helper
							if (creep.pos.getRangeTo(buffer) < 2){
								creep.withdraw(buffer, RESOURCE_ENERGY);
							} else {
								creep.moveTo(buffer.pos);
							}
							// endof TODO
							if (creep.store.energy === creep.store.getCapacity()){
								return 'REPAIRING';
							}
						}
						return null;
					}
				},
				'REPAIRING': {
					tick: (context:any) => {
						const room = Game.rooms[creep.memory.baseRoom];
						const repairsList = room.find(FIND_STRUCTURES)
							.filter(s => (s.structureType !== STRUCTURE_CONTROLLER
							&& s.hits < s.hitsMax));
						repairsList.sort((a,b) => {
							return (b.hitsMax - b.hits) - (a.hitsMax - a.hits);
						});
						//console.log(`${JSON.stringify(repairsList)}`);
						let target = repairsList[0];
						if (target){
							if (creep.pos.getRangeTo(target.pos) <= 3 ){
								creep.repair(target);
							} else {
								creep.moveTo(target.pos);
							}
						}

						if (creep.store.energy === 0){
							return 'GATHERING';
						} else {
							return null;
						}
					}
				}
			}
		}

		runCreepStateMachine(creep, machine, 'roleRepairer');
	}
}

export default roleRepairer;
