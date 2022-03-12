export interface CreepRole {
	getRoleName: () => string
	getBody: (energyCapacity:number) => BodyPartConstant[]
	run: (creep:Creep) => any
}

export interface RoomRole {
	run: (room:Room) => void
}

export type Task =
	| { type: 'SET_CREEP_REQS', reqs: string[] }
	| { type: 'WAIT_FOR_SPAWN' } // task only required in the SIM
	| { type: 'PLAN_BASE' }
	| { type: 'BUILD_EXTENSIONS' }

export interface TaskProgressContext {
	id: string;
	task: Task;
	startTick: number;
}

export interface TaskRunner {
	delayCheck: boolean;
	init: (context:TaskProgressContext, room:Room) => void;
	check: (context:TaskProgressContext, room:Room) => boolean;
}

export type BuildingPlanType =
	| 'TOWER'
	| 'STORAGE'
	| 'ROAD'

export interface GlobalStats{
	storageAmount: number
	gcl: {
		level: number
		progress: number
		progressTotal: number
	}
}

export interface RoomHistoryItem{
	time: number
	realTime: string
	controllerLevel: number
	controllerProgress: number
	controllerProgressTotal: number
}

export type PathFinderGoal = {
	pos: RoomPosition,
	range: number
}
