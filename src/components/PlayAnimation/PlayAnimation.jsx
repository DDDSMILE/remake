import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./playAnimation.scss";
// import { TADUM_SOUND_URL } from "../../requests";

const PlayAnimation = () => {
  const params = useParams();
  // let history = useHistory();
  //   const soundRef = useRef(null);
  //   const handleTadum = () => {
  //     soundRef.current.currentTime = 0;
  //     soundRef.current.play();
  //   };

  useEffect(() => {}, [params?.id]);

  return (
    <div className="PlayAnimation__wrp">
      <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModalLong"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModalLong"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLongTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Modal title
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayAnimation;
