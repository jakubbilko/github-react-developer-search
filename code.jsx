var Loading = React.createClass({
  render: function() {
    return (
      <h2>Loading...</h2>
    );
  }
});

var UserList = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Search results</h2>
        {this.props.users.map(function(user) {
          return (
          <div className="col-md-12 user panel panel-default">
            <div className="panel-body">
              <img src={user.avatar_url} alt="" />
              <h3>
                <a href={user.html_url} target="_blank">{user.login}</a>
              </h3>
            </div>
          </div>
        );
        }.bind(this))}
      </div>
    )
  }
});

var UserSearcher = React.createClass({

  getInitialState: function() {
    return {
      language: '',
      location: '',
      requesting: false,
      results: {}
    };
  },

  componentDidMount: function() {

  },

  handleChange: function(e) {
    var change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  },

  handleSubmit: function(e) {
    if(!this.state.requesting) {
      this.setState({ requesting: true, results: {} });
      var url = 'https://api.github.com/search/users?q=language:' + this.state.language + '+location:' + this.state.location;
      $.getJSON(url, function(result) {
        if(this.isMounted()) {
          this.setState({
            results: result.items,
            requesting: false
          });
        }
      }.bind(this));
    }
  },

  render: function() {
    var component;
    if(this.state.results.length && !this.state.requesting) component = <UserList users={this.state.results} />;
    else if(!this.state.results.length && this.state.requesting) component = <Loading />
    else component = '';
    return (
      <div>
        <h1>I'm looking for a <input type="text" value={this.state.language} name="language" placeholder="ruby, javascript..." onChange={this.handleChange} /> developer<br/>in <input type="text" name="location" value={this.state.location} placeholder="warsaw, london..." onChange={this.handleChange} /> <a className="btn btn-success" onClick={this.handleSubmit}>Search!</a></h1>
        {component}
      </div>
    );
  }

});

ReactDOM.render(<UserSearcher />, document.getElementById('component'));
