import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Courses } from '../../../lib/collections.js';
import { Accounts } from 'meteor/accounts-base';

import '../../main.html';

Template.sideNavDropDown.onRendered(function () {
    this.$('.collapsible').collapsible();
});

Template.sideNavDropDown.helpers({

    courses: function (year) {
        //need to put all courses with the courseYear == year into object and return that
        let coursesWithSameYear = [];

        const teacherInfo = Courses.find({ ownerId: Meteor.userId() }, { _id: 0, ownerId: 0 });
        teacherInfo.forEach(
            function (doc) {
                let index = 0;
                for (var i = 0; i < doc.courses.length; i++) {
                    const entryYear = doc.courses[i].courseYear;
                    if (year == entryYear) {
                        coursesWithSameYear[index] = doc.courses[i];
                        index++;
                    }
                }
            });

        return coursesWithSameYear;
    },

    years: function () {
        //creates an array of courseYear objects, where each courseYear is a unique year from the collection
        //Ex: [{courseYear: "2017-2018"}, {courseYear: "2018-2019"}]

        let uniqueYears = [];
        const teacherInfo = Courses.find({ ownerId: Meteor.userId() }, { _id: 0, ownerId: 0 });
        teacherInfo.forEach(
            function (doc) {
                for (var i = 0; i < doc.courses.length; i++) {
                    const entryYear = doc.courses[i].courseYear;
                    let counter = 0;
                    let uniqueYear = true;
                    for (index = 0; index < uniqueYears.length; index++) {
                        if (entryYear == uniqueYears[index].courseYear) {
                            uniqueYear = false;
                            break;
                        }
                    }
                    if (uniqueYear) {
                        uniqueYears[uniqueYears.length] = { "courseYear": entryYear }
                    }
                }
            });

        return uniqueYears;
    },

});

Template.sideNavDropDown.events({
    //event allows the main page to change as you click the side bar
    'click .sections': function () {
        event.preventDefault();

        const target = event.target;
        var courseId = target.id;

        Session.set('courseIdDisplay', courseId);
        //Use Session.get('courseIdDisplay'); to grab the courseId from sessions
    },

    'click .course-dropdown': function () {
        var element = event.target.parentElement; //why do we need to access the parentElement??
        if (!element.classList.contains('active')) {
            var activeElement = document.getElementsByClassName('course-dropdown active blue lighten-2')[0];
            console.log(activeElement);
            if (activeElement != null) {
                activeElement.classList.remove("active");
                activeElement.classList.remove("blue");
                activeElement.classList.remove("lighten-2");
            }
            console.log(element);
            element.classList.add("active");
            element.classList.add("blue");
            element.classList.add("lighten-2");
        }
    }

});