import { TaskProgressContext, TaskRunner } from "definitions";

const buildRoadsToSources: TaskRunner ={
	delayCheck: true,
	init: (context:TaskProgressContext, room:Room) => {
		const sources = room.find(FIND_SOURCES);
		// build roads to controller
		sources.forEach(source => {
			const pathSteps = source.pos.findPathTo(room.controller!.pos);
			pathSteps.forEach(step => {
				if (room.createConstructionSite(step.x,step.y,STRUCTURE_ROAD) !== OK ){
					console.log(`Error creating road at (${step.x,step.y})`);
				}
			});
		});
		sources.forEach(source => {
			const spawn = room.find(FIND_MY_SPAWNS)[0];
			const pathSteps = source.pos.findPathTo(spawn.pos);
			pathSteps.forEach(step => {
				if (room.createConstructionSite(step.x,step.y,STRUCTURE_ROAD) !== OK ){
					console.log(`Error creating road at (${step.x,step.y})`);
				}
			});
		});
	},
	check:(context:TaskProgressContext, room:Room) => {
		const roadsInProgress = room.find(FIND_MY_CONSTRUCTION_SITES, {
			filter: (site) => site.structureType === 'road' });
		return roadsInProgress.length === 0;
	}
};

export default buildRoadsToSources;
