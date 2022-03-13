import { Task, TaskRunner, TaskProgressContext } from "definitions";
import { hashCode } from "utils/hashCode";
import buildExtensions from "./tasks/buildExtensions";
import planBase from "./tasks/planBase";
import setCreepReqs from "./tasks/setCreepReqs";
import waitForSpawn from "./tasks/waitForSpawn";

const TASKS: { [type: string]: TaskRunner } = {
	'SET_CREEP_REQS': setCreepReqs,
	'WAIT_FOR_SPAWN': waitForSpawn,
	'PLAN_BASE': planBase,
	'BUILD_EXTENSIONS': buildExtensions
}

export function initTask(task: Task, room: Room): TaskProgressContext {
	console.log(`Time to process task: ${JSON.stringify(task)}`);
	const id = hashCode(`task*$(task.type)*$(Game.time)`);
	const context: TaskProgressContext = {
		id,
		task,
		startTick: Game.time
	};

	const taskRunner = getTaskRunner(task.type);
	if (!taskRunner){
		throw new Error(`No runner defined for task ${task.type}`);
	}
	taskRunner.init(context, room);

	return context;
}

export function checkTaskCompletion(context: TaskProgressContext, room: Room): boolean {
	//console.log('checking task completion ${JSON.stringify(context)}');
	const taskRunner = getTaskRunner(context.task.type);
	if (!taskRunner){
		throw new Error(`No runner defined for task ${context.task.type}`);
	}
	if (taskRunner.delayCheck && Game.time === context.startTick){ return false; }

	return taskRunner.check(context, room);
}

function getTaskRunner(type: string): TaskRunner | null {
	if (TASKS.hasOwnProperty(type)){
		return TASKS[type];
	} else {
		return null;
	}
}
