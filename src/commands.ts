Creep.prototype.setRole = function(role:string){
	this.memory.role = role;
}

Creep.debugRoles = (debug:boolean) => {
	Memory.debug.creepRoles = debug;
}

Creep.getByName = (name:string) => Game.creeps[name]


Creep.stringify = (creepName:string) => {
	const creepMem = Game.creeps[creepName].memory;
	console.log(JSON.stringify(creepMem, null, 2));
}

Room.first = function(){
	return Object.values(Game.rooms)[0];
}

Memory.debug = {
	creepId: null,
	creepRoles: false
};
