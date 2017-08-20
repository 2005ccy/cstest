import './foot.scss';

export default class Foot extends Component {

    render() {
        return (
            <div id="foot-foot">
                <nav className="pull-left">
                    <ul>
                        <li>
                            <a href="#">Home</a>
                        </li>
                        <li>
                            <a href="#">Company</a>
                        </li>
                        <li>
                            <a href="#">Portfolio</a>
                        </li>
                        <li>
                            <a href="#">Blog</a>
                        </li>
                    </ul>
                </nav>
                <p className="copyright pull-right">
                    © 2016 <a href="http://www.creative-tim.com">Creative Tim</a>, made with love for a better web
                </p>
            </div>
            );
    }
}