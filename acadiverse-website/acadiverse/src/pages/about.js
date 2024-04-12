import { createMedia } from "@artsy/fresnel";
import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import Navigation from '../components/custom_components/navigation.component';
import Footer from '../components/custom_components/footer.component';
import { FormattedMessage } from 'react-intl';
import { Helmet, HelmetProvider } from 'react-helmet-async';


const AppMedia = createMedia({
    breakpoints: {
        mobile: 320
    }
});

const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

export default function AboutComponent() {
	return (
		<Container>
			<h1>About Acadiverse</h1>
			<h2>Free game-based learning.</h2>
			<p>Acadiverse is an innovative game-based learning platform. Rather than just learning by watching videos or reading text, players can interact with each other in a large, 3D world. Teachers can also create their own \"courses\", which are events that take place in 3D worlds known as Acadiverse Spaces, which can contain Scenarios. There are also scenarios that we have already made. There are also worksheets and quizzes, but they can be more fun than the ones usually given in classes.</p>
			<p>The gamified elements/features of Acadiverse are:</p>
			<ul>
				<li>Each scenario has unique achievements and other rewards, which creators can set for each scenario.</li>
				<li>Acadicoins, Acadiverse's currency, can be earned by playing in scenarios and doing well on quizzes.</li>
				<li>Each scenario can also be part of a \"course\" making it possible for class or corporate training to be done entirely using Acadiverse!</li>
				<li>Acadiverse's advantages over other gamified learning systems is that it is completely free and easy to use, both at school/work training and at home!</li>
			</ul>
			<h2>Acadiverse Course Creator</h2>
			<p>Acadiverse Course Creator is a free program that users can use to make scenarios for Acadiverse. It is easy to learn, and there is also a way to preview your scenarios in the game.</p>
		</Container>
	
	)
}