import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Courses } from '../lib/collections.js';
import { Accounts } from 'meteor/accounts-base';

import './main.html';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

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

Template.sideNavDropDown.onRendered(function() {
  this.$('.collapsible').collapsible();
});

Template.sideNavDropDown.helpers({
  courses(){
    return Courses.find({});
  },

});

// Template.sideNavDropDown.events({
//   'click #sideNav-header': function(event) {
//     console.log(event)
//     var x = document.getElementById('sideNav-header').textContent;
//     const arrowDropDownText = "arrow_drop_down"; //this needs to be consistent with sideNav-template 

//     console.log(x);
//   }
// });

// Template.sideNavDropDown.onCreated(function() {
//   this.currentCourse = new ReactiveVar('');
// });

Template.tabsContent.onRendered(function() {
  this.$('.tabs').tabs();
});



Template.courseSettings.onRendered(function() {
  $(document).ready(function(){
    $('.modal').modal();
  });
});

Template.courseSettings.onCreated(function() {
  //need to find a way to update this variable or grab it and change it in the courseSettings.helpers 
  // function
  this.currentCourse = '*still need to add*';
});

Template.courseSettings.helpers({
  currentCourse() {
    return Template.instance().currentCourse;
  }

});

Template.courseSettings.events({
   'click #deleteCourseModalYes': function(event) {
        console.log(event);
        console.log(Template.instance().currentCourse)  
      }
});
