function permittedFields(Model) {
  return Object.keys(Model.schema.paths).filter(
    (field) => !["_id", "__v", "owner", "createdAt", "updatedAt", "reviewedBy", "reviewedAt"].includes(field),
  );
}

function pickFields(Model, body = {}) {
  const values = body && typeof body === "object" && !Array.isArray(body) ? body : {};
  return Object.fromEntries(
    permittedFields(Model)
      .filter((field) => Object.hasOwn(values, field))
      .map((field) => [field, values[field]]),
  );
}

function createResourceController(Model) {
  return {
    async list(req, res, next) {
      try {
        const records = await Model.find({ owner: req.user.id }).sort({ createdAt: -1 }).limit(200);
        res.json({ items: records });
      } catch (error) {
        next(error);
      }
    },

    async create(req, res, next) {
      try {
        const values = pickFields(Model, req.body);
        if (Model.modelName === "Leave") values.status = "pending";
        const item = await Model.create({ ...values, owner: req.user.id });
        res.status(201).json({ item });
      } catch (error) {
        next(error);
      }
    },

    async update(req, res, next) {
      try {
        const updates = pickFields(Model, req.body);
        if (Model.modelName === "Leave") delete updates.status;
        const item = await Model.findOneAndUpdate(
          { _id: req.params.id, owner: req.user.id },
          { $set: updates },
          { new: true, runValidators: true },
        );

        if (!item) {
          return res.status(404).json({ message: "Record not found" });
        }

        res.json({ item });
      } catch (error) {
        next(error);
      }
    },

    async remove(req, res, next) {
      try {
        const item = await Model.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

        if (!item) {
          return res.status(404).json({ message: "Record not found" });
        }

        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  };
}

module.exports = createResourceController;