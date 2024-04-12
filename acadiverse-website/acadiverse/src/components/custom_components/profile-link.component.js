import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Gravatar from 'react-gravatar';
import { Image } from 'semantic-ui-react';

import Globals from "../../globals";
import badge_admin from '../../assets/images/icons/badge_admin.svg';
import badge_moderator from '../../assets/images/icons/badge_moderator.svg';
import badge_founder_personalized from '../../assets/images/icons/badge_founder_personalized.svg';
import badge_alpha_tester from '../../assets/images/icons/badge_alpha_tester.svg';
import badge_beta_tester from '../../assets/images/icons/badge_beta_tester.svg';
import badge_backer from '../../assets/images/icons/badge_backer.svg';
import badge_subscriber from '../../assets/images/icons/badge_subscriber.svg';


export default function ProfileLink(props) {
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [isBacker, setIsBacker] = useState(false);
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [roles, setRoles] = useState([]);
    const [email, setEmail] = useState("");
    const [usesGravatar, setUsesGravatar] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [badgeFounderPersonalized, setBadgeFounderPersonalized] = useState(false);
    const [alphaTester, setAlphaTester] = useState(false);
    const [betaTester, setBetaTester] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch(`${Globals.API_URL}/account/getBasicInfo?id=${props.user}`)
        .then((res) => res.json())
        .then((res) =>
        {
            if(res.statusCode === 404) {
                setUsername("DELETED");
            } else {
                setDisplayName(res.displayName);
                setUsername(res.username);
                setIsBacker(res.isBacker);
                setIsSubscriber(res.isSubscriber);
                setRoles(res.roles);
                setEmail(res.email);
                setUsesGravatar(res.usesGravatar);
                setProfileImageUrl(res.profileImageUrl);
                setBadgeFounderPersonalized(res.badgeFounderPersonalized);
                setAlphaTester(res.alphaTester);
                setBetaTester(res.betaTester);
                setLoaded(true);
            }
        });
    });

    if(loaded) {
    return (
        <span>{username === "DELETED"? <span>DELETED</span>: <span><a href={`${Globals.DOMAIN}/profile/${username}`}>{usesGravatar ? <Gravatar email={email} className="user-profile"/> : <Image alt={username} src={profileImageUrl} onError={()=>{setProfileImageUrl("http://www.acadiverse.com/images/profile_default.svg")}} size="mini" avatar circular className="user-profile" />} {displayName} (@{username})</a>
            {roles.includes("admins") ? <Image alt="Admin Badge" src={badge_admin} size="mini" avatar circular className="user-profile-badge" /> : null}
            {roles.includes("moderators") ? <Image alt="Moderator Badge" src={badge_moderator} size="mini" avatar circular className="user-profile-badge" /> : null}
            {alphaTester ? <Image alt="Alpha Tester Badge" src={badge_alpha_tester} size="mini" avatar circular className="user-profile-badge" /> : null}
            {betaTester ? <Image alt="Beta Tester Badge" src={badge_beta_tester} size="mini"miniavatar circular className="user-profile-badge" /> : null}
            {isBacker ? <Image alt="Backer Badge" src={badge_backer} size="mini" avatar circular className="user-profile-badge" /> : null}
            {isSubscriber ? <Image alt="Subscriber Badge" src={badge_subscriber} size="mini" avatar circular className="user-profile-badge" /> : null}
            {badgeFounderPersonalized ? <Image alt="Founder Personalized Badge" src={badge_founder_personalized} size="mini" avatar circular className="user-profile-badge" /> : null}</span>}</span>
            
    );
    } else {
        return (
            <span>DELETED</span>
        )
    }
}