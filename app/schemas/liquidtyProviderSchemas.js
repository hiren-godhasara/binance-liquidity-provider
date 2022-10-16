const body = {
    type: 'object',
    properties: {
        symbol: { type: 'string' },
        askDifference: { type: 'number' },
        bidDifference: { type: 'number'  },
        askAmount: { type: 'number' },
        bidAmount: { type: 'number'}
    },
    required: ['symbol','askDifference','bidDifference','askAmount','bidAmount'],
    additionalProperties: false,
}


exports.postSchema = {
    description: 'This is an endpoint for to start Providing Liquidity.',
    tags: ['Liquidty Provider'],
    body: body,
};