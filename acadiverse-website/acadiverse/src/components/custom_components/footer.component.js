import React, { Component } from 'react';

//import { FormattedMessage } from 'react-intl';

const Footer = () => {
    return (
        <footer className="footer">
            <hr />
                <p>
                    Copyright &copy; 2022 &lt;placeholder&gt;. All rights reserved.
                </p>
                <p>
                    <b>Policies</b>
                    <br />
                    <a href="/policies/code-of-conduct">Code of Conduct</a> | <a href="/policies/terms-and-conditions">Terms and Conditions</a>
                    <br />
                    <a href="/policies/privacy-policy">Privacy Policy</a> | <a href="/policies/cookie-policy">Cookie Policy</a>
                    <br />
                    <a href="/policies/dmca-policy">DMCA Policy</a> | <a href="/policies/acceptable-use-policy">Acceptable Use Policy</a>
                </p>
                <p>
                    <b>Help &amp; Support</b>
                    <br />
                    <a href="/contact">Contact Us</a>
                </p>
                <p>
                    <b>Community/Social</b>
                    <br />
                    <a href="http://wiki.acadiverse.com" target="_blank" rel="noreferrer">Wiki</a> | <a href="https://forum.acadiverse.com" target="_blank" rel="noreferrer">Forum</a>
                    <br />
                    <a href="https://discord.gg/ernZyKaVJJ" target="_blank" rel="noreferrer">Discord</a>
                    <br />
                    <a href="http://www.instagram.com/acadiverse" target="_blank" rel="noreferrer">Instagram</a>
                </p>
        </footer>
    )
}

export default Footer;