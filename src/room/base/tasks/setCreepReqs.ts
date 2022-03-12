import { TaskRunner, TaskProgressContext } from '../../../definitions';

const setCreepReqs: TaskRunner = {
	delayCheck: false,
	init:(context:TaskProgressContext, room: Room) => {
		if (context.task.type !== 'SET_CREEP_REQS'){
			throw new Error('Task is incorrect type!');
		}

		room.memory.reqs = context.task.reqs;
	},
	check: (context: TaskProgressContext, room: Room) =>{
		return true;
	}
};

export default setCreepReqs;
