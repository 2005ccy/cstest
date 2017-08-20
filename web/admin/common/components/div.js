
export default class Div extends Component {

    componentDidMount() {
        this.props.didMount(this.id);
    }

    clickHandler() {
        this.props.didMount({
            id: this.id
        });
    }

    render() {
        return (<div
                     id={ this.id }
                     onClick={ this.clickHandler }
                     dangerouslySetInnerHTML={ { __html: this.props.children } }></div>);
    }
}