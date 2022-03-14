import { goToRoom, isInRoom } from "creep/actions/action.goToRoom"
import { harvest } from "creep/actions/action.harvest"
import { runCreepStateMachine, StateMachine } from "creep/creepStateMachine"
import { CreepRole } from "definitions"
import { getNearbyAvalibleBuffer } from "utils/positions"
import { shuffle } from "utils/random"
import { assignSource } from "./role.Harvester"

interface BuilderMemory {
	state: string
	previousState: string|null
	buildingSite: string|null
	sourceId: string|null
}

const roleBuilder: CreepRole = {
	getRoleName() { return 'builder' },
	getBody: function (energyCapacity: number): BodyPartConstant[] {
		const cycles = Math.floor(energyCapacity / 200);
		let body:BodyPartConstant[] = [];
		for (let i = 0; i < cycles; i++){
			body.push(WORK);
			body.push(CARRY);
			body.push(MOVE);
		}
		return body;
	},
	run: function (creep: Creep) {
		const machine:StateMachine<BuilderMemory> = {
			initialContext: () =>({
				state: 'GATHERING',
				previousState: null,
				buildingSite: null,
				sourceId: null,
			}),
			states: {
				'GATHERING' : {
					tick: (context:any) => {
						if (creep.store.energy === creep.store.getCapacity()){
							return 'BUILDING';
						}
						const buffer = getNearbyAvalibleBuffer(creep);
						if (buffer){
							if(creep.pos.getRangeTo(buffer.pos) < 2){
								creep.withdraw(buffer, RESOURCE_ENERGY);
							} else {
								creep.moveTo(buffer.pos);
							}
						} else {
							return 'HARVESTING';
						}
						return null;
					}
				},
				'HARVESTING': {
					tick: (context:any) => {
						if (!context.sourceId){
							context.sourceId = assignSource(creep);
						}

						if (creep.store.energy === creep.store.getCapacity()){
							return 'BUILDING';
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
				'BUILDING': {
					tick: (context:any) => {
						if (creep.store.energy === 0) { return 'GATHERING'; }
						let buildingSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
						if (!context.buildingSite || !Game.constructionSites[context.buildingSite]){
							// sort the list by completion progress
							buildingSites.sort((a,b) =>{
								const progressA = a.progressTotal - a.progress
								const progressB = b.progressTotal - b.progress
								return progressA - progressB;
							});
							if (buildingSites.length !== 0 ){
								context.buildingSite = buildingSites[0].id;
							} else {
								return null;
							}
						}
						let site = Game.constructionSites[context.buildingSite]
						if (creep.pos.getRangeTo(site) <= 3){
							creep.build(site);
						} else {
							creep.moveTo(site.pos);
						}
						return null;
					}
				}
			}
		}
		runCreepStateMachine(creep, machine, 'roleBuilder');
	}
}

export default roleBuilder;
