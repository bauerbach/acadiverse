import { createMedia } from "@artsy/fresnel";
import React, { Component } from 'react';
import { useState, useEffect } from 'react'
import { Container } from 'semantic-ui-react';
//import { FormattedMessage } from 'react-intl';


export default function CodeOfConductComponent() {
	const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
  
        return (
			<section>{isClient? <Container className="content">
				<h1>Acadiverse Code of Conduct</h1>
				
				<p>To keep Acadiverse safe and fun for all of our players, we have a Code of Conduct in place. We value a respectful and welcoming community.</p>
				<p>Please make sure to read through this Code of Conduct before signing up for an account on Acadiverse. Don't worry, we will try to make it as short and to-the-point as possible.</p>
				<p>These rules are in place not to restrict what you can do in Acadiverse and punish those who break them, but they keep Acadiverse a safe and welcoming environment for anyone.</p>
				<p>If you see any player or submission that may be breaking our Code of Conduct, please file a report using the "Report" feature.</p>
				<p>These rules also apply to the r/Acadiverse subreddit and the Acadiverse Discord Server.</p>

				<h2>What is expected of our players.</h2>
				<ul>
					<li>We expect you to be respectful towards each other. Don't say anything mean if a scenario is too hard or do anything that may upset others in-game.</li>
					<li>Comply with any moderator actions. The job of a moderator is not to punish you, but to help you learn what to do/what not to do and keep others safe and welcome.</li>
				</ul>

				<h2>Things that are not allowed on Acadiverse.</h2>
				<ul>
					<li>Do not spam. This includes repeatedly sending the same message multiple times, sending nonsense/gibberish, and posting just to draw attention to yourself.</li>
					<li>Make sure your comments, submissions, and other content are school-appropriate. If it would get you in trouble in school, do not post or submit it! This includes:</li>
					<ul>
						<li>Any foul language or racial/cultural slurs.</li>
						<li>Any sexual content, including nudity or glorifying/depicting sexual activities. Sexual content involving minors, bestality, incest, and/or solicitation of sexual services are also illegal and will be immediately removed and may result in severe consequences!</li>
						<li>Violent threats, glorification/depiction of violent acts, or other types of violent content.</li>
						<li>Solicitation of, glorification of, or teaching of how to make illegal/controlled goods, including drugs, alcohol, tobacco, forgeries, pirated media/software, and weapons.</li>
						<li>Linking to sites containing adult content, malware, or anything illegal. This also includes linking to broswers such as TOR or giving instructions on how to bypass any georestrictions, technical restrictions, age restrictions, paywalls, or password protection.</li>
						<li>Content that teaches people how to commit cybercrimes or promotes/glorifies such activities. This includes hacking, creating malware, making a botnet, and stealing private data/passwords.</li>
						<li>Insensitive content. This includes exploiting/profiting off of recent tragedies such as natural disasters, crimes that result in massive casualties, or someone's death.</li>
						<li>Sharing or requesting personal, private, or otherwise sensitive information.</li>
						<li>Spreading false information about health or politics.</li>
					</ul>
					<li>Do not attempt to bypass any restrictions placed on you by a moderator. This includes creating another account to get around a ban or other restriction.</li>
					<li>Do not create more than one account. Each player is only allowed one account, and only one account is necessary. An exception is moderators or developers, who need to use multiple accounts to test functionality.</li>
					<li>No impersonation or deception of another player. This includes: misleading submissions, sending hoaxes or "chain letter" messages, or pretending to be someone you are not.</li>
					<li>Do not submit false reports. This just wastes the moderators' time.</li>
				</ul>

				<h2>Consequences and enforcement</h2>
				<p>If you break one of the above rules, there will be consequences. For a first or minor offense, you will get a warning from a moderator. Submissions or other content may also be removed.</p>
				<p>If you choose to ignore these warnings, restrictions will be placed on your account; For example, repeatedly submitting content that can be considered spam may result in you getting banned from publishing anything to Acadiverse.</p>
				<p>If you are banned, you will not be allowed any access to Acadiverse. Future infractions after a ban will result in longer bans and even being permanently banned.</p>

				<h2>Appealing</h2>
				<p>If you believe that a ban or other restriction was imposed in error, you may appeal by going to <a href="/account/appeal">this page</a>. Please be kind and respectful in your appeal.</p>
				<p>A good appeal should be an explanation of why your ban or other restrictions should be lifted. We are also more likely to accept the appeal if you can convince us that you will be a respectful player on Acadiverse. Please note that you only get one chance at an appeal: whatever the staff decides is final. If you are permanently banned for posting illegal content, using multiple accounts, or attempting to circumvent restrictions, you will not be able to appeal.</p>
				<p>After a successful appeal, you will be able to use Acadiverse again and will have all restrictions lifted. Please note, however, that any further violations of the Code of Conduct will result in another permanent ban, and you will not be able to appeal.</p>
					
				</Container>: null}
			</section>
				
    )
}