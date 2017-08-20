import { Link } from 'react-router';

class CsLink extends Component {
    render() {
        let href = location.href;
        var toTit = this.props.to;
        if (href.split('?')[1]) {
            toTit = `${this.props.to}?${window.location.href.split('?')[1]}`
        }

        // if (href.includes(toTit)) {
        //     toTit = href.substring(href.indexOf('/', 10));
        // }

        return (
            <Link
                  {...this.props}
                  to={ toTit }>
            { this.props.children }
            </Link>
        )
    }
}

export default CsLink
