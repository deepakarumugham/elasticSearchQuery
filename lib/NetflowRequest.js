function NetflowRequest(tenantId, srcGrp, destGrp, startOffset,
	endOffset, startTime, endTime){
	this.tenantId = tenantId;
	this.srcGrp = srcGrp;
	this.destGrp = destGrp;
	this.startOffset = startOffset;
	this.endOffset = endOffset;
	this.startTime = startTime;
	this.endTime = endTime;
}
module.exports = NetflowRequest;