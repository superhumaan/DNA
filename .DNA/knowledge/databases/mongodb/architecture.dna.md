# Architecture

App → mongos/replica set → collections  
Transactions only within documented limits; design for single-document atomicity first.
