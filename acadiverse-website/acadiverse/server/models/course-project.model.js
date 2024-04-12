const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for Acadiverse Course Creator projects; this is used to allow for collaboration (e.g. a teacher and their aide/IA can work on the same project together).
const CourseProject = mongoose.model("course_project", new Schema({
    name: { //The project's name.
      type: String,
      default: ""
    },
    description: { //The project's description.
      type: String,
      default: ""
    },
    tags: { //The tags used to refer to the project.
      type: [String],
      default: []
    },
    collaborators: [ //An array of users who have access to the project.
      {
        collaborator: { //The ID of the collaborator's account.
          type: mongoose.Schema.Types.ObjectId,
          default: null
        },
        is_owner: { //If true, the user is the owner of the project and has all permissions associated with it.
          type: Boolean,
          default: false
        }
      }   
    ],
    url: { //The URL where the project files are stored; this is used by Acadiverse Course Creator.
      type: String,
      default: ""
    }
  }))

module.exports = CourseProject;