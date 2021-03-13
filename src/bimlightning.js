
function getModelBBox( bim ) {
	let overallMinX=null, overallMaxX=null, overallMinY=null, overallMaxY=null, overallMinZ=null, overallMaxZ=null;
	let minX, maxX, minY, maxY, minZ, maxZ;
	let numHandles = bim._handles.length;
	for( let h = 0 ; h < numHandles ; h++ ) {
		for( let elem in bim._handles[h]._model.productMap ) { 
			let bbox = bim._handles[h]._model.productMap[elem]['bBox'];
			if( bbox[0] < bbox[1] ) {
				minX = bbox[0]; maxX = bbox[1];
			}
			else {
				minX = bbox[1]; maxX = bbox[0];
			}
			if( bbox[2] < bbox[3] ) {
				minY = bbox[2]; maxY = bbox[3];
			}
			else {
				minY = bbox[3]; maxY = bbox[2];
			}
			if( bbox[4] < bbox[5] ) {
				minZ = bbox[4]; maxZ = bbox[5];
			}
			else {
				minZ = bbox[5]; maxZ = bbox[4];
			}
			if( overallMinX === null ) {
				overallMinX = minX; 
				overallMaxX = maxX;
				overallMinY = minY;
				overallMaxY = maxY;
				overallMinZ = minZ;
				overallMaxZ = maxZ;
			} else {
				if( minX < overallMinX ) { 
					overallMinX = minX; 
				}
				if( maxX > overallMaxX ) { 
					overallMaxX = maxX; 
				}
				if( minY < overallMinY ) { 
					overallMinY = minY; 
				}
				if( maxY > overallMaxY ) { 
					overallMaxY = maxY; 
				}
				if( minZ < overallMinZ ) { 
					overallMinZ = minZ; 
				}
				if( maxZ > overallMaxZ ) { 
					overallMaxZ = maxZ; 
				}
			}
		}
	}					
	return [ overallMinX, overallMaxX, overallMinY, overallMaxY, overallMinZ, overallMaxZ ];
}
