import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Courses } from '../../../lib/collections.js';
import { Accounts } from 'meteor/accounts-base';
import { CourseWeighting } from '../../../lib/collections.js';

import '../../main.html';


Template.addAssessmentType.events({
    //type of event is a submit, the element is a form with class add-form, when its called run a function
    'submit .add-final-form': function () {

        const newAssessment = document.getElementById('add-final-type').value;
        const currentCourseId = Session.get('courseId');

        let courseInfo = CourseWeighting.findOne( 
            { ownerId: Meteor.userId(), courseId: currentCourseId} );
        let finalAssessmentTypes = courseInfo.finalAssessmentTypes;
        
        const courseWorkLength = finalAssessmentTypes.length;
        const newAssessmentTypeId = finalAssessmentTypes[courseWorkLength - 1].assessmentTypeId;

        const newAssessmentType = {
            assessmentType: newAssessment,
            assessmentWeight: 0,
            assessmentTypeId: newAssessmentTypeId + 1
        };

        finalAssessmentTypes.push(newAssessmentType);

        Meteor.call('courseInformation.addNewFinalWork', currentCourseId, finalAssessmentTypes);
    },
    'submit .add-coursework-form': function () {

        const newAssessment = document.getElementById('add-coursework-type').value;
        const currentCourseId = Session.get('courseId');

        let courseInfo = CourseWeighting.findOne( 
            { ownerId: Meteor.userId(), courseId: currentCourseId} );
        let courseWorkAssessmentType = courseInfo.courseworkAssessmentTypes;
        
        const courseWorkLength = courseWorkAssessmentType.length;
        const newAssessmentTypeId = courseWorkAssessmentType[courseWorkLength - 1].assessmentTypeId;

        const newAssessmentType = {
            assessmentType: newAssessment,
            assessmentWeight: 0,
            assessmentTypeId: newAssessmentTypeId + 1
        };

        courseWorkAssessmentType.push(newAssessmentType);

        Meteor.call('courseInformation.addNewCourseWork', currentCourseId, courseWorkAssessmentType);
    }
});