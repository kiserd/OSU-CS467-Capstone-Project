const dao = require('../backend/dao');

test('tries to delete doc with invalid id', async () => {
    const coll = 'users';
    const id = 'invalid id';
    const result = await dao.deleteDoc(coll, id);
    expect(result).toBe(-1);
});