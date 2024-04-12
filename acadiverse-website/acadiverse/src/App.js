/**
 * @file Contains all of the routes for the app as well as loading/error handling.
 * @author Bradley Auerbach <bauerbach@gmail.com>
 * @version 1.0.0
 */

import "bootstrap/dist/css/bootstrap.min.css";

import { Modal, Button } from "semantic-ui-react";

import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { IntlProvider } from "react-intl";
import { connect } from "react-redux";

import Globals from './globals';
import "./style.css";

import AboutComponent from "./components/pages/about.component";
import AcceptableUsePolicyComponent from './components/pages/acceptable-use-policy.component';
import AccountSettingsPage from './components/pages/account-settings-page.component';
import AdminDashboardComponent from "./components/pages/admin-dashboard.component";
import AppComponent from "./components/acadiverse-web-app/app.component";
import AppealComponent from "./components/pages/appeal.component";
import BlogPostComponent from "./components/pages/blog-post.component";
import CodeOfConductComponent from "./components/pages/code-of-conduct.component";
import ContactComponent from './components/pages/contact.component';
import CookiePolicyComponent from './components/pages/cookie-policy.component';
import DMCAPolicyComponent from './components/pages/dmca-policy.component';
import DownloadComponent from "./components/pages/download-component.component";
import EditBlogPostComponent from "./components/pages/edit-blog-post.component";
import EditSubmissionComponent from "./components/pages/edit-submission.component";
import Error404Component from "./components/pages/error404.component";
import MainComponent from "./components/pages/main-component.component";
import PremiumComponent from "./components/pages/premium.component";
import PremiumCheckoutPage from "./components/pages/premium-checkout.component";
import PrivacyPolicyComponent from './components/pages/privacy-policy.component';
import ProfilePageComponent from './components/pages/profile-page.component';
import SubmissionsPage from "./components/pages/submissions-page.component";
import SubmissionDetailsPage from "./components/pages/submission-details.component";
import StorePage from "./components/pages/store-page.component";
import TermsAndConditionsComponent from './components/pages/terms.component';
import ViewBlogPostsComponent from "./components/pages/view-blog-posts-component";
import ViewForumCategoriesComponent from "./components/pages/view-forum-categories.component";

import OnboardingModal from "./components/modals/onboarding.component";
import AccountBanNotice from "./components/modals/account-ban_notice.component";
import ModeratorWarningComponent from "./components/modals/moderator-warning.component";
import PrivateMessagesModal from "./components/modals/private_messages.component";
import NotificationsModal from "./components/modals/notifications.component";

//import axios from "axios";

import messages_enUS from "./lang/en-US.json";

import setAuthToken from "./services/auth.token";
import { setCurrentUser, logoutUser } from "./services/auth.service";
import { getAccountInfo } from "./services/account.service";
import jwt_decode from "jwt-decode";

var loggedIn = false;
var loading = false;

require('@formatjs/intl-pluralrules/polyfill')
require('@formatjs/intl-relativetimeformat/polyfill');



export default function App() {
  const [error, setError] = useState(false);
  
  const messages = {
    'en-US': messages_enUS
  };

  const dispatch = useDispatch();

  function handleErrorChange(e) {
    loading = false;
  }

  function pingServer() {
    return new Promise((resolve) => {
      fetch(Globals.API_URL)
        .then((response) => {
          setError(false);
          if(!loggedIn) {
            loading = false;
            setError(false);
          }
        })
        .catch((error) => {
          loading = false;
          setError(true);
        });
    });
  }

  useEffect(() => {
    pingServer();
  });
    if(error) {
      return (
      <div className="server-error">
        <h1>Acadiverse is currently experiencing technical difficulties.</h1>
        <p>Our system appears to be having issues at the moment. For updates on the situation, please follow us on social media or check out our Discord server.</p>
      </div>
      )
    } else {
      if(loading) {
        return null;
      } else {
        
        return (
            <Routes>
              <Route path="/" element={<MainComponent />} />
              <Route path="/about" element={<AboutComponent />} />
              <Route path="/account/appeal" element={<AppealComponent />} />
              <Route path="/admin-dashboard" element={<AdminDashboardComponent />} />
              <Route path="/account/settings" element={<AccountSettingsPage />} />
              <Route path="/app" element={<AppComponent />} />
              <Route path="/blog/latest-posts" element={<ViewBlogPostsComponent />} />
              <Route path="/blog/:post" element={<BlogPostComponent />} />
              <Route path="/blog/posts/edit/:post" element={<EditBlogPostComponent />} />
              <Route path="/contact" element={<ContactComponent />} />
              <Route path="/download" element={<DownloadComponent />} />
              <Route path="/forum/categories" element={<ViewForumCategoriesComponent />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
              <Route path="/submission/:id" element={<SubmissionDetailsPage />}/>
              <Route path="/submissions/edit" element={<EditSubmissionComponent />} />
              <Route path="/premium" element={<PremiumComponent />} />
              <Route path="/premium/checkout" element={<PremiumCheckoutPage />} />
              <Route path="/policies/acceptable-use-policy" element={<AcceptableUsePolicyComponent />} />     
              <Route path="/policies/code-of-conduct" element={<CodeOfConductComponent />} />
              <Route path="/policies/cookie-policy" element={<CookiePolicyComponent />} />
              <Route path="/policies/copyright-policy" element={<DMCAPolicyComponent />} />
              <Route path="/policies/privacy-policy" element={<PrivacyPolicyComponent />} />
              <Route path="/policies/terms-and-conditions" element={<TermsAndConditionsComponent />} />
              <Route path="/profile/:user" element={<ProfilePageComponent />} />
              <Route path="*" element={<Error404Component />} />
            </Routes>
      );
    }
  }
}