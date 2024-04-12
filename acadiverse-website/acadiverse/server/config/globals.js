module.exports = {
    MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], //An array of the months of the year.
    MONTH_DAYS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    DAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], //An array of the days of the week.
    DOMAIN: "http://localhost:3000", //The domain for the Acadiverse website, used for URLs in automated PMs.
    REP_FOURM: 40, //Required Reputation Points for using acadiverse Forum.
    REP_COMMENTS: 50, //Required Reputation Points for leaving comments.
    REP_PUBLISHING: 100, //Required Reputation Points for publishing.
    REP_COURSE_REWARDS: 250, //Required Reputation Points for being able to reward students with Store items for completing a course.
    REP_INDEX: 500, //Required Reputation Points for having one's content indexed by search engines.
    REP_WIKI: 1000, //Required Reputation Points for editing Acadiverse Wiki.
    REP_GAIN_QUIZ: 5, //Reputation Points gained for getting at least a 75% on a quiz.
    REP_GAIN_QUIZ_B: 10, //Reputation Points gained for getting a "B" (at least 80%) on a quiz.
    REP_GAIN_QUIZ_ACED: 15, //Reputation Points for getting an "A" (at least 90%) on a quiz.
    REP_GAIN_FAVORITED: 25, //Reputation Points gained for having a submission favorited.
    REP_GAIN_COURSE_COMPLETED: 50, //Reputation Points gained for completing a course.
    REP_GAIN_SUBSCRIBED: 100, //Reputation Points gained for each month of having an Acadiverse subscription.
    REP_GAIN_FEATURED: 250, //Reputation Points gained for having a submission featured.
    REP_GAIN_ANNIVERSARY: 500, //Reputation Points gained each year on the anniversary of creating one's Acadiverse account.
    REP_LOSS_FILTER: -50, //Reputation Points lost ("gaining" a negative amount) for having a comment blocked by the word filter.
    REP_LOSS_COMMENT_DELETED: -100, //Reputation Points lost ("gaining" a negative amount) for having a comment removed by a moderator.
    REP_LOSS_SUBMISSION_HIDDEN: -150, //Reputation Points lost ("gaining" a negative amount) for having a submission hidden by a moderator.
    REP_LOSS_SUBMISSION_DELETED: -250, //Reputation Points lost ("gaining" a negative amount) for having a submission deleted by an admin.
    REP_LOSS_WARNING: -350, //Reputation Points lost ("gaining" a negative amount) for receiving a warning from a moderator.
    REP_LOSS_RESTRICTED: -400, //Reputation Points lost ("gaining" a negative amount) for getting restrictions (e.g. banned from publishing content to Acadiverse) on one's account.
    REP_LOSS_BANNED: -500, //Reputation Points lost ("gaining" a negative amount) for getting one's account banned.
    FEATURED_REQUIRED_UPVOTES: 1000, //The number of upvotes required for a submission to be featured.
    FEATURED_REQUIRED_FAVORITES: 1000, //The number of users that need to favorite a submission before it can be featured.
    FEATURED_MAX_DOWNVOTES: 50, //The maximum number of downvotes that a submission can have in order to be featured.

    //NOTE: Make sure the below flags are disabled before release!
    
    /**
     * If true, Debug routes and other "debug" 
     * flags will be enabled.
     */
    ENABLE_DEBUG_MODE: true, 

    /**
     * If true, the server will "pretend" it is the date 
     * specified below for the purposes of testing features 
     * such as seasonal events, including availability of 
     * Store Items marked as "Seasonal".
     */
    FAKE_CURRENT_DATE: false, 

    /**
     * If "FAKE_CURRENT_DATE" is true, the server will behave as if the current date is the date specified below.
     */
    FAKE_DATE: new Date(2024, 0, 1),

    /**
     * If true, the server will always crash. Only use this to test apps' "responses" to the backend being down!
     */
    KILLSWITCH: false
}