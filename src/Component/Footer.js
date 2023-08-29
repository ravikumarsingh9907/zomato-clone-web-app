import './footer.scss';
import logo from '../Asset/zomato-svgrepo-com.png'

export default function Footer() {
    return (
        <div className='footer-wrapper'>
            <div className='footer-container'>
                <div className='logo-container'>
                    <div className='logo'>
                        <img src={logo} alt='logo' />
                    </div>
                </div>
                <div className='options-container'>
                    <div className='heading-list-container'>
                        <p className='heading'>ABOUT ZOMATO</p>
                        <ul className='list-container'>
                            <li className='list'>Who We Are</li>
                            <li className='list'>Blog</li>
                            <li className='list'>Work With Us</li>
                            <li className='list'>Investor Relations</li>
                            <li className='list'>Report Fraud</li>
                            <li className='list'>Contact Us</li>
                        </ul>
                    </div>
                    <div className='heading-list-container'>
                        <p className='heading'>ZOMAVERSE</p>
                        <ul className='list-container'>
                            <li className='list'>Zomato</li>
                            <li className='list'>Blinkit</li>
                            <li className='list'>Feeding India</li>
                            <li className='list'>Hyperpure</li>
                            <li className='list'>Zomaland</li>
                        </ul>
                    </div>
                    <div className='heading-list-container'>
                        <p className='heading'>FOR RESTAURANTS</p>
                        <ul className='list-container'>
                            <li className='list'>Partner With Us</li>
                            <li className='list'>Apps For You</li>
                            <li className='list'>Zomato For Enterprise</li>
                        </ul>
                    </div>
                    <div className='heading-list-container'>
                        <p className='heading'>LEARN MORE</p>
                        <ul className='list-container'>
                            <li className='list'>Privacy</li>
                            <li className='list'>Security</li>
                            <li className='list'>Terms</li>
                            <li className='list'>Sitemap</li>
                        </ul>
                    </div>
                    <div className='heading-list-container'>
                        <p className='heading'>SOCIAL LINKS</p>
                        <ul className='social-container'>
                            <li className='list'><i className='bx bxl-linkedin-square' ></i></li>
                            <li className='list'><i className='bx bxl-instagram-alt'></i></li>
                            <li className='list'><i className='bx bxl-twitter' ></i></li>
                            <li className='list'><i className='bx bxl-youtube' ></i></li>
                            <li className='list'><i className='bx bxl-facebook-square' ></i></li>
                        </ul>
                    </div>
                </div>
                <div className='copyright-container'>
                    <p className='copyright'>By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. 2008-2023 © Zomato™ Ltd. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}