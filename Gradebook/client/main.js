import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Courses } from '../lib/collections.js';
import { Accounts } from 'meteor/accounts-base';

import './main.html';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

function coursesCursor(){
  return Courses.find();
}

Template.dropdown.helpers({
  // courses:[
  //   {course: "Math"},
  //   {course: "Science"},
  //   {course: "History"}
  // ],

  courses(){
    return Courses.find({});
  },

});

Template.addCourse.events({
  //type of event is a submit, the element is a form with class add-form, when its called run a function
  'submit .add-form': function(){
    //prevent from being submitted into another file
    event.preventDefault();

    //Get input value
    const target = event.target;
    const course = target.courseName.value;
    const year = target.courseYear.value;
    console.log(year);

    //insert course and year into collection Courses
    Courses.insert({
      course,
      year,
      owner: Meteor.userId(),
    });

    //Clear form
    target.courseName.value="";
    target.courseYear.value="";

    //Close Modal
    $('#addModal').modal('close');
  }

});

Template.dropdown.onRendered(function(){
  this.autorun(function(){
    var coursesCount = coursesCursor().count();
    console.log(coursesCount);
    Tracker.afterFlush(function(){
      this.$(".collapsible").collapsible({
        accordion: false
      });
    }.bind(this));
  }.bind(this));
});

//Template.removeCourse.events({

//});