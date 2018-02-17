import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Courses } from '../../../lib/collections.js';
import { Accounts } from 'meteor/accounts-base';

import '../../main.html';

Template.courseTabs.helpers({
    courseSelected: function () {
      let courseId = Session.get('courseId');
      return courseId != 0;
    },

    hasCourse: function() {
      var courses = Courses.findOne({ownerId: Meteor.userId()});
      if (courses.courses) {
        return courses.courses.length != 0
      } 
      else {
        return false;
      }
    },
  });
  