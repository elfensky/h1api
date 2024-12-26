# TODO

GET /v1/timestamps
GET /v1/campaigns
GET /v1/defend
GET /v1/attack
GET /v1/statistics

-> /users?cursor={timestamp}&limit=10
-> get a (cursor based) list of all timestamps

POST /v1/campaign
{ id: <id> }
{ timestamp: <timestamp> }
-> get campaign data for a specific timestamp
