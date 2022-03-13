import { isWithinRange } from "utils/positions";
import { shuffle } from "utils/random";

interface HarvestOptions{
	sourceId?: string;
	enteringAction?: boolean;
	assign?: boolean
}
interface HarvestMemory {
	sourceId: string|null;
	blockedTicks: number;
}

const BLOCKED_TICKS_TO_REASSIGN = 10;

const DEFAULT_OPTIONS: HarvestOptions = {
	enteringAction: false,
	assign: false
};

export function harvest(creep: Creep, passedSource?:string){
	if (!creep.memory.actionHarvest) {
		const newContext: HarvestMemory = {
			sourceId: null,
			blockedTicks: 0
		};
		creep.memory.actionHarvest = newContext;
	}
	const context: HarvestMemory = creep.memory.actionHarvest;
	let target: Source | null = null;

	if (passedSource !== undefined) { context.sourceId = passedSource; }
	// Try loading target from previous state
	if(!target && context.sourceId){
		const found = Game.getObjectById<Source>(context.sourceId);
		if (found){
			target = found;
		}
	}

	// Try picking and assigning a new target
	if (!target) {
		const sources = creep.room.find(FIND_SOURCES, {
			filter: (source: Source)  => source.energy > 0
		});
		if (sources.length > 0 ){
			shuffle(sources);
			target = sources[0];
			context.sourceId = target.id;
		}
	}

	if (target) {
		if (creep.harvest(target) === ERR_NOT_IN_RANGE){
			// Give up on this source if we have been blocked
			if (isWithinRange(creep.pos, target.pos, 2)){
				context.blockedTicks += 1;
				if (context.blockedTicks > BLOCKED_TICKS_TO_REASSIGN) {
					context.blockedTicks = 0;
					context.sourceId = null;
				}
			}

			creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
		}
	}
}
