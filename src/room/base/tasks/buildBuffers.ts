import { TaskProgressContext, TaskRunner } from '../../../definitions';
import { isAdjacent, getPositionsNear, positionIsEmpty, positionsEqual, sortByDistanceTo } from '../../../utils/positions';

const buildBuffers: TaskRunner = {
	delayCheck: true,
	init:(context: TaskProgressContext, room:Room)=>{
		const sources = room.find(FIND_SOURCES);
		for (let source of sources) {
			buildBuffer(room, source.id);
		}
	},
	check:(context:TaskProgressContext, room:Room)=>{
		const buffersInProgress = room.find(FIND_MY_CONSTRUCTION_SITES, {
			filter: (site) => site.structureType === 'container'
		});
		return buffersInProgress.length === 0;
	}
};

export default buildBuffers;

export function buildBuffer(room: Room, sourceId: string) {
	//@ts-ignore
	const source:Source = Game.getObjectById(sourceId);
	if(!source) {
		throw new Error('Source does not exist!');
	}

	const spawn = room.find(FIND_MY_SPAWNS)[0];

	const terrain = new Room.Terrain(room.name);

	const possibleWorkerPositions = getPositionsNear(source.pos, 1)
		.filter((pos: any) => positionIsEmpty(pos, terrain));

	const possibleBufferPositions = getPositionsNear(source.pos, 2)
		.filter((bufferPos: any) => {
			return positionIsEmpty(bufferPos, terrain)
			&& !possibleWorkerPositions.find((workerPos: any) => positionsEqual(bufferPos, workerPos))
			&& possibleWorkerPositions.find((workerPos: any) => isAdjacent(workerPos, bufferPos))
		});

	if (!possibleBufferPositions.length){
		throw new Error(`Could not find a place for a buffer near source ${source.id}`);
	}

	const positionSorter = composeSorters([
		sortByNeatAlignment(spawn.pos),
		//sortByTravelDistanceTo(spawn.pos, 1) // Possibly too expensive
		sortByDistanceTo(spawn.pos)
	]);

	possibleBufferPositions.sort(positionSorter)

	if(!possibleBufferPositions.length){
		throw new Error('Could not find a place for a buffer near a source');
	}

	const selectedPosition = possibleBufferPositions[0];

	room.createConstructionSite(selectedPosition, STRUCTURE_CONTAINER);
}

type SorterFunction<T> = (a: T, b:T) => number;

function composeSorters<T>(sorters: SorterFunction<T>[]): SorterFunction<T> {
	// Try first sorter, if it returns 0 try next sorter
	return (itemA: T, itemB: T) => {
		for(let sorter of sorters){
			const sortResult = sorter(itemA, itemB);
			if (sortResult !== 0) {
				return sortResult;
			}
		}
		return 0;
	};
}

const sortByTravelDistanceTo = (targetPos: RoomPosition, range: number) => (posA: RoomPosition, posB: RoomPosition) => {
	// Calc distance from A to Target
	// Calc distance from B to Target
	// Subtract A - B
	const distanceA = PathFinder.search(posA, {pos:targetPos, range}).cost;
	const distanceB = PathFinder.search(posB, {pos:targetPos, range}).cost;

	return distanceA - distanceB;
}

const sortByNeatAlignment = (targetPosition: RoomPosition) => (posA:RoomPosition, posB: RoomPosition) => {
	const aNeat = (posA.x === targetPosition.x || posA.y === targetPosition.y);
	const bNeat = (posB.x === targetPosition.x || posB.y === targetPosition.y);

	if (aNeat && !bNeat){
		return -1;
	} else if (!aNeat && bNeat){
		return 1;
	} else {
		return 0;
	}
};
