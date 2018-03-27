import React, { Component } from "react";
import { connect } from "react-redux";
import { updateItemInfoModal, updateRsvpState, fetchRsvpDataFromBackend } from ".././actions/eventsAppActions";
import closeBttnImg from ".././images/closeBttnImg.png";


class ItemDetails extends Component {
  shouldComponentUpdate(newProps, newState) {
    if (
      JSON.stringify(this.props.eventsAppStore.itemInfoForModal) !== JSON.stringify(newProps.eventsAppStore.itemInfoForModal) ||
      this.props.eventsAppStore.showRSVP !== newProps.eventsAppStore.showRSVP ||
      this.props.eventsAppStore.isSideBarOpen !== newProps.eventsAppStore.isSideBarOpen ||
      this.props.eventsAppStore.showItemInfoModal !== newProps.eventsAppStore.showItemInfoModal
    ) {
      return true;
    } else {
      return false;
    }
  }

  closeItemInfoModal = () => {
    this.props.dispatch(updateItemInfoModal(null, false));
    (this.props.eventsAppStore.showRSVP) && (this.props.dispatch(updateRsvpState(false)));
  };

  handleRsvpBttn = (id) => {
    this.props.dispatch(updateRsvpState(true));
    this.props.dispatch(fetchRsvpDataFromBackend(id));
  }

  renderItemDetails = (item) => {
    let date = item.local_date.split('-');
    return (
      <ul>
        <li key={item.id} className="list">
          <div className="content-container">
            <h4 className="name">{item.name}</h4>
            <p ><span>Attendees: </span>{item.yes_rsvp_count}</p>
            <p ><span>Date: </span>{`${date[1]}/${date[2]}/${date[0]}`}</p>
            <p>
              <span>Address:</span>
              <div>{item.address_1} {item.address_2}</div>
              <div>{item.city}, {item.country.toUpperCase()}</div>
            </p>
            <p >
              <span>Description: </span >
              <p dangerouslySetInnerHTML={{ __html: item.description }} />
            </p>
            <button className="bttn" onClick={() => this.handleRsvpBttn(item.id)}>View RSVP</button>
            <button className="bttn" onClick={() => window.open(item.link)}>View Meetup</button>
            <br />
          </div>
        </li>
      </ul>
    )
  }

  renderRSVP = (itemArr) => {
    if (!itemArr) {
      return <h2>Loading The Data</h2>
    } else {
      return (
        <div style={{ height: "100%" }}>
          <h3>Attendees ({itemArr.length})</h3>
          <ul className="rsvp-container">
            {
              itemArr.map(item => {
                return (
                  <li>
                    <img src={item.member.photo.highres_link || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1000px-No_image_available.svg.png"} alt="" />
                    <p>{item.member.name}</p>
                  </li>
                )
              })
            }
          </ul>
        </div>
      )
    }
  }

  render() {
    if (this.props.eventsAppStore.showItemInfoModal) {
      let item = this.props.eventsAppStore.itemInfoForModal;
      return (
        <div className="item-details-modal-main">
          <div className={"item-details-modal-container " + (!this.props.eventsAppStore.isSideBarOpen ? 'sidebar-closed' : '')}>
            <img
              className="close-bttn-img"
              src={closeBttnImg}
              alt="Close Button"
              onClick={this.closeItemInfoModal}
            />
            {(this.props.eventsAppStore.showRSVP) ? this.renderRSVP(item) : this.renderItemDetails(item)}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps({ eventsAppStore }) {
  return { eventsAppStore };
}

export default connect(mapStateToProps)(ItemDetails);
