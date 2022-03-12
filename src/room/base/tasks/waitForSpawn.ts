import { TaskRunner, TaskProgressContext } from '../../../definitions';

const waitForSpawn: TaskRunner = {
	delayCheck: false,
	init:(context: TaskProgressContext, room: Room)=>{},
	check:(context: TaskProgressContext, room: Room)=>{
		const spawns = room.find(FIND_MY_SPAWNS);
		return (spawns.length !== 0);
	}
};

export default waitForSpawn;
