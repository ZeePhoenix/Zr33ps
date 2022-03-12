import { autoSpawn } from 'room/base/autoSpawn';
import { checkTaskCompletion, initTask } from 'room/base/task';
import { RoomRole, Task, TaskProgressContext } from '../../definitions';
import { createRoomMeta, RoomExploration } from 'room/base/exploration';

export interface RoomBaseMemory {
	rcl: number;
	tasks: {
		pending: Task[];
		inProgress: TaskProgressContext | null;
	},
	exploration: RoomExploration
}

const CREEP_REQUIREMENTS_BASIC = [
	'upgrader',
	'upgrader',
	'harvester',
	'harvester',
];

const CREEP_REQUIREMENTS_ADVANCED = [
	'harvester',
	'upgrader',
	'harvester',
	'repairer',
	'manager',
	'upgrader',
];

const RCL_EVENTS_TO_TASKS: { [key: number]: Task[] } = {
	1: [
		{ type: 'SET_CREEP_REQS', reqs: CREEP_REQUIREMENTS_BASIC },
		{ type: 'WAIT_FOR_SPAWN' },
		{ type: 'PLAN_BASE'},
	],
	2: [
		{ type: 'BUILD_EXTENSIONS'},
		//{ type: 'BUILD_BUFFERS'},
		{ type: 'SET_CREEP_REQS', reqs: CREEP_REQUIREMENTS_ADVANCED },
	],
	3: [
		{ type: 'BUILD_EXTENSIONS'},
	],
	4:[
		{ type: 'BUILD_EXTENSIONS'},
	],
	5:[
		{ type: 'BUILD_EXTENSIONS'},
	],
	6:[
		{ type: 'BUILD_EXTENSIONS'},
	],
	7:[
		{ type: 'BUILD_EXTENSIONS'},
	],
};

const INITIAL_MEMORY: RoomBaseMemory = {
	rcl: 0,
	tasks: {
		pending: [],
		inProgress: null
	},
	exploration: {
		rooms: [],
	}
}

const roleBase: RoomRole = {
	run: (room:Room) => {
		if (!room.memory.roleBase){
			room.memory.roleBase = INITIAL_MEMORY;
			const roleBase = room.memory.roleBase as RoomBaseMemory;
			const roomMeta = createRoomMeta(room, room);
			roleBase.exploration.rooms.push(roomMeta);

		}

		if (Game.time % 10 === 0){
			autoSpawn(room);
		}

		if (Game.time % 10 === 2){
			processEvents(room);
		}

		if (Game.time % 10 === 4){
			processTasks(room);
		}
	}
}

export default roleBase;

// Events are things that happen that we Observe (ex: RCL updating)
export function processEvents(room: Room){
	const roleHomeMemory = room.memory.roleHome as RoomBaseMemory;

	if (room.controller){
		const newRcl = room.controller.level;
		if (newRcl > roleHomeMemory.rcl) {
			console.log('we have upgraded the room to rcl ${newRcl}');
			roleHomeMemory.rcl = newRcl;
			const tasksToEnqueue = RCL_EVENTS_TO_TASKS[newRcl] || [];
			for (let task of tasksToEnqueue){
				roleHomeMemory.tasks.pending.push(task);
			}
			console.log('new tasks: ${JSON.stringify(roleHomeMemory.tasks.pending)}');
		}
	}
}

// Tasks are tasks we undertake to impact the world
export function processTasks(room: Room){
	const roleHomeMemory = room.memory.roleHome as RoomBaseMemory;

	if (!roleHomeMemory.tasks.inProgress && roleHomeMemory.tasks.pending.length){
		const pendingTask = roleHomeMemory.tasks.pending.shift();
		try {
			const context = initTask(pendingTask!, room);
			roleHomeMemory.tasks.inProgress = context;
		} catch (err) {
			// just drop the bad task
		}
	}

	if (roleHomeMemory.tasks.inProgress) {
		const isComplete = checkTaskCompletion(roleHomeMemory.tasks.inProgress, room);
		if (isComplete) {
			console.log('Task Complete!');
			// TODO add completed list
			roleHomeMemory.tasks.inProgress = null;
		}
	}
}


