import chai, { assert } from "chai";

import chp from "chai-as-promised";
import { db } from "../src/models/db.js";
import { campNou, etihadStadium, stamfordBridge, testPlacemarks } from "./fixtures.js";

chai.use(chp);

suite("Placemark API tests", () => {

    setup(async () => {
        db.init();
        await db.placemarkStore.deleteAllPlacemarks();
    });
    

    test("create a placemark - success", async () => {
        const newPlacemark = await db.placemarkStore.addPlacemark(stamfordBridge);
        assert.deepEqual(stamfordBridge, newPlacemark);
    });

    test("create a placemark - failure - duplicate", async () => {
        const newPlacemark = await db.placemarkStore.addPlacemark(stamfordBridge);
        assert.deepEqual(stamfordBridge, newPlacemark);
        assert.isRejected(db.placemarkStore.addPlacemark(stamfordBridge), Error, "Placemark with this name already exists");
    });

    test("get a placemark by id and name - success", async () => {
        const placemark = await db.placemarkStore.addPlacemark(stamfordBridge);
        const returnedPlacemark1 = await db.placemarkStore.getPlacemarkById(placemark._id);
        assert.deepEqual(placemark, returnedPlacemark1);
        const returnedPlacemark2 = await db.placemarkStore.getPlacemarkByName(placemark.name);
        assert.deepEqual(placemark, returnedPlacemark2);
    });

    test("get a placemark by id and name - failure - no such a placemark", async () => {
        const noPlacemarkWithId = await db.placemarkStore.getPlacemarkById("123");
        assert.isNull(noPlacemarkWithId);
        const noPlacemarkWithName = await db.placemarkStore.getPlacemarkByName("name");
        assert.isNull(noPlacemarkWithName);
    });

    test("get a placemark by id and name - failure - bad parameters", async () => {
        let noPlacemarkWithId = await db.placemarkStore.getPlacemarkById("");
        assert.isNull(noPlacemarkWithId);
        noPlacemarkWithId = await db.placemarkStore.getPlacemarkById();
        assert.isNull(noPlacemarkWithId);
        noPlacemarkWithId = await db.placemarkStore.getPlacemarkByName("");
        assert.isNull(noPlacemarkWithId);
    });

    test("get a placemark by name and user id - success", async () => {
        const placemark = await db.placemarkStore.addPlacemark(stamfordBridge);
        const returnedPlacemark = await db.placemarkStore.getPlacemarkByNameAndUser(stamfordBridge.name, stamfordBridge.added_by);
        assert.deepEqual(returnedPlacemark, placemark);
    });

    test("get a placemark by name and user id - failure - bad user id", async () => {
        await db.placemarkStore.addPlacemark(stamfordBridge);
        const noPlacemark = await db.placemarkStore.getPlacemarkByNameAndUser(stamfordBridge.name, "bad-id");
        assert.isNull(noPlacemark);
    });

    test("get a placemark by name and user id - failure - bad placemark name", async () => {
        await db.placemarkStore.addPlacemark(stamfordBridge);
        const noPlacemark = await db.placemarkStore.getPlacemarkByNameAndUser("bad name", stamfordBridge.added_by);
        assert.isNull(noPlacemark);
    });

    test("get a placemark by name and user id - failure - bad placemark name and user id", async () => {
        await db.placemarkStore.addPlacemark(stamfordBridge);
        const noPlacemark = await db.placemarkStore.getPlacemarkByNameAndUser("bad name", "bad-id");
        assert.isNull(noPlacemark);
    });

    test("get all placemarks - success", async () => {
        for (let i = 0; i < testPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await db.placemarkStore.addPlacemark(testPlacemarks[i]);
        }
        const returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
        assert.equal(returnedPlacemarks.length, testPlacemarks.length);
    });

    test("get all placemarks visible for user - success", async () => {
        for (let i = 0; i < testPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await db.placemarkStore.addPlacemark(testPlacemarks[i]);
        }
        const returnedPlacemarks = await db.placemarkStore.getAllPlacemarksVisibleForUser("1");
        assert.equal(returnedPlacemarks.length, 3);
    });

    test("get all placemarks created by user - success", async () => {
        for (let i = 0; i < testPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await db.placemarkStore.addPlacemark(testPlacemarks[i]);
        }
        const returnedPlacemarks = await db.placemarkStore.getAllPlacemarksByUser("1");
        assert.equal(returnedPlacemarks.length, 2);
    });

    test("get all placemarks from category visible by user - success", async () => {
        for (let i = 0; i < testPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await db.placemarkStore.addPlacemark(testPlacemarks[i]);
        }
        const returnedPlacemarks = await db.placemarkStore.getVisiblePlacemarksByCategory("1", "England");
        assert.equal(returnedPlacemarks.length, 1);
        assert.equal(returnedPlacemarks[0].name, stamfordBridge.name);
    });

    test("delete a placemark - success", async () => {
        for (let i = 0; i < testPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await db.placemarkStore.addPlacemark(testPlacemarks[i]);
        }
        await db.placemarkStore.deletePlacemarkById(testPlacemarks[0]._id);
        const returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
        assert.equal(returnedPlacemarks.length, testPlacemarks.length - 1);
        const deletedPlacemark = await db.placemarkStore.getPlacemarkById(testPlacemarks[0]._id);
        assert.isNull(deletedPlacemark);
    });

    test("delete a placemark - failure - bad id", async () => {
        for (let i = 0; i < testPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await db.placemarkStore.addPlacemark(testPlacemarks[i]);
        }
        await db.placemarkStore.deletePlacemarkById("bad-id");
        const returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
        assert.equal(returnedPlacemarks.length, testPlacemarks.length);
    });

    test("delete all placemarks", async () => {
        for (let i = 0; i < testPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await db.placemarkStore.addPlacemark(testPlacemarks[i]);
        }
        let returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
        assert.equal(returnedPlacemarks.length, testPlacemarks.length);
        await db.placemarkStore.deleteAllPlacemarks();
        returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
        assert.equal(returnedPlacemarks.length, 0);
    });

    test("is placemark visible for user - true - his own placemark", async () => {
        const placemark = await db.placemarkStore.addPlacemark(stamfordBridge);
        const isVisible = db.placemarkStore.isPlacemarkVisibleForUser(placemark, stamfordBridge.added_by);
        assert.isTrue(isVisible);
    });

    test("is placemark visible for user - true - public placemark", async () => {
        const placemark = await db.placemarkStore.addPlacemark(campNou);
        const isVisible = db.placemarkStore.isPlacemarkVisibleForUser(placemark, stamfordBridge.added_by);
        assert.isTrue(isVisible);
    });

    test("is placemark visible for user - false - private placemark", async () => {
        const placemark = await db.placemarkStore.addPlacemark(etihadStadium);
        const isVisible = db.placemarkStore.isPlacemarkVisibleForUser(placemark, stamfordBridge.added_by);
        assert.isFalse(isVisible);
    });
});
