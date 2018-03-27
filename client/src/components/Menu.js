import React, { Component } from "react";
import { connect } from "react-redux";
import { updateItemInfoModal, updateMenu, updateResults, updateSideBarState, deleteFavItemFromDB, updateRsvpState } from ".././actions/eventsAppActions";
import zoomBttnImg from ".././images/zoomBttnImg.png";
import delBttnImg from ".././images/delBttnImg.png";
import { scaleRotate as Menu } from "react-burger-menu";

class BurgerMenu extends Component {
  shouldComponentUpdate(newProps, newState) {
    return ((this.props.eventsAppStore.updateMenu !== newProps.eventsAppStore.updateMenu) || (JSON.stringify(this.props.eventsAppStore.favDataFromDB) !== JSON.stringify(newProps.eventsAppStore.favDataFromDB)));
  }

  deleteItem = id => {
    if (this.props.eventsAppStore.userInfo.id === null) {
      let savedItemsObj = JSON.parse(localStorage.getItem("savedItemsObj"));
      delete savedItemsObj[id];
      localStorage.setItem("savedItemsObj", JSON.stringify(savedItemsObj));
      this.props.dispatch(updateMenu());
      this.props.dispatch(updateResults());
    } else {
      this.props.dispatch(deleteFavItemFromDB(id, this.props.eventsAppStore.userInfo.id));
    }

  };

  openItem = item => {
    (this.props.eventsAppStore.showRSVP) && (this.props.dispatch(updateRsvpState(false)));
    this.props.dispatch(updateItemInfoModal(item, true));
  };

  handleMenuStateChange = e => {
    this.props.dispatch(updateSideBarState(e.isOpen));
  }

  renderList = () => {
    let savedItemsObj = (this.props.eventsAppStore.hasFetchedFavDataFromDB && this.props.eventsAppStore.favDataFromDB) || (JSON.parse(localStorage.getItem("savedItemsObj")));
    if (savedItemsObj !== null) {
      let monthArr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEV"];
      let listArr = [];
      for (let key in savedItemsObj) {
        let date = savedItemsObj[key].local_date.split('-');
        let headingDate = `${date[2]} ${monthArr[date[1] - 1]}`;
        listArr.push(
          <li key={savedItemsObj[key].item_id}>
            <div className="img-container">
              <h3 className="heading-date">{headingDate}</h3>
            </div>
            <h4 className="name">{savedItemsObj[key].name}</h4>
            <div className="options">
              <img
                onClick={e => this.openItem(savedItemsObj[key])}
                className="open-img-bttn"
                src={zoomBttnImg}
                alt="Zoom Button"
              />
              <img
                onClick={e => this.deleteItem(savedItemsObj[key].item_id)}
                className="delete-img-bttn"
                src={delBttnImg}
                alt="Delete Button"
              />
            </div>
          </li>
        )
      }
      return listArr;
    }
  };

  render() {
    return (
      <Menu
        onStateChange={this.handleMenuStateChange}
        className="sidebar"
        width={"15%"}
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
      >
        <ul>{this.renderList()}</ul>
      </Menu>
    );
  }
}

function mapStateToProps({ eventsAppStore }) {
  return { eventsAppStore };
}

export default connect(mapStateToProps)(BurgerMenu);
