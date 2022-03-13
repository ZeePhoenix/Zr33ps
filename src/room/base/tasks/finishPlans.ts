import { TaskProgressContext, TaskRunner} from "definitions";

const finishPlans: TaskRunner = {
	delayCheck: false,
	init:(context: TaskProgressContext, room: Room) => {
		const flags = room.find(FIND_FLAGS).filter(f => f.name.includes('Site'));
		flags.forEach(flag => {
			let structString = flag.name.substring(0, flag.name.indexOf('*'));
			let level = room.controller!.level;
			switch(structString){
				case 'StorageSite':
					if (level >= 4){
						room.createConstructionSite(flag.pos, STRUCTURE_STORAGE);
						flag.remove();
					}
					break;
				case 'TowerSite':
					if (level >= 3){
						room.createConstructionSite(flag.pos, STRUCTURE_TOWER);
						flag.remove();
					}
					break;
				case 'RoadSite':
					room.createConstructionSite(flag.pos, STRUCTURE_ROAD);
					flag.remove();
					break;
			}
		});
	},
	check:(context: TaskProgressContext, room: Room) => {
		return true;
	}
}

export default finishPlans;
