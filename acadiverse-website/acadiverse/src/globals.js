const Globals = {
    API_URL: "http://localhost:4000/api",
    DOMAIN: "http://localhost:3000",
    APPEAL_URL: "http://localhost:3000/account/appeal",
    MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], //An array of the months of the year.
    ACCOUNT_ID: "625819057a702a31ecf1c6c4", //The ID of the "Acadiverse" account that is used to send automated PMs as well as for infrations automatically given under certain circumstances (such as receiving warnings).
    REP_COMMENTS: 50, //Required Reputation Points for leaving comments.
    REP_PUBLISHING: 100, //Required Reputation Points for publishing.
    REP_COURSE_REWARDS: 250, //Required Reputation Points for being able to reward students with Store items for completing a course.
    REP_INDEX: 500, //Required Reputation Points for having one's content indexed by search engines.
    REP_MODERATOR_APPLICATION: 5000, //Required Reputation Points for applying to become an Acadiverse moderator.
    REP_GAIN_QUIZ: 5, //Reputation Points gained for getting at least a 75% on a quiz.
    REP_GAIN_QUIZ_B: 10, //Reputation Points gained for getting a "B" (at least 80%) on a quiz.
    REP_GAIN_QUIZ_ACED: 15, //Reputation Points for getting an "A" (at least 90%) on a quiz.
    REP_GAIN_FAVORITED: 25, //Reputation Points gained for having a submission favorited.
    REP_GAIN_COURSE_COMPLETED: 50, //Reputation Points gained for completing a course.
    REP_GAIN_SUBSCRIBED: 100, //Reputation Points gained for each month of having an Acadiverse subscription.
    REP_GAIN_FEATURED: 250, //Reputation Points gained for having a submission featured.
    REP_GAIN_ANNIVERSARY: 500, //Reputation Points gained each year on the anniversary of creating one's Acadiverse account.
    REP_LOSS_FILTER: -50, //Reputation Points lost ("gaining" a negative amount) for having a forum post or comment blocked by the word filter.
    REP_LOSS_COMMENT_DELETED: -100, //Reputation Points lost ("gaining" a negative amount) for having a comment removed by a moderator.
    REP_LOSS_SUBMISSION_HIDDEN: -150, //Reputation Points lost ("gaining" a negative amount) for having a submission hidden by a moderator.
    REP_LOSS_SUBMISSION_DELETED: -250, //Reputation Points lost ("gaining" a negative amount) for having a submission deleted by an admin.
    REP_LOSS_WARNING: -350, //Reputation Points lost ("gaining" a negative amount) for receiving a warning from a moderator.
    REP_LOSS_RESTRICTED: -400, //Reputation Points lost ("gaining" a negative amount) for getting restrictions on one's account.
    REP_LOSS_BANNED: -500, //Reputation Points lost ("gaining" a negative amount) for getting one's account banned.

    //Debug flags/variables; these should be the same on both the client and the server.
    //NOTE: Before release, make sure the below flags are set to "false"!
    ENABLE_DEBUG_MODE: true, //Whether or not certain features used for debugging (e.g. changing values that are not normally changeable even by admins) are available.
    FAKE_CURRENT_DATE: false, //If true, the site will appear and behave as if it is the date specified below instead of the current date.

    FAKE_DATE: new Date(2024, 1, 1) 
};

export default Globals;