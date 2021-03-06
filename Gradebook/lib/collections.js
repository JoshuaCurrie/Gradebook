import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from 'meteor/check';

//don't forget to remove insecure and then add methods --> meteor remove insecure
export const Courses = new Mongo.Collection("courses");
export const CourseWeighting = new Mongo.Collection("courseWeighting");

//define our methods

Meteor.methods({
    'courses.createFirstCourse'(course, year) {
        Courses.insert({
            ownerId: Meteor.userId(),
            courses: [
                { courseId: 1, courseName: course, courseYear: year }
            ]
        });
        CourseWeighting.insert({
            ownerId: Meteor.userId(),
            courseId: 1,
            categoryWeighting: { K: 25, A: 25, T: 25, C: 25 },
            courseworkWeight: 70,
            finalWeight: 30,
            courseworkAssessmentTypes: [
                { assessmentType: "Quiz", assessmentWeight: 10 },
                { assessmentType: "Assignment", assessmentWeight: 25 },
                { assessmentType: "Test", assessmentWeight: 35 }
            ],
            finalAssessmentTypes: [
                { assessmentType: "Culminating Task", assessmentWeight: 15 },
                { assessmentType: "Final Exam", assessmentWeight: 15 }
            ]
        });

    },
    'courses.addNewCourse'(currentCourses) { //add new course
        Courses.update(
            { "ownerId": Meteor.userId() },
            {
                $set:
                    { "courses": currentCourses }
            }
        );
    },
    'courses.updateCourseNameAndYear'(currentCourseId, courseObj) {
        Courses.update(
            { "ownerId": Meteor.userId() },
            {
                $set:
                    { "courses": courseObj }
            }
        );
    },
    'courses.deleteCourse'(currentCourseId, courseObj) {
        Courses.update(
            { "ownerId": Meteor.userId() },
            {
                $set:
                    { "courses": courseObj }
            }
        );
        //remove from courseWeightings DB
        var courses = Courses.findOne({"ownerId": Meteor.userId() }).courses;
        if (courses.length == 0) {
            Courses.remove( { "ownerId": Meteor.userId() } );
        }
        CourseWeighting.remove( { "ownerId": Meteor.userId(), "courseId": currentCourseId});
    },
    'courseInformation.defaultSettings'(newCourseId) {
        CourseWeighting.insert({
            ownerId: Meteor.userId(),
            courseId: newCourseId,
            categoryWeighting: { K: 25, A: 25, T: 25, C: 25 },
            courseworkWeight: 70,
            finalWeight: 30,
            courseworkAssessmentTypes: [
                { assessmentType: "Quiz", assessmentWeight: 10 },
                { assessmentType: "Assignment", assessmentWeight: 25 },
                { assessmentType: "Test", assessmentWeight: 35 }
            ],
            finalAssessmentTypes: [
                { assessmentType: "Culminating Task", assessmentWeight: 15 },
                { assessmentType: "Final Exam", assessmentWeight: 15 }
            ]
        });
    },
    'courseInformation.updateCategories'(currentCourseId, newCategoryWeighting){
        CourseWeighting.update(
            { "ownerId": Meteor.userId(), courseId: currentCourseId },
            {
                $set:
                    { "categoryWeighting": newCategoryWeighting }
            }
        );
    },
    
});
