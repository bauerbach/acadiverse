import { createSlice, current } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  accountInfo: {
    id: null,
    accountBanned: false,        
    accountCreationDate: new Date(),
    achievementAcedIt: 0,
    achievementMemberAnniversary: 0,
    achievementTopPublisher: 0,
    acknowledgedLastWarning: true,
    alphaTester: false,
    avatar: null,
    banReason: "",
    betaTester: false,
    birthday: new Date(),
    birthdayDate: "",
    blockedUsers: [],
    buddies: [],
    canPublish: true,
    dateBanExpires: new Date(),
    dateLastWarningReceived: new Date(), 
    displayName: "",
    email: "",
    gender: "",
    genderPronoun: "",
    isBacker: false,
    isSubscriber: false,
    lastActive: new Date(),
    lastWarnedByModeratorName: "",       
    lastWarningReason: "",
    money: 0,
    notifications: [],
    notifyAchievementReceived: true,
    notifyPMReceived: true,
    notifySubmissionComment: true,
    notifySubmissionFeatured: true,
    notifySubmissionUpvote: true,
    onboardingCompleted: true,
    ownedItems: [],
    password: "",
    privateMessages: [],
    profileBio: "",
    profileImageURL: "",
    publishingStrikes: 0,
    quizScoreAverage: 0,
    recievesPMs: true,
    reputationPoints: 0,
    roles: [],
    username: "",
    usesGravatar: false,
    warnings: 0
  }
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    accountInfoLoaded(state, action) {
      state.accountInfo = action.payload;
    },
    getAccountInfo(state, action) {
      return { ...state, ...action.payload };
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    },
  }
})