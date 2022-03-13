import { createRoomMeta, RoomMeta } from './room/base/exploration';
import { RoomBaseMemory } from './room/roles/role.Base';

Room.prototype.isInitialized = function () {
	return(!!this.memory.initialized);
}

Room.prototype.initialize = function(){
	// Are we the first room? -> If so mark this room as a base
	const isFirstRoom = Object.keys(Game.rooms).length === 1
		&& Object.values(Game.rooms)[0].name === this.name;

	this.memory.initialized = true;
	this.memory.role = isFirstRoom ? 'base' : 'explored';
	this.memory.reqs = [];
	this.memory.history = [];
}

Room.prototype.debugExploration = function(){
	if (!this.memory.roleBase){
		throw new Error('Room ${this.name} is not a base room!')
	}
	const roleBase = this.memory.roleBase as RoomBaseMemory;
	console.log('Room ${this.name} exploration:');

	const table = formatTable(
		roleBase.exploration.rooms,
		[
			{ title: 'ROOM NAME', length: 11},
			{ title: 'DIST', length: 5},
			{ title: 'SOURCES', length: 8},
			{ title: 'TYPE', length: 12},
			{ title: 'OWNER', length: 10},
			{ title: 'RCL', length: 4},
			{ title: 'SPAWN PLANNING', length: 15},
			{ title: 'LAST EXPLORED', length: 20},
		],
		(roomMeta) => [
			roomMeta.name,
			`${roomMeta.distanceFromHome}`,
			`${roomMeta.sources.length}`,
			roomMeta.ownership.type,
			formatRoomOwner(roomMeta),
			formatRCL(roomMeta),
			//formatSpawnPlanning(roomMeta),
			`${roomMeta.lastExplored}`,
		]
	);

	console.log(table);
}

Room.prototype.resetExploration = function(){
	if (!this.memory.roleBase){
		throw new Error(`Room ${this.name} is not a base room!`)
	}
	const roleBase = this.memory.roleBase as RoomBaseMemory;
	console.log('RESETTING EXPLORATION');
	roleBase.exploration = {
		rooms : []
	}

	Object.entries(Memory.rooms)
		.filter(([roomName, room]) => room.role === 'explored')
		.map(([roomName, room]) => roomName)
		.forEach(roomName => delete Memory.rooms[roomName] );

	const roomMeta = createRoomMeta(this, this);
	roleBase.exploration.rooms.push(roomMeta);
}

interface Header{
	title: string
	length: number
}

function formatTable<E>(elements: E[], headers:Header[], formatter:(elem: E)=>string[]):string{
	const formattedHeaders = headers
		.map(header => forceStringLength(header.title, header.length))
		.join('');
	const formattedRows = elements
		.map(element => {
			const formattedCells = formatter(element);
			return headers
				.map((header, idx) => forceStringLength(formattedCells[idx], header.length))
				.join('');
		})
		.join('');
	return `${formattedHeaders}\n${formattedRows}`;
}

function forceStringLength(input:string, length:number):string {
	if (input.length > length){
		return input.substring(0, length -1) + ' ';
	} else {
		return input.padEnd(length);
	}
}
function formatRoomOwner(roomMeta: RoomMeta): string {
	if (roomMeta.ownership.type === 'OWNED'){
		return roomMeta.ownership.player;
	} else if (roomMeta.ownership.type === 'RESERVED' ){
		return roomMeta.ownership.player;
	} else { return ''; }
}

function formatRCL(roomMeta: RoomMeta): string {
	if (roomMeta.ownership.type === 'OWNED' ){
		return `${roomMeta.ownership.rcl}`;
	} else {
		return '';
	}
}

function formatPlannedSpawn(roomMeta: RoomMeta): string {
	throw new Error('Function not implemented.');
}

