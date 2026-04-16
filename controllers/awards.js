const Award = require("../models/Award");

const queryCreator = require("../commonHelpers/queryCreator");
const _ = require("lodash");

exports.addAward = (req, res, next) => {
  const awardData = _.cloneDeep(req.body);
  awardData.user = req.user.id;
  const newAward = new Award(queryCreator(awardData));

  newAward
    .save()
    .then((award) => award.populate("user", "firstName lastName email avatarUrl"))
    .then((award) => res.json(award))
    .catch((err) =>
      res.status(400).json({
        message: `Error happened on server: "${err}" `,
      }),
    );
};

exports.updateAward = (req, res, next) => {
  Award.findOne({ _id: req.params.id })
    .then((award) => {
      if (!award) {
        return res.status(404).json({
          message: `Award with id "${req.params.id}" is not found.`,
        });
      }

      if (award.user && !(req.user.isAdmin || req.user.id === award.user.toString())) {
        return res.status(403).json({
          message: `You don't have permission to perform this action.`,
        });
      }

      const awardData = _.cloneDeep(req.body);
      const updatedAward = queryCreator(awardData);

      Award.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updatedAward },
        { returnDocument: 'after' },
      )
        .populate("user", "firstName lastName email avatarUrl")
        .then((award) => res.json(award))
        .catch((err) =>
          res.status(400).json({
            message: `Error happened on server: "${err}" `,
          }),
        );
    })
    .catch((err) =>
      res.status(400).json({
        message: `Error happened on server: "${err}" `,
      }),
    );
};

exports.deleteAward = (req, res, next) => {
  Award.findOne({ _id: req.params.id }).then(async (award) => {
    if (!award) {
      return res.status(404).json({
        message: `Award with id "${req.params.id}" is not found.`,
      });
    }

    if (award.user && !(req.user.isAdmin || req.user.id === award.user.toString())) {
      return res.status(403).json({
        message: `You don't have permission to perform this action.`,
      });
    }

    Award.deleteOne({ _id: req.params.id })
      .then((deletedCount) =>
        res.status(200).json({
          message: `Award is successfully deleted from DB.`,
        }),
      )
      .catch((err) =>
        res.status(400).json({
          message: `Error happened on server: "${err}" `,
        }),
      );
  });
};

exports.getAwards = (req, res, next) => {
  const perPage = Number(req.query.perPage) || 0;
  const startPage = Number(req.query.startPage) || 1;
  const sort = req.query.sort || "-date";

  let query = Award.find()
    .populate("user", "firstName lastName email avatarUrl")
    .sort(sort);

  if (perPage > 0) {
    query = query.skip(startPage * perPage - perPage).limit(perPage);
  }

  query
    .then((awards) => res.json(awards))
    .catch((err) =>
      res.status(400).json({
        message: `Error happened on server: "${err}" `,
      }),
    );
};

exports.getAwardById = (req, res, next) => {
  Award.findOne({
    _id: req.params.id,
  })
    .populate("user", "firstName lastName email avatarUrl")
    .then((award) => {
      if (!award) {
        res.status(404).json({
          message: `Award with id "${req.params.id}" is not found.`,
        });
      } else {
        res.json(award);
      }
    })
    .catch((err) =>
      res.status(400).json({
        message: `Error happened on server: "${err}" `,
      }),
    );
};
