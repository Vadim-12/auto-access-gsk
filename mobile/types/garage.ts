export interface UpdateSettingsDto {
	ip: string;
	port?: number;
	streamPort?: number;
	snapshotPort?: number;
}

export interface Garage {
	id: string;
	name: string;
	address: string;
	cameraIp?: string;
	cameraPort?: number;
	gateIp?: string;
	gatePort?: number;
	createdAt: string;
	updatedAt: string;
}
