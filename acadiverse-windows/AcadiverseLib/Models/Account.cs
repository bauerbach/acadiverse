using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadiverseLib.Models;

public class Account
{
    private string id;
    private string username;
    private string display_name;
    private string password;
    private int reputation_points;
    private int money;
    private string[] user_roles;
    private bool account_banned;
    private DateTime date_ban_expires;
    private string ban_reason;
    private bool can_chat;
    private bool can_comment;
    private bool can_publish;
    private DateTime account_creation_date;
    private string member_anniversary_date;
    private DateTime last_active;
    private DateTime birthday;
    private string birthday_date;
    private string profile_bio;
    private string email;
    private int publishing_strikes;
    private int warnings;
    private bool notify_mentioned;
    private bool notify_achievement_recieved;
    private bool notify_submission_featured;
    private bool notify_submission_comment;
    private bool notify_submission_upvote;
    private bool notify_pm_recieved;
    private bool recieves_pms;
    private string[] blocked_users;
    private bool acknowledged_last_warning;
    private string last_warned_by_moderator_name;
    private DateTime date_last_warning_recieved;
    private string last_warning_reason;
    private string profile_image_url;
    private string[] buddies;
    private PrivateMessage[] private_messages;
    private int quiz_score_average;
    private string[] owned_items;
    private int achievement_top_publisher;
    private int achievement_member_anniversary;
    private int achievement_aced_it;
    private bool is_backer;
    private bool is_subscriber;
    private bool alpha_tester;
    private bool beta_tester;
    private bool onboarding_completed;
    private int preferred_use;
    private Avatar avatar;
    private bool uses_gravatar;
    private string[] favorited_submissions;
    private string[] upvoted_submissions;
    private string[] downvoted_submissions;

    /// <summary>
    /// The user ID for the account.
    /// </summary>
    public string Id
    {
        get => id; set => id = value;
    }

    /// <summary>
    /// The username for the account.
    /// </summary>
    public string Username
    {
        get => username; set => username = value;
    }

    /// <summary>
    /// The display name for the account.
    /// </summary>
    public string Display_Name
    {
        get => display_name; set => display_name = value;
    }

    /// <summary>
    /// A hash of the user's password.
    /// </summary>
    public string Password
    {
        get => password; set => password = value;
    }

    /// <summary>
    /// The number of Reputation Points; certain actions require a certain amount.
    /// </summary>
    public int Reputation_Points
    {
        get => reputation_points; set => reputation_points = value;
    }

    /// <summary>
    /// The number of Acadicoins the user has; Acadicoins are used in the Acadiverse Store.
    /// </summary>
    public int Money
    {
        get => money; set => money = value;
    }

    /// <summary>
    /// An array representing the user's roles.
    /// </summary>
    public string[] User_Roles
    {
        get => user_roles; set => user_roles = value;
    }

    /// <summary>
    /// If true, the account is banned and the user is unable to log in.
    /// </summary>
    public bool Account_Banned
    {
        get => account_banned; set => account_banned = value;
    }

    /// <summary>
    /// The date a ban expires; permanent bans have this set to 1970.
    /// </summary>
    public DateTime Date_Ban_Expires
    {
        get => date_ban_expires; set => date_ban_expires = value;
    }

    /// <summary>
    /// The reason a user is banned.
    /// </summary>
    public string Ban_Reason
    {
        get => ban_reason; set => ban_reason = value;
    }

    /// <summary>
    /// Whether or not the user is allowed to chat in-game.
    /// </summary>
    public bool Can_Chat
    {
        get => can_chat; set => can_chat = value;
    }

    /// <summary>
    /// Whether or not the user is allowed to comment on submissions and/or blog posts.
    /// </summary>
    public bool Can_Comment
    {
        get => can_comment; set => can_comment = value;
    }

    /// <summary>
    /// Whether or not the user us allowed to publish content to Acadiverse.
    /// </summary>
    public bool Can_Publish
    {
        get => can_publish; set => can_publish = value;
    }

    /// <summary>
    /// The date the account was created.
    /// </summary>
    public DateTime Account_Creation_Date
    {
        get => account_creation_date; set => account_creation_date = value;
    }

    /// <summary>
    /// The date of the anniversary of creating the account.
    /// </summary>
    public string Member_Anniversary_Date
    {
        get => member_anniversary_date; set => member_anniversary_date = value;
    }

    /// <summary>
    /// The date the user was last active.
    /// </summary>
    public DateTime Last_active
    {
        get => last_active; set => last_active = value;
    }

    /// <summary>
    /// The birthday for the user.
    /// </summary>
    public DateTime Birthday
    {
        get => birthday; set => birthday = value;
    }

    /// <summary>
    /// The date of the user's birthday.
    /// </summary>
    public string Birthday_Date
    {
        get => birthday_date; set => birthday_date = value;
    }

    /// <summary>
    /// The bio as shown on the user's profile.
    /// </summary>
    public string Profile_Bio
    {
        get => profile_bio; set => profile_bio = value;
    }

    /// <summary>
    /// The user's email address.
    /// </summary>
    public string Email
    {
        get => email; set => email = value;
    }

    /// <summary>
    /// The number of publishing strikes the user has; getting 3 of these results in an automatic ban from publishing.
    /// </summary>
    public int Publishing_Strikes
    {
        get => publishing_strikes; set => publishing_strikes = value;
    }

    /// <summary>
    /// The number of warnings the user has recieved.
    /// </summary>
    public int Warnings
    {
        get => warnings; set => warnings = value;
    }

    /// <summary>
    /// Whether or not to notify the user if they are mentioned in the comments of a submission.
    /// </summary>
    public bool Notify_Mentioned
    {
        get => notify_mentioned; set => notify_mentioned = value;
    }

    /// <summary>
    /// Whether or not to notify the user if they get an achievement.
    /// </summary>
    public bool Notify_Achievement_Recieved
    {
        get => notify_achievement_recieved; set => notify_achievement_recieved = value;
    }

    /// <summary>
    /// Whether or not to notify the user if one of their submissions is features.
    /// </summary>
    public bool Notify_Submission_Featured
    {
        get => notify_submission_featured; set => notify_submission_featured = value;
    }

    /// <summary>
    /// Whether or not to notify the user if someone comments on one of their submissions.
    /// </summary>
    public bool Notify_Submission_Comment
    {
        get => notify_submission_comment; set => notify_submission_comment = value;
    }

    /// <summary>
    /// Whether or not to notify the user if their submission reaches a certain number of upvotes.
    /// </summary>
    public bool Notify_Submission_Upvote
    {
        get => notify_submission_upvote; set => notify_submission_upvote = value;
    }

    /// <summary>
    /// Whether or not to notify the user if they recieve a PM.
    /// </summary>
    public bool Notify_PM_Recieved
    {
        get => notify_pm_recieved; set => notify_pm_recieved = value;
    }

    /// <summary>
    /// Whether or not the user is allowing non-moderators to send them PMs.
    /// </summary>
    public bool Recieves_PMs
    {
        get => recieves_pms; set => recieves_pms = value;
    }

    /// <summary>
    /// The list of other users the user has blocked.
    /// </summary>
    public string[] Blocked_Users
    {
        get => blocked_users; set => blocked_users = value;
    }


    /// <summary>
    /// Whether or not the user has acknowledged their last warning.
    /// </summary>
    public bool Acknowledged_Last_Warning
    {
        get => acknowledged_last_warning; set => acknowledged_last_warning = value;
    }

    /// <summary>
    /// The name of the moderator who last warned this user.
    /// </summary>
    public string Last_Warned_By_Moderator_Name
    {
        get => last_warned_by_moderator_name; set => last_warned_by_moderator_name = value;
    }

    /// <summary>
    /// The date the user last recieved a warning.
    /// </summary>
    public DateTime Date_Last_Warning_Recieved
    {
        get => date_last_warning_recieved; set => date_last_warning_recieved = value;
    }

    /// <summary>
    /// The reason the user last recieved a warning.
    /// </summary>
    public string Last_Warning_Reason
    {
        get => last_warning_reason; set => last_warning_reason = value;
    }

    /// <summary>
    /// The URL pointing to the user's profile image.
    /// </summary>
    public string Profile_Image_Url
    {
        get => profile_image_url; set => profile_image_url = value;
    }

    /// <summary>
    /// The list of buddies the user has.
    /// </summary>
    public string[] Buddies
    {
        get => buddies; set => buddies = value;
    }

    /// <summary>
    /// The list of PMs the user has.
    /// </summary>
    public PrivateMessage[] Private_Messages
    {
        get => private_messages; set => private_messages = value;
    }

    /// <summary>
    /// The average score the user has recieved on quizzes.
    /// </summary>
    public int Quiz_Score_Average
    {
        get => quiz_score_average; set => quiz_score_average = value;
    }

    /// <summary>
    /// A list of IDs of the user's items.
    /// </summary>
    public string[] Owned_Items
    {
        get => owned_items; set => owned_items = value;
    }
    public int Achievement_Top_Publisher
    {
        get => achievement_top_publisher; set => achievement_top_publisher = value;
    }
    public int Achievement_Member_Anniversary
    {
        get => achievement_member_anniversary; set => achievement_member_anniversary = value;
    }
    public int Achievement_Aced_It
    {
        get => achievement_aced_it; set => achievement_aced_it = value;
    }
    public bool Is_Backer
    {
        get => is_backer; set => is_backer = value;
    }
    public bool Is_Subscriber
    {
        get => is_subscriber; set => is_subscriber = value;
    }
    public bool Alpha_Tester
    {
        get => alpha_tester; set => alpha_tester = value;
    }
    public bool Beta_Tester
    {
        get => beta_tester; set => beta_tester = value;
    }
    public bool Onboarding_Completed
    {
        get => onboarding_completed; set => onboarding_completed = value;
    }
    public int Preferred_Use
    {
        get => preferred_use; set => preferred_use = value;
    }
    public Avatar Avatar
    {
        get => avatar; set => avatar = value;
    }
    public bool Uses_Gravatar
    {
        get => uses_gravatar; set => uses_gravatar = value;
    }
    public string[] Favorited_Submissions
    {
        get => favorited_submissions; set => favorited_submissions = value;
    }
    public string[] Upvoted_Submissions
    {
        get => upvoted_submissions; set => upvoted_submissions = value;
    }
    public string[] Downvoted_Submissions
    {
        get => downvoted_submissions; set => downvoted_submissions = value;
    }
}
