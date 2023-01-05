import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { deleteUser } from "../../../firebase/firebaseUtils";
import { selectCurrentUser } from "../../../redux/auth/auth.selectors";
// import MainComponent from "../MainComponent/MainComponent";
import "./index.css";
export default function IndexComponent(props) {
  const history = useHistory();
  const currentUser = useSelector(selectCurrentUser);
  const user = deleteUser(currentUser?.id);
  user.get().then((doc) => {
    if (doc.data()?.role !== "ADMIN") {
      history.push("/");
    }
  });
  return (
    <div className="index_container">
      <div className="">
        {" "}
        <div className="row row_index_container">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="header__left px-5">
              <img
                onClick={() => history.push("/browse")}
                src={window.location.origin + "/logo.png"}
                alt="Admin Logo"
                style={{ cursor: "pointer" }}
              />
              <div className="link">
                <Link to="/admin/account">Account</Link>
                <Link to="/admin/comment">Comment</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 px-5">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
