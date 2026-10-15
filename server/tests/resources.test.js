const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const test = require("node:test");

const createResourceController = require("../controllers/resourceController");
const resources = require("../models/resources");

function responseStub() {
  return {
    code: 200,
    body: undefined,
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
}

test("resource create always assigns the authenticated owner", async () => {
  let saved;
  const model = {
    modelName: "Goal",
    schema: { paths: { title: {}, owner: {}, status: {} } },
    create: async (values) => { saved = values; return values; },
  };
  const response = responseStub();
  const controller = createResourceController(model);

  await controller.create({ user: { id: "student-a" }, body: { title: "Read", owner: "student-b" } }, response, assert.fail);

  assert.equal(response.code, 201);
  assert.equal(saved.owner, "student-a");
  assert.equal(saved.title, "Read");
});

test("resource updates scope by both record id and authenticated owner", async () => {
  let query;
  const model = {
    modelName: "Task",
    schema: { paths: { title: {}, owner: {}, status: {} } },
    findOneAndUpdate: async (filter) => { query = filter; return { _id: "task-1", title: "Updated" }; },
  };
  const response = responseStub();
  const controller = createResourceController(model);

  await controller.update({ user: { id: "student-a" }, params: { id: "task-1" }, body: { title: "Updated", owner: "student-b" } }, response, assert.fail);

  assert.deepEqual(query, { _id: "task-1", owner: "student-a" });
  assert.equal(response.body.item.title, "Updated");
});

test("students cannot set leave status during create or update", async () => {
  let saved;
  let updates;
  const model = {
    modelName: "Leave",
    schema: { paths: { reason: {}, status: {}, owner: {} } },
    create: async (values) => { saved = values; return values; },
    findOneAndUpdate: async (_filter, update) => { updates = update.$set; return { _id: "leave-1" }; },
  };
  const controller = createResourceController(model);
  const createResponse = responseStub();
  await controller.create({ user: { id: "student-a" }, body: { reason: "Exam", status: "approved" } }, createResponse, assert.fail);
  const updateResponse = responseStub();
  await controller.update({ user: { id: "student-a" }, params: { id: "leave-1" }, body: { status: "approved", reason: "Updated" } }, updateResponse, assert.fail);

  assert.equal(saved.status, "pending");
  assert.deepEqual(updates, { reason: "Updated" });
});

test("leave dates must be in chronological order", async () => {
  const request = new resources.leave({
    owner: new mongoose.Types.ObjectId(),
    startDate: "2026-10-20",
    endDate: "2026-10-19",
    reason: "Exam",
  });

  await assert.rejects(request.validate(), (error) => Boolean(error.errors.endDate));
});