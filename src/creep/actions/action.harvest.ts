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

export function harvest(creep: Creep, options: HarvestOptions = {}){
	options = {
		...DEFAULT_OPTIONS,
		...options
	};

	if (options.enteringAction || !creep.memory.actionHarvest) {
		const newContext: HarvestMemory = {
			sourceId: null,
			blockedTicks: 0
		};
	}
	const context: HarvestMemory = creep.memory.actionHarvest;

	let target: Source | null = null;

	// Try loading target from options
	if (options.sourceId){
		const found = Game.getObjectById<Source>(options.sourceId);
		if(found){
			target = found;
			context.sourceId = target.id;
		}
	}

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
