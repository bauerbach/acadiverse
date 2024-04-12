const authConfig = require('./auth.config');

module.exports = {

    // #region Account

    idNotFound: "No user with ID %1 was found.",
    invalidUsername: "The user \"%1\" does not exist.",
    loginError: "Invalid username or password.",
    lockedOut: "You have been locked out due to too many failed password attempts.",
    consentRequired: "Thanks for trying to log in! However, we need your parent or guardian's consent before you can access Acadiverse.\nPlease ask your parent to check their email for a message with instructions on how to provide consent.",
    passwordMismatch: "Passwords did not match.",
    usernameUnavailable: "This username is currently unavailable.",
    emailInUse: "This email is currently in use.",
    loginsDisabled: "Unfortunately, logins to Acadiverse are currently disabled. We apologize for the inconvenience.",
    registrationsDisabled: "Unfortunately, Acadiverse is not accepting new registrations at this time. Please try signing up later. We apologize for the inconvenience.",
    accountTempbanned: `Your account has been banned until %1 for the following reason:\n\n%2\n\nPlease go to ${authConfig.appealURL} if you believe that this is a mistake.`,
    accountPermabanned: `Your account has been permanently banned for the following reason:\n\n%1\n\nPlease go to ${authConfig.appealURL} if you believe that this is a mistake.`,
    bannedFromChat: `You are currently banned from using in-game chat. Please go to ${authConfig.appealURL} if you believe that this is a mistake.`,
    bannedFromCommenting: `Your comment was not posted as you are currently banned from leaving comments in Acadiverse. Please go to ${authConfig.appealURL} if you believe that this is a mistake.`,
    bannedFromForum: `You cannot perform this action as you are banned from Acadiverse Forum. Please go to ${authConfig.appealURL} if you believe that this is a mistake.`,
    bannedFromWiki: `You cannot perform this action as you are banned from Acadiverse Wiki. Please go to ${authConfig.appealURL} if you believe that this is a mistake.`,
    bannedFromPublishing: `You may not perform this action because you are currently banned from publishing content to Acadiverse. Please go to ${authConfig.appealURL} if you believe that this is a mistake.`,
    automaticBanReason: "You have been automatically banned because you have received your %1 warning.",
    insufficientReputationPoints: "You do not have enough Reputation Points to perform this action. You need %1 and you currently have %2.",
    insufficientMoney: "You cannot afford this item right now. You need %1 more Acadicoins.",
    noRole: "This action can only be performed by %1.",
    roleNotFound: "The specified user role does not exist.",
    pmUserBlocked: "You cannot PM this user because they have blocked you.",
    pmUserOptedOut: "You cannot PM this user because they have chosen not to receive PMs from users who are not moderators.",
    activeWarning: "You currently have an active warning. You must acknowledge this warning before continuing.",
    userAlreadyAppealed: "An appeal has already been sent for user %1. Please note that it may take a few days for a decsion to be made, and any decisions that have already been made are final.",
    appealSent: "Your appeal was successfully sent. Please wait a few days for your appeal to be reviewed. An email will be sent to your email address once a decision has been made.",
    appealNotNecessary: "You do not need to send an appeal because you are not banned nor do you have any other restrictions on your account. If you believe this is wrong, please check the username you entered.",
    acknowledgedWarning: "The warning was acknowledged. Please try to behave better from now on.",
    avatarItemUnavailable: "Could not change your avatar because you do not have all of the specified items.",
    avatarItemNotFound: "The item \"%1\" your avatar had equipped has been replaced with the default of that type because the item no longer exists.",
    itemNotOwned: "Item with id \"%1\" is not in your inventory.",
    pmSent: "The PM was successfully sent.",
    reportSent: "Your report was successfully sent. Thank you for helping to keep Acadiverse a safe and welcoming platform for everybody.",
    usernameBlocked: "The username \"%1\" has been blocked and may not be used to create a new account.",
    emailBlocked: "The email \"%1\" has been blocked and may not be used to create a new account.",
    accountDeleted: "Your account has been deleted. We are sad to see you go!",
    accountSettingsChanged: "The account settings were successfully changed.",
    avatarChanged: "Your avatar has been changed. If you did not change it in-game, please switch Acadiverse Spaces or restart the game to see your changes.",

    // #endregion

    // #region StaffActions

    appealNotFound: "No appeal could be found for user %1.",
    decisionMade: "You have successfully made a decision on the appeal for %1.",
    gaveWarning: "Successfully gave user %1 a warning.",
    submissionSuccessfullyHidden: "This submission was successfully hidden.",
    submissionSuccessfullyUnhidden: "This submission was successfully unhidden.",
    invalidAchievement: "No achievement with this name exists.",
    invalidSettingType: "The setting type is invalid.",
    invalidKey: "No setting with key %1 exists.",
    accountDeletedByAdmin: "The selected account has been deleted.",

    // #endregion

    // #region Submissions
    
    submissionsDisabled: "Unfortunately, Acadiverse is not currently accepting submissions. Please try publishing later. We are sorry for the inconvenience.",
    submissionPublished: "Your submission has been published.",
    submissionUpdated: "Your submission has been updated.",
    submissionUpvoted: "Successfully upvoted this submission.",
    submissionDownvoted: "Successfully downvoted this submission.",
    submissionFavorited: "Successfully added this submission to your favorites.",
    submissionUnfavorited: "Successfully removed this submission from your favorites.",
    submissionDeleted: "This submission has been deleted.",
    notSubmissionAuthor: "You may not edit this submission because you are not the author.",
    submissionHidden: "This submission has been hidden by a moderator because it violated the Terms of Service or Code of Conduct.",
    submissionNotFound: "This submission could not be found. It may have been removed by the author, or an admin may have removed it due to Terms of Service violations.",

    // #endregion

    // #region Store

    storeItemNotFound: "This store item does not exist.",
    itemPurchased: "Successfully purchased this item.",
    itemDiscontinued: "This item has been discontinued and can no longer be purchased.",
    itemNotInSeason: "This item is currently out of season and is only available between %1 and %2.",
    itemExclusive: "This item may not be purchased as it is only available to certain users.",
    userAlreadyHasItem: "You do not need to purchase this item because you already have it.",

    // #endregion

    // #region Forum
    
    forumClosed: "We're sorry, but Acadiverse Forum is currently closed and posting/replying has been disabled. We apologize for the inconvenience.",
    postLocked: "You cannot reply to this post because it is locked.",
    postNotFound: "This post could not be found.",

    // #endregion

    // #region Wiki

    wikiClosed: "We're sorry, but Acadiverse Wiki is currently closed and editing/creating pages has been disabled. We apologize for the inconvenience.",
    pageLocked: "You cannot edit this page because it is locked.",
    pageNotFound: "This page does not exist.",
    invalidEdit: "An invalid revision ID was specified.",
    pageEdited: "Your edit has been saved.",
    pageDeleted: "This page has been deleted.",

    // #endregion

    // #region ClassroomDiscussions

    classroomDiscussionNotFound: "This Classroom Discussion could not be found.",
    notClassroomDiscussionMember: "You may not perform this action because you are not a member of this Classroom Discussion.",
    notClassroomDiscussionOwner: "Only the owner of this Classroom Discussion can perform this action.",

    // #endregion

    // #region PMs

    reportPM: "%1 has reported the following content: \"$2\" (%3). Please review the content here: [%4](%4). Repoort Reason: %5- %6",
    welcomePM: "Welcome to Acadiverse! Thank you for joining!",
    submissionDeletedPM: "Your submission, \"%1\", has been deleted by an admin for violations of the Terms of Service or Code of Conduct.",
    submissionHiddenPM: `Your submission, [\"%1\"](http://www.acadiverse.com/submissions/%2), has been hidden by a moderator for the following reason: %3. You can still view and edit it. Please correct all violations and then go to ${authConfig.appealURLMarkdownLink} to request a review.`,
    memberAnniversaryPM: "Happy Acadiverse Anniversary, %1 (%2)! You've been with us for %3 years now!",
    birthdayPM: "Happy birthday, %1 (%2)! Please check your inventory in-game for a special gift!",
    subscriberPM: "Thank you for supporting Acadiverse by subscribing! You will now have access to an exclusive Acadiverse Space and will get exclusive items in your inventory!",
    bannedFromChatPM: `You have been banned from chatting in the Acadiverse game for the following reason: %1. If you believe that this is a mistake, please go to ${authConfig.appealURLMarkdownLink}.`,
    bannedFromCommentingPM: `You have been banned from leaving comments on Acadiverse submissions/blog posts for the following reason: %1. If you believe that this is a mistake, please go to ${authConfig.appealURLMarkdownLink}.`,
    bannedFromForumPM: `You have been banned from using Acadiverse Forum for the following reason: %1. If you believe that this is a mistake, please go to ${authConfig.appealURLMarkdownLink}. NOTE: You are still allowed to use Classroom Discussions.`,
    bannedFromPublishingPM: `You have been banned from publishing content to Acadiverse for the following reason: %1. If you believe that this is a mistake, please go to ${authConfig.appealURLMarkdownLink}.`,

    // #endregion

    // #region Notifications

    achievementRecievedNotification: "You have recieved the following achievement: %1.",
    submissionUpvoteMilestoneNotification: "Your submission, [\"%1\"](%2), has recieved %3 upvotes!",
    submissionCommentNotification: "%1 has left a comment on your submission, [\"%2\"](%3).",
    commentsMentionedNotification: "[%1](%2) has mentioned you in the comments for the following submission: \"%3\".",
    submissionFeaturedNotification: "Congrats! Your submission, [\"%1\"](%2), has been featured on the Submissions page of the Acadiverse website!",
    newDefaultItemReleaseNotification: "A new item in the \"Default Set\" set, \"%1\", has been released and was automatically added to your inventory.",
    newItemReleaseNotification: "A new item has been released in the Acadiverse Store! Check out \"%1\" here: \"%2\".",
    wishlistedItemUpdatedNotification: "Item \"%1\" in your wishlist has been updated.",
    ownedItemUpdatedNotification: "\"%1\", an item that you own, has been updated.",
    ownedItemDeletedNotification: "\"%1\" has been removed from your inventory as it no longer exists. The Acadicoins you spent on it have also been refunded to you.",
    pmRecievedNotification: "%1 sent you a PM.",

    // #endregion

    // #region HolidayBanners

    newYearsHeader: "Happy New Year!",
    newYearsMessage: "Here's to a good %1!",
    valentineHeader: "Happy Valentine's Day!",
    valentineMessage: "Love is in the air today!",
    teacherAppreciationHeader: "Happy Teacher Appreciation Week!",
    teacherAppreciationMessage: "Thank you all teachers for your hard work!",
    fourthOfJulyHeader: "Happy 4th of July!",
    fourthOfJulyMessage: "There will be fireworks in the Acadiverse Hub!",
    acadiverseAnniversaryHeader: "Happy Birthday, Acadiverse!",
    acadiverseAnniversaryMessage: "Acadiverse turns %1 today! Make sure to claim your gift!",
    halloweenHeader: "Happy Halloween!",
    halloweenMessage: "There is a Costume Party in the Acadiverse Hub! Dress up your avatar and enter to win spooky good prizes!",
    adventHeader: "Advent Calendar",
    adventMessage: "Only %1 days left until Christmas! If you missed any Advent Calendar days, be sure to claim your gifts by 12/24!",
    christmasHeader: "Merry Christmas!",
    christmasMessage: "Be sure to open your gifts!"

    // #endregion
}