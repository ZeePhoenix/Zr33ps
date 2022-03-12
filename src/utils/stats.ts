export function collectStats(){
	const totalStorage = 0; // TODO calulate the energy stored
	Memory.stats = {
		storageAmount: totalStorage,
	gcl: {
		level: Game.gcl.level,
		progress: Game.gcl.progress,
		progressTotal: Game.gcl.progressTotal,
	}
	}
}
