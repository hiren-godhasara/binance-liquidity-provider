const body = {
    type: 'object',
    properties: {
        symbol: { type: 'string',default: "BTCUSDT",},
        askDifference: { type: 'number',default: 10 },
        bidDifference: { type: 'number',default: 10  },
        askAmount: { type: 'number',default: 0.001 },
        bidAmount: { type: 'number',default: 0.001}
    },
    required: ['symbol','askDifference','bidDifference','askAmount','bidAmount'],
    additionalProperties: false,
}


exports.postSchema = {
    description: 'This is an endpoint for to start Providing Liquidity.',
    tags: ['Liquidty Provider'],
    body: body,
};