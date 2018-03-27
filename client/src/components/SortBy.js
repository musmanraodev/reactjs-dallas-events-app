import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { withRouter } from "react-router-dom";
import Dropdown from 'react-dropdown'

import {
  changeUserInputSortBy,
  changeUrlToUserInput,
  changeShouldFetch,
  changeComingFromInput,
  fetchMeetupApiDataFromBackend,
} from "../actions/eventsAppActions";


class SortBy extends Component {
  shouldComponentUpdate(newProps, newState) {
    let oldData = this.props.eventsAppStore;
    let newData = newProps.eventsAppStore;
    if (
      oldData.userInput.sortBy !== newData.userInput.sortBy
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleSortByChange = (e) => {
    this.props.dispatch(changeUserInputSortBy(e.value))
    this.props.dispatch(changeUrlToUserInput(this.props.eventsAppStore.userInput.searchBoxValue, e.value, this.props.eventsAppStore.userInput.maxResults, this.props.history))
    this.submitForm(e.value);
  }

  submitForm = (value) => {
    this.props.dispatch(changeShouldFetch(true));
    this.props.dispatch(changeComingFromInput(true));
    this.props.dispatch(fetchMeetupApiDataFromBackend(this.props.eventsAppStore.userInput.maxResults, value));
  };

  render() {
    return (
      <div className="sortby">
        <Dropdown
          name="sortBy"
          options={['Best Match', 'Least Attendees', 'Most Attendees', 'Earliest Date', 'Latest Date']}
          onChange={this.handleSortByChange}
          value={this.props.eventsAppStore.userInput.sortBy}
          placeholder="Select an option"
          ref="sortBy"
        />
      </div>
    );
  }
}

function mapStateToProps({ eventsAppStore }) {
  return { eventsAppStore };
}

export default withRouter(connect(mapStateToProps)(SortBy));
