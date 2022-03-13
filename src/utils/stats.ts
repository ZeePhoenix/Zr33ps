export function collectStats(){
	const totalStorage = getTotalStorage();
	Memory.stats = {
		storageAmount: totalStorage,
	gcl: {
		level: Game.gcl.level,
		progress: Game.gcl.progress,
		progressTotal: Game.gcl.progressTotal,
	}
	}
}
function getTotalStorage():number {
	let totalStorage = 0;
	for(let i in Game.rooms){
		totalStorage += Game.rooms[i].energyAvailable;
	}
	return totalStorage;
}

