"use strict";
const mongoose = require("mongoose");
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }

      const newIssue = new IssueModel({
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || "",
      });

      ProjectModel.findOne({ name: project }, (err, projectData) => {
        if (err) {
          res.send("Error finding project");
          return;
        }

        if (!projectData) {
          const newProject = new ProjectModel({
            name: project,
          });
          newProject.issues.push(newIssue);
          newProject.save((err, data) => {
            if (err || !data) {
              res.send("Error saving in post");
            } else {
              res.json(newIssue);
            }
          });
        } else {
          projectData.issues.push(newIssue);
          projectData.save((err, data) => {
            if (err || !data) {
              res.send("Error saving in post");
            } else {
              res.json(newIssue);
            }
          });
        }
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
