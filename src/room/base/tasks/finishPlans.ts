import { TaskProgressContext, TaskRunner} from "definitions";

const finishPlans: TaskRunner = {
	delayCheck: false,
	init:(context: TaskProgressContext, room: Room) => {
		const flags = room.find(FIND_FLAGS).filter(f => f.name.includes('Site'));
		flags.forEach(flag => {
			if(flag.name.includes('Storage')){
				//@ts-ignore
				if(room.controller?.level >= 4){
					room.createConstructionSite(flag.pos, STRUCTURE_STORAGE);
				}
			} else if (flag.name.includes('Tower')){
				room.createConstructionSite(flag.pos, STRUCTURE_TOWER);
			} else if (flag.name.includes('Road')){
				room.createConstructionSite(flag.pos, STRUCTURE_ROAD);
			} else {
				// TODO make this a switch for all BuildableStructureConstants
				throw new Error(`could not construct ${flag.name}`);
			}
		});
	},
	check:(context: TaskProgressContext, room: Room) => {
		return true;
	}
}

export default finishPlans;
