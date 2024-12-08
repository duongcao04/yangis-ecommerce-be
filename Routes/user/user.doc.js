const users = []

const userRouteDoc = {
    get: {
        tags: ['User'],
        description: 'Get all users',
        responses: {
            200: {
                status: 200,
                message: 'Get all users successfully',
                data: users,
            },
        },
    },
}

module.exports = userRouteDoc
