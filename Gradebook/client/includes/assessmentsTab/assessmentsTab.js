import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Courses } from '../../../lib/collections.js';
import { Accounts } from 'meteor/accounts-base';
import { CourseWeighting } from '../../../lib/collections.js';

import '../../main.html';

function doneEditing(){
    let editButtonElement = document.getElementById("edit-button");
    let saveButtonElement = document.getElementById("save-button");
    let cancelButtonElement = document.getElementById("cancel-button");

    editButtonElement.classList.remove("hide");
    saveButtonElement.classList.add("hide");
    cancelButtonElement.classList.add("hide");

    let currentCourseId = Session.get('courseId');
    const courseworkAssessmentTypes = CourseWeighting.findOne({ownerId: Meteor.userId(), courseId: currentCourseId}).courseworkAssessmentTypes;
    const finalAssessmentTypes = CourseWeighting.findOne({ownerId: Meteor.userId(), courseId: currentCourseId}).finalAssessmentTypes;

    for(i=0; i<courseworkAssessmentTypes.length; i++){
        let id = "assessmentTypeWeightCourse" + Number(i+1);
        let assessmentTypeWeightCourse = document.getElementById(id);
        assessmentTypeWeightCourse.disabled = true;
    };

    for(i=0; i<finalAssessmentTypes.length; i++){
        let id = "assessmentTypeWeightFinal" + Number(i+1);
        let assessmentTypeWeightFinal = document.getElementById(id);
        assessmentTypeWeightFinal.disabled = true;
    };

    //hide coursework Delete Icons
    for(i=0; i<courseworkAssessmentTypes.length; i++){
        let id = "delete-icon-coursework" + Number(i+1);
        let deleteIcon = document.getElementById(id);
        deleteIcon.classList.add('hide');
    };

    //hide final Delete icons
    for(i=0; i<finalAssessmentTypes.length; i++){
        let id = "delete-icon-final" + Number(i+1);
        let deleteIcon = document.getElementById(id);
        deleteIcon.classList.add('hide');
    };

    let courseWeight = document.getElementById('assessments-courseWorkWeight');
    let finalWeight = document.getElementById('assessments-finalWeight');

    courseWeight.disabled = true;
    finalWeight.disabled = true;
}

Template.assessmentsTab.helpers({
    courseAssessmentTypes: function(){
        let currentCourseId = Session.get('courseId');
        const courseworkAssessmentTypes = CourseWeighting.findOne({ownerId: Meteor.userId(), courseId: currentCourseId}).courseworkAssessmentTypes;
        return courseworkAssessmentTypes
    },

    finalAssessmentTypes: function(){
        let currentCourseId = Session.get('courseId');
        const finalAssessmentTypes = CourseWeighting.findOne({ownerId: Meteor.userId(), courseId: currentCourseId}).finalAssessmentTypes;
        return finalAssessmentTypes
    },
    courseWorkWeight: function(){
        let currentCourseId = Session.get('courseId');
        const currentCourseWorkWeight = CourseWeighting.findOne({ownerId: Meteor.userId(), courseId: currentCourseId}).courseworkWeight;
        return currentCourseWorkWeight;
    },
    finalWeight: function(){
        let currentCourseId = Session.get('courseId');
        const currentFinalWeight = CourseWeighting.findOne({ownerId: Meteor.userId(), courseId: currentCourseId}).finalWeight;
        return currentFinalWeight;
    },
});

Template.assessmentsTab.onRendered(function() {
    $(document).ready(function () {
        $('.collapsible').collapsible();
    });
});

Template.assessmentsTab.events({
    'click .delete-courseworkAssessmentType': function(){
        target = event.target;
        assessmentTypeId = target.parentElement.id;
        assessmentTypeName = target.parentElement.name;

        let sessionObject = {
            type:'courseworkAssessmentTypes', 
            assessmentTypeName: assessmentTypeName, 
            assessmentTypeId: assessmentTypeId
        };

        Session.set('selectedAssessmentType', sessionObject);
    },

    'click .delete-finalAssessmentType': function(){
        target = event.target;
        assessmentTypeId = target.parentElement.id;
        assessmentTypeName = target.parentElement.name;

        let sessionObject = {
            type:'finalAssessmentTypes', 
            assessmentTypeName: assessmentTypeName, 
            assessmentTypeId: assessmentTypeId
        };

        Session.set('selectedAssessmentType', sessionObject);
    },

    'click .edit-button':function(){ //include the fields to modify the courseWeight and finalWeight
        let editButtonElement = document.getElementById("edit-button");
        let saveButtonElement = document.getElementById("save-button");
        let cancelButtonElement = document.getElementById("cancel-button");

        editButtonElement.classList.add("hide");
        saveButtonElement.classList.remove("hide");
        cancelButtonElement.classList.remove("hide");

        let currentCourseId = Session.get('courseId');
        const courseworkAssessmentTypes = CourseWeighting.findOne({ownerId: Meteor.userId(), courseId: currentCourseId}).courseworkAssessmentTypes;
        const finalAssessmentTypes = CourseWeighting.findOne({ownerId: Meteor.userId(), courseId: currentCourseId}).finalAssessmentTypes;

        //show coursework Delete Icons
        for(i=0; i<courseworkAssessmentTypes.length; i++){
            let id = "delete-icon-coursework" + Number(i+1);
            let deleteIcon = document.getElementById(id);
            deleteIcon.classList.remove('hide');
        };

        //show final Delete icons
        for(i=0; i<finalAssessmentTypes.length; i++){
            let id = "delete-icon-final" + Number(i+1);
            let deleteIcon = document.getElementById(id);
            deleteIcon.classList.remove('hide');
        };

        //coursework Assessment type weights remove disabled
        for(i=0; i<courseworkAssessmentTypes.length; i++){
            let id = "assessmentTypeWeightCourse" + Number(i+1);
            let assessmentTypeWeightCourse = document.getElementById(id);
            assessmentTypeWeightCourse.removeAttribute('disabled');
        };

        //final assessment type weights remove disabled
        for(i=0; i<finalAssessmentTypes.length; i++){
            let id = "assessmentTypeWeightFinal" + Number(i+1);
            let assessmentTypeWeightFinal = document.getElementById(id);
            assessmentTypeWeightFinal.removeAttribute('disabled');
        }

        let courseWeight = document.getElementById('assessments-courseWorkWeight');
        let finalWeight = document.getElementById('assessments-finalWeight');

        finalWeight.removeAttribute('disabled');
        courseWeight.removeAttribute('disabled');
    },

    'click .cancel-button':function(){
        doneEditing();
        //include the fields to modify the courseWeight and finalWeight
    },

    'submit .assessmentsTabForm':function(){
        const currentCourseId = Session.get('courseId');
        const target = event.target;

        const courseworkAssessmentTypes = CourseWeighting.findOne({ownerId: Meteor.userId(), courseId: currentCourseId}).courseworkAssessmentTypes;
        const finalAssessmentTypes = CourseWeighting.findOne({ownerId: Meteor.userId(), courseId: currentCourseId}).finalAssessmentTypes;

        //assessmentTypeWeightCourse
        let newcourseworkAssessmentTypes = [];
        let courseWorkWeightTotal = 0;
        let newCourseWorkWeight = Number(document.getElementById("assessments-courseWorkWeight").value);
        //console.log("newCourseWorkWeight: " + newCourseWorkWeight);

        for(i = 0; i < courseworkAssessmentTypes.length; i++){
            let currentId = "assessmentTypeWeightCourse" + Number(i+1);
            let courseAssessmentTypeWeight = Number(document.getElementById(currentId).value);
            let courseAssessmentTypeName = document.getElementById(currentId).name;
            courseWorkWeightTotal = courseWorkWeightTotal + courseAssessmentTypeWeight;
            let courseAssessmentTypeObject = {assessmentType: courseAssessmentTypeName, assessmentWeight: courseAssessmentTypeWeight, assessmentTypeId: Number(i+1)};
            newcourseworkAssessmentTypes[newcourseworkAssessmentTypes.length] = courseAssessmentTypeObject;
        };

        //assessmentTypeWeightFinal
        let newfinalAssessmentTypes = [];
        let finalWeightTotal = 0;
        let newFinalWeight = Number(document.getElementById("assessments-finalWeight").value);
        //console.log("newFinalWeight: " + newFinalWeight);

        for(i = 0; i < finalAssessmentTypes.length; i++){
            let currentId = "assessmentTypeWeightFinal" + Number(i+1);
            let finalAssessmentTypeWeight = Number(document.getElementById(currentId).value);
            let finalAssessmentTypeName = document.getElementById(currentId).name;
            finalWeightTotal = finalWeightTotal + finalAssessmentTypeWeight;
            let finalAssessmentTypeObject = {assessmentType: finalAssessmentTypeName, assessmentWeight: finalAssessmentTypeWeight, assessmentTypeId: Number(i+1)};
            newfinalAssessmentTypes[newfinalAssessmentTypes.length] = finalAssessmentTypeObject;
        };
        //console.log(newfinalAssessmentTypes);

        //run a check that the courseworkweights add up to courseworkWeight
        if (newCourseWorkWeight + newFinalWeight != 100){
            console.log("Course Weight + Final Weight must add up to 100! They currently add to " + (newCourseWorkWeight + newFinalWeight))
        }
        //run a check that courseWeights add up to newCourseWeight
        else if (courseWorkWeightTotal != newCourseWorkWeight){
            console.log("Your coursework Weights should add up to " + newCourseWorkWeight + ". They currently add up to " + courseWorkWeightTotal)
            

        }
        //run a check that finalWeights add up to newFinalWeight
        else if (finalWeightTotal != newFinalWeight){
            console.log("Your final evaluation weights should add up to " + newFinalWeight + ". They currently add up to " + finalWeightTotal)

        }
        else{
            //update assessmentTypeWeights
            Meteor.call('courseInformation.addNewCourseWork', currentCourseId, newcourseworkAssessmentTypes);
            Meteor.call('courseInformation.addNewFinalWork', currentCourseId, newfinalAssessmentTypes);
            //update courseWeight and finalWeight
            Meteor.call('courseInformation.updateCourseworkWeight', currentCourseId, newCourseWorkWeight)
            Meteor.call('courseInformation.updateFinalWeight', currentCourseId, newFinalWeight)

            //doneEditing
            doneEditing();
        }
    }
});

//assessments-courseWorkWeight -> CourseWork % weight 
//still need types of course work