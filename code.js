"use strict";

var Loading = React.createClass({
  displayName: "Loading",

  render: function render() {
    return React.createElement(
      "h2",
      null,
      "Loading..."
    );
  }
});

var UserList = React.createClass({
  displayName: "UserList",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h2",
        null,
        "Search results"
      ),
      this.props.users.map((function (user) {
        return React.createElement(
          "div",
          { className: "col-md-12 user panel panel-default" },
          React.createElement(
            "div",
            { className: "panel-body" },
            React.createElement("img", { src: user.avatar_url, alt: "" }),
            React.createElement(
              "h3",
              null,
              React.createElement(
                "a",
                { href: user.html_url, target: "_blank" },
                user.login
              )
            )
          )
        );
      }).bind(this))
    );
  }
});

var UserSearcher = React.createClass({
  displayName: "UserSearcher",

  getInitialState: function getInitialState() {
    return {
      language: '',
      location: '',
      requesting: false,
      results: {}
    };
  },

  componentDidMount: function componentDidMount() {},

  handleChange: function handleChange(e) {
    var change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  },

  handleSubmit: function handleSubmit(e) {
    if (!this.state.requesting) {
      this.setState({ requesting: true, results: {} });
      var url = 'https://api.github.com/search/users?q=language:' + this.state.language + '+location:' + this.state.location;
      $.getJSON(url, (function (result) {
        if (this.isMounted()) {
          this.setState({
            results: result.items,
            requesting: false
          });
        }
      }).bind(this));
    }
  },

  render: function render() {
    var component;
    if (this.state.results.length && !this.state.requesting) component = React.createElement(UserList, { users: this.state.results });else if (!this.state.results.length && this.state.requesting) component = React.createElement(Loading, null);else component = '';
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        null,
        "I'm looking for a ",
        React.createElement("input", { type: "text", value: this.state.language, name: "language", placeholder: "ruby, javascript...", onChange: this.handleChange }),
        " developer",
        React.createElement("br", null),
        "in ",
        React.createElement("input", { type: "text", name: "location", value: this.state.location, placeholder: "warsaw, london...", onChange: this.handleChange }),
        " ",
        React.createElement(
          "a",
          { className: "btn btn-success", onClick: this.handleSubmit },
          "Search!"
        )
      ),
      component
    );
  }

});

ReactDOM.render(React.createElement(UserSearcher, null), document.getElementById('component'));

