const body={
    type: 'object',
    properties: {
        symbol: { type: 'string' },
        askDifference:{ type: 'number',minimum:0},
        bidDifference:{ type: 'number',minimum:0},
        amount:{type:'number',minimum:0}
    },
    required: [],
    additionalProperties: false,
}


exports.postSchema = {
    description: 'This is an endpoint for to start Providing Liquidity.',
    tags: ['liquidty Provider'],
    body:body,
};