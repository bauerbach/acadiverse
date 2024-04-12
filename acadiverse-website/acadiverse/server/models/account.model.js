const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for Acadiverse accounts.
const Account = mongoose.model("account", new Schema({
    username: { //The user's username; this is used to log in and refer to the user in various areas of Acadiverse.
        type: String,
        unique: true
    },
    display_name: { //The user's display name. This shows up in many places and is preferably their real name.
      type: String,
    },
    password: { //The user's password; this is salted/hashed in the database.
      type: String
    },
    password_attempts_remaining: { //The number of failed passwords attempt remaining before the user is locked out.
      type: Number,
      default: 3
    },
    locked_out: { //Whether or not the user is locked out due to too many failed password attempts.
      type: Boolean,
      default: false
    },
    lockout_expire_date: { //The date after which the user should no longer be locked out.
      type: Date,
      default: new Date("1/1/1970")
    },
    reputation_points: { //The amount of Reputation Points that this user has; these are used to grant extra priveleges to users.
        type: Number,
        default: 0
    },
    money: { //The number of Acadicoins that this user has.
        type: Number,
        default: 0
    },
    user_roles: { //An array of the user's roles.
      type: [String],
      default: []
    },
    account_banned: { //Whether or not the account is banned; banned users cannot log in to Acadiverse at all.
        type: Boolean,
        default: false
    },
    date_ban_expires: { //The date that the currently-active ban expires; this date is set to 1/1/1970 when a user is permabanned.
        type: Date,
        default: new Date("1/1/1970")
    },
    ban_reason: { //The reason that this account is banned.
        type: String,
        default: ""
    },
    can_chat: { //Whether of not the user is allowed to use chat in the Acadiverse game.
      type: Boolean,
      default: true
    },
    can_comment: { //Whether or not the user can leave comments on submissions.
      type: Boolean,
      default: true
    },
    can_publish: { //Whether or not the user is allowed to publish content to Acadiverse; this is independent of Reputation Points.
        type: Boolean,
        default: true
    },
    account_creation_date: { //The date the account was created; this is used for the "nth Anniversary!" achievement.
        type: Date
    },
    member_anniversary_date: { //The date of the user's "Member Anniversary".
      type: String
    },
    last_active: { //The date the user was last active (i.e. last had a successful token verification).
        type: Date
    },
    birthday: { //The user's birthday (different from the account creation date); users who log in on their birthday will receive a special gift, and a badge is shown on their profile as well on this date.
        type: Date
    },
    birthday_date: { //The date of the user's birthday.
      type: String
    },
    profile_bio: { //The bio/"About Me" section shown on the user's profile.
        type: String,
        default: "This user currently does not have a bio."
    },
    gender: { //The user's gender; this is also used for pronouns.
      type: String,
      default: "Unspecified"
    },
    gender_pronoun: { //The pronoun preferred by the user; this is used whenever the user needs to be addressed by a pronoun and is also shown on their profile.
      type: String,
      default: "they/them/their"
    },
    email: { //The user's email address; this is used to send automated email notifications and password-reset emails,
        type: String
    },
    publishing_strikes: { //The number of publishing strikes the user has received for having a submission rejected/taken down; after 3 of these, the user is automatically banned from publishing content to Acadiverse.
        type: Number,
        default: 0
    },
    warnings: { //The number of warnings that the user has received; After 3 warnings, the user will be banned for increasing amounts of time.
        type: Number,
        default: 0
    },
    notifications: { //An array of notifications that the user has recieved.
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    notify_achievement_received: { //Whether or not to notify the user when they have earned an achievement.
        type: Boolean,
        default: true
    },
    notify_submission_featured: { //Whether or not to notify the user of their submission being featured on the Submissions page.
        type: Boolean,
        default: true
    },
    notify_submission_comment: { //Whether or not to notify the user of any comments on their submissions.
        type: Boolean,
        default: true
    },
    notify_submission_upvote: { //Whether or not to send a notification when one of the user's submissions hits an upvote milestone (10 upvotes or a number divisible by 100).
        type: Boolean,
        default: true
    },
    notify_pm_received: { //Whether or not to send a notification when the user receives a PM.
        type: Boolean,
        default: true
    },
    receives_pms: { //Whether or not this user is allowing non-moderators to send them PMs.
        type: Boolean,
        default: true
    },
    blocked_users: { //A list of users who are blocked by this user; blocked users cannot send this user PMs or comment on their submissions unless the blocked user is also a moderator.
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    acknowledged_last_warning: { //Whether or not the user has acknowledged their most recent warning; a popup reminding them of the warning is shown and must be dismissed before the user can do anything else on Acadiverse if this is false.
        type: Boolean,
        default: true
    },
    last_warned_by_moderator_name: { //The name of the moderator who issued this user their most recent warning.
        type: String,
        default: ""
    },
    date_last_warning_received: { //The date the user has received their most recent warning.
        type: Date,
        default: new Date(0)
    },
    last_warning_reason: { //The reason for the most recent warning that this user received.
        type: String,
        default: ""
    },
    profile_image_url: { //The URL for the user's profile image.
        type: String,
        default: ""
    },
    uses_gravatar: { //Whether or not the user is using a Gravatar for their profile picture.
      type: Boolean,
      default: false
    },
    buddies: { //A list of "Buddies" that the user has. Buddies will have their activity shown in a "feed" and the user will also be able to visit their house and/or private Acadiverse Spaces (and vice-versa) in-game.
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    private_messages: {
      senders: [
        {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
          },
          messages: {
            type: Array,
            default: []
          }
        }
      ]
    },
    quiz_score_average: { //The average score that this user has earned on Quizzes.
      type: Number,
      default: 0
    },
    owned_items: { //An array of Store Items owned by this user.
          type: [mongoose.Schema.Types.ObjectId],
          default: []
    },
    achievement_top_publisher: { //The number of "Top Publisher" (having a submission featured) achievements that the user has.
        type: Number,
        default: 0
    },
    achievement_member_anniversary: { //The number of "Member Anniversary" (hitting the anniversary of creating the account) acihevements that the user has.
      type: Number,
      default: 0
    },
    achievement_aced_it: { //The number of "Aced It!" (getting a 100% on a Quiz) achievements that the user has.
      type: Number,
      default: 0
    },
    is_backer: { //Whether or not the user backed the Acadiverse Indiegogo project.
      type: Boolean,
      default: false
    },
    is_subscriber: { //Whether or not the user is a subscriber.
      type: Boolean,
      default: false
    },
    alpha_tester: { //Whether or not the user was an Alpha Tester.
      type: Boolean,
      default: false
    },
    beta_tester: { //Whether or not the user was a Beta Tester.
      type: Boolean,
      value: false
    },
    onboarding_completed: { //Whether or not the user has completed the onboarding process.
      type: Boolean,
      default: false
    },
    education_level: { //The user's current level of education (0 = Pre-K, 1 = K-12, 2 = College, 3 = Corporate Training, and 4 = Independent Learning).
      type: Number,
      default: 4
    },
    grade_level: { //The user's grade level (for K-12), or Freshman/Sophomore/Junior/Senior for college.
      type: Number,
      default: 0
    },
    avatar: { //The IDs used by the Acadiverse game to create this user's avatar; if "skinColor" is -1, the avatar was not yet created.
      skinColor: { //The numerical ID of the avatar's skin color.
        type: Number,
        default: -1
      },
      hat: { //The ID used to refer to the avatar's hat.
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      hairStyle: { //The ID used to refer to the avatar's hairstyle.
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      facialHair: { //The ID used to refer to the avatar's facial hair.
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      eyewear: { //The ID used to refer to the avatar's eyewear.
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      top: { //The ID used to refer to the avatar's shirt.
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      bottom: { //The ID used to refer to the avatar's pants.
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      footwear: { //The ID used to refer to the avatar's footwear.
        type: mongoose.Schema.Types.ObjectId,
        default: null
      }
    },
    favorited_submissions: { //An array of the IDs of submissions that the user has favorited.
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    upvoted_submissions: { //An array of the IDs of submissions that the user has upvoted.
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    downvoted_submissions: { //An array of the IDs of submissions that the user has downvoted.
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    consent_required: { //This prevents users under the age of 13 from logging in until their parents give consent. Required for legal compliance.
      type: Boolean,
      default: false
    }
  }))

module.exports = Account;