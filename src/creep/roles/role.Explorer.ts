import { goToRoom, isInRoom } from '../actions/action.goToRoom';
import { CreepRole } from '../../definitions';
import { runCreepStateMachine, StateMachine } from '../creepStateMachine';
import { shuffle } from '../../utils/random';

interface ExplorerMemory {
	state: string
	previousState: string | null
	roomQueue: string[]
}

const roleExplorer: CreepRole = {
	getRoleName() { return 'explorer'; },

	getBody(energyCapacity){
		return [ MOVE, MOVE ];
	},

	run: function(creep: Creep){
		const machine: StateMachine<ExplorerMemory> = {
			initialContext: () => ({
				state: 'WAITING',
				previousState: null,
				roomQueue: getAdjacentRooms(creep.memory.baseRoom)
			}),
			states: {
				'WAITING': {
					tick: (context:any) => {
						if (context.roomQueue.length) {
							return 'EXPLORING';
						}
						return null;
					}
				},
				'EXPLORING': {
					tick: (context:any) => {
						if (context.roomQueue.length === 0){
							return 'WAITING';
						}

						const targetRoom = context.roomQueue[0];
						if (isInRoom(creep,targetRoom)){
							console.log(`Shifting room from queue: ${context.roomQueue.shift()}`);
						} else {
							goToRoom(creep, targetRoom);
						}

						return null;
					}
				}
			}
		};

		runCreepStateMachine(creep, machine, 'roleExplorer');
	}
};

export default roleExplorer;

function getAdjacentRooms(roomName: string): string[]{
	const exits = Game.map.describeExits(roomName);
	const maybeResults: (string|undefined)[] = Object.values(exits);
	const results: string[] = maybeResults.filter(exit => exit && typeof exit === 'string') as string[];
	shuffle(results);
	return results;
}
