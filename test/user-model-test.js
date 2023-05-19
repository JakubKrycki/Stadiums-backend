import chai, { assert } from "chai";

import chp from "chai-as-promised";
import { db } from "../src/models/db.js";
import { maggie, testUsers } from "./fixtures.js";

chai.use(chp);

suite("User API tests", () => {

    setup(async () => {
        db.init();
        await db.userStore.deleteAll();
    });
    

    test("create a user - success", async () => {
        const newUser = await db.userStore.addUser(maggie);
        assert.deepEqual(maggie, newUser);
    });

    test("create a user - failure - user with this email exists", async () => {
        const newUser = await db.userStore.addUser(maggie);
        assert.deepEqual(maggie, newUser);
        assert.isRejected(db.userStore.addUser(maggie), Error, "User with this email already exists");
    });

    test("get a user - success", async () => {
        const user = await db.userStore.addUser(maggie);
        const returnedUser1 = await db.userStore.getUserById(user._id);
        assert.deepEqual(user, returnedUser1);
        const returnedUser2 = await db.userStore.getUserByEmail(user.email);
        assert.deepEqual(user, returnedUser2);
    });

    test("get a user - failure", async () => {
        const noUserWithId = await db.userStore.getUserById("123");
        assert.isNull(noUserWithId);
        const noUserWithEmail = await db.userStore.getUserByEmail("no@one.com");
        assert.isNull(noUserWithEmail);
    });
    
    test("get a user - bad params", async () => {
        let nullUser = await db.userStore.getUserByEmail("");
        assert.isNull(nullUser);
        nullUser = await db.userStore.getUserById("");
        assert.isNull(nullUser);
        nullUser = await db.userStore.getUserById();
        assert.isNull(nullUser);
    });    

    test("delete One User - success", async () => {
        for (let i = 0; i < testUsers.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            testUsers[i] = await db.userStore.addUser(testUsers[i]);
        }
        await db.userStore.deleteUserById(testUsers[0]._id);
        const returnedUsers = await db.userStore.getAllUsers();
        assert.equal(returnedUsers.length, testUsers.length - 1);
        const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
        assert.isNull(deletedUser);
    });
    
    test("delete One User - failure - bad id", async () => {
        for (let i = 0; i < testUsers.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await db.userStore.addUser(testUsers[i]);
        }
        await db.userStore.deleteUserById("bad-id");
        const allUsers = await db.userStore.getAllUsers();
        assert.equal(testUsers.length, allUsers.length);
    });
    
    test("delete all users", async () => {
        for (let i = 0; i < testUsers.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await db.userStore.addUser(testUsers[i]);
        }
        let returnedUsers = await db.userStore.getAllUsers();
        assert.equal(returnedUsers.length, 3);
        await db.userStore.deleteAll();
        returnedUsers = await db.userStore.getAllUsers();
        assert.equal(returnedUsers.length, 0);
    });
});
